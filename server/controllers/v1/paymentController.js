import { StatusCodes } from "http-status-codes";

import { sslService } from "../../services/v1/index.js";

/**
 * Initiates Payment via SSLCOMMERZ
 */
export const initiatePaymentSession = async (req, res) => {
  const response = await sslService.initiatePaymentSessionService(
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