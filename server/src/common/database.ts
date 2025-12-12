import mongoose, { ClientSession } from 'mongoose';

import logger from '@/utils/logger.util.js';

/**
 * Wraps a database operation in a transaction.
 * Automatically handles commit, abort, and session ending.
 */
export const withTransaction = async <T>(
  operation: (session: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    logger.error('Transaction aborted due to error', error);
    throw error;
  } finally {
    session.endSession();
  }
};
