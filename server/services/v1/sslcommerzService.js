import {
  BadRequestError,
  NotFoundError,
  ServerError,
  UnauthenticatedError,
} from "../../error/customErrors.js";
import { User, Transaction } from "../../models/index.js";
import {
  initiateSSLPayment,
  validatePaymentWithSSLCOMMERZ,
} from "../../utils/index.js";

/**
 * Initiate payment session with payment data
 *
 */
export const initiatePaymentSessionService = async (userId, userData) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new NotFoundError("User not found");

  if (user.roles.includes("admin"))
    throw new BadRequestError("User is already admin — no need to pay again.");

  const { amount, phone } = userData;
  const { username, email, address } = user;
  const tranId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const paymentData = {
    // Credentials
    total_amount: amount,
    currency: "BDT",
    tran_id: tranId,
    value_a: userId,

    // Callback URLs
    success_url: `${process.env.SERVER_URL}/api/v1/payment/success/${tranId}`,
    fail_url: `${process.env.SERVER_URL}/api/v1/payment/fail`,
    cancel_url: `${process.env.SERVER_URL}/api/v1/payment/cancel`,
    ipn_url: `${process.env.NGROK_URL}/api/v1/payment/ipn`,

    // Product Details
    product_name: `Premium Subscription - ${username}`,
    product_category: "subscription",
    product_profile: "non-physical-goods",
    shipping_method: "NO",

    // Customer Details
    cus_name: username,
    cus_email: email,
    cus_phone: phone,
    cus_add1: address,
    // cus_add2: "Ctg",
    // cus_city: "Ctg",
    // cus_state: "Ctg",
    // cus_postcode: "1000",
    cus_country: "Bangladesh",
    // cus_fax: "01711111111",

    // Shipping details
    ship_name: username,
    // ship_add1: "Ctg",
    // ship_add2: "Ctg",
    // ship_city: "Ctg",
    // ship_state: "Ctg",
    // ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  console.log(`Initiating Payment for ${username}`);

  // ✅ Save Transaction
  await Transaction.create({
    user: userId,
    tran_id: tranId,
    amount,
    currency: "BDT",
    status: "pending",
    purpose: "admin_upgrade",
    email,
    phone,
    gateway: "SSLCOMMERZ",
  });

  const response = await initiateSSLPayment(paymentData);

  if (!response || !response.GatewayPageURL)
    throw new ServerError("Failed to initiate payment");

  return response;
};

/**
 * Handle IPN from SSLCOMMERZ and confirm payment via Validation API
 *
 */
export const handleIPNService = async (ipnData) => {
  const { value_a: userId, tran_id, amount, val_id } = ipnData;

  // Data from SSLCOMMERZ Validator API
  const validationData = await validatePaymentWithSSLCOMMERZ(val_id);

  // Verify transaction authenticity
  if (validationData.value_a !== userId || validationData.tran_id !== tran_id)
    throw new UnauthenticatedError("Invalid user or transaction");

  // ✅ Fetch Transaction Record
  const transaction = await Transaction.findOne({ tran_id });
  if (!transaction) throw new NotFoundError("Transaction not found");

  // Validate payment authenticity
  const amountValid = Number(Number(validationData.amount)) >= Number(amount);
  const currencyValid = validationData.currency === "BDT";
  const riskLevelValid = Number(validationData.risk_level) === 0;
  const paymentValid = validationData.status === "VALID";

  if (!(paymentValid && amountValid && currencyValid && riskLevelValid)) {
    await Transaction.findByIdAndUpdate(transaction._id, { status: "failed" });
    console.warn(`❌ Validation failed for tran_id: ${tran_id}`);
    throw new BadRequestError("Invalid payment credentials");
  }

  await Transaction.findByIdAndUpdate(transaction._id, {
    status: "success",
    raw_payload: validationData,
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { roles: "admin" } },
    { new: true }
  );

  if (!user) throw new NotFoundError("User not found after payment");
  
  console.log(`✅ Payment Success: ${tran_id}, Role upgraded`);
  return user;
};
