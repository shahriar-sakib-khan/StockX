import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';

/**
 * ----------------- Create Exchange Service -----------------
 */
export const createExchange = async (payload: any, userId: string) => {
  const {
    shopId,
    cylinders,
    totalPrice,
    paidAmount,
    due,
    paymentMethod,
    quantity,
    vehicleId,
    details,
    ref,
  } = payload;

  if (!shopId || !cylinders?.give || !cylinders?.take) {
    throw new Errors.BadRequestError('Invalid payload for cylinder exchange.');
  }

  const ex = 'exchange data';

  return ex;
};

// /**
//  * ----------------- Get Paginated Exchanges -----------------
//  */
// export const getAllExchanges = async (storeId: string, page: number, limit: number) => {
//   const filter = { shopId: new Types.ObjectId(storeId) };

//   const total = await Exchange.countDocuments(filter);
//   if (total === 0) return { exchanges: [], total };

//   const skip = (page - 1) * limit;

//   const exchanges = await Exchange.find(filter).skip(skip).limit(limit).lean();

//   return {
//     exchanges: exchangeSanitizers.allExchangeSanitizer(exchanges),
//     total,
//   };
// };

// /**
//  * ----------------- Get Single Exchange -----------------
//  */
// export const getExchangeById = async (id: string) => {
//   const exchange = await Exchange.findById(id).lean();

//   if (!exchange) throw new Errors.NotFoundError('Exchange record not found.');

//   return exchangeSanitizers.exchangeSanitizer(exchange);
// };

/**
 * ----------------- Default Export -----------------
 */
export default {
  createExchange,
  //   getAllExchanges,
  //   getExchangeById,
};
