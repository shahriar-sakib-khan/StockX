import { StatusCodes } from "http-status-codes";
import { transactionService } from "../../services/v1/index.js";

/**
 * @desc Get transaction history (of own or other users)
 */
export const getUserTransactionHistory = async (req, res, next) => {
  const { page = 1, limit = 20, status, search } = req.query;

  // Use user ID from route param or authenticated user
  const userId = req.params.id || req.user.userId;

  const transactions = await transactionService.getUserTransactionService({
    userId,
    page: Number(page),
    limit: Number(limit),
    status,
    search,
  });

  res.status(StatusCodes.OK).json(transactions);
};
