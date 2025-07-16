import axios from "axios";
import SSLCommerz from "sslcommerz-lts";

import { User } from "../models/index.js";

export const initiateSSLPayment = (paymentData) => {
  const sslcz = new SSLCommerz(
    process.env.SSLCZ_STORE_ID,
    process.env.SSLCZ_STORE_PASSWORD,
    process.env.SSLCZ_IS_LIVE === "true"
  );
  return sslcz.init(paymentData);
};

export const getCustomerInfo = async (userId) => {
  const user = await User.findOne({ email: cus_email });
  if (!user) throw new NotFoundError("User not found");
  return user;
};

/**
 * Validate Payment with SSLCOMMERZ Validator API using val_id
 */
export const validatePaymentWithSSLCOMMERZ = async (val_id) => {
  const baseUrl =
    process.env.SSLCZ_IS_LIVE === "true"
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";

  const validationUrl = `${baseUrl}/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.SSLCZ_STORE_ID}&store_passwd=${process.env.SSLCZ_STORE_PASSWORD}&format=json`;

  const { data } = await axios.get(validationUrl);
  return data;
};
