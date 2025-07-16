import { StatusCodes } from "http-status-codes";

import { sslService } from "../../services/v1/index.js";

/**
 * Initiates Payment via SSLCOMMERZ
 */
export const createPaymentSession = async (req, res) => {
  const response = await sslService.createPaymentSessionService(
    req.user.userId,
    req.body
  );

  res.status(StatusCodes.OK).json({ url: response.GatewayPageURL });
};

/**
 * IPN Handler → Securely upgrades role to 'admin'
 */
export const handleIPN = async (req, res) => {
  const promotedUser = await sslService.handleIPNService(req.body);
  console.log(`${promotedUser.username} was promoted to admin`);

  return res
    .status(StatusCodes.OK)
    .json({ message: `${promotedUser.username} was promoted to admin` });
};

/**
 * Redirected payment succeeded page
 */
export const successPayment = async (req, res) => {
  console.log(`Payment done with transaction ID: ${req.params.tranId}`);

  res.status(StatusCodes.OK).json({ msg: "Payment done" });
};

/**
 * Redirected payment failed page
 */
export const failedPayment = async (req, res) => {
  console.log("Payment failed");

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Payment failed" });
};

/**
 * Redirected payment canceled page
 */
export const cancelPayment = async (req, res) => {
  console.log("Payment canceled");

  res.status(StatusCodes.OK).json({ msg: "Payment canceled" });
};
