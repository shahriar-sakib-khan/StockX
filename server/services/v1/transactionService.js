import { NotFoundError } from "../../error/customErrors.js";
import { Transaction, User } from "../../models/index.js";

/**
 * Get User Transaction History
 */
export const getUserTransactionService = async ({
  userId,
  page,
  limit,
  status,
  search,
}) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new NotFoundError("User not found");

  const query = { user: userId };

  if (status) query.status = status;
  if (search) query.tran_id = new RegExp(search, "i");

  const transactions = await Transaction.find(query)
    .populate("user", "email username roles")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return transactions;
};
