import { Types, ClientSession } from 'mongoose';

import { Shop, IShop, shopSanitizers, shopValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function createShop
 * @description Creates a new shop under a store.
 */
export const createShop = async (
  data: shopValidator.CreateShopInput,
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<shopSanitizers.SanitizedShop> => {
  const existing = await Shop.exists({
    store: storeId,
    shopName: data.shopName,
    location: data.location,
  }).session(session || null);

  if (existing) {
    throw new Errors.BadRequestError(`Shop '${data.shopName}' already exists at this location`);
  }

  const [shop] = await Shop.create(
    [
      {
        ...data,
        store: new Types.ObjectId(storeId),
        createdBy: new Types.ObjectId(userId),
        totalDue: 0,
      },
    ],
    { session }
  );

  logger.info(`Shop created: ${shop.shopName} (${shop._id})`);

  return shopSanitizers.shopSanitizer(shop);
};

/**
 * @function getAllShops
 * @description Retrieves all shops for a store with pagination.
 */
export const getAllShops = async (
  storeId: string,
  page: number,
  limit: number
): Promise<{ shops: Partial<shopSanitizers.SanitizedShop>[]; total: number }> => {
  const total = await Shop.countDocuments({ store: storeId });
  const shops = await Shop.find({ store: storeId })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    shops: shopSanitizers.allShopSanitizer(shops as unknown as IShop[], [
      'id',
      'shopName',
      'location',
      'phoneNumber',
      'totalDue',
    ]).shops,
    total,
  };
};

/**
 * @function getShopById
 * @description Retrieves a single shop by ID.
 */
export const getShopById = async (
  shopId: string,
  storeId: string
): Promise<shopSanitizers.SanitizedShop> => {
  const shop = await Shop.findOne({ _id: shopId, store: storeId }).lean();
  if (!shop) throw new Errors.NotFoundError('Shop not found');

  return shopSanitizers.shopSanitizer(shop as unknown as IShop);
};

/**
 * @function updateShop
 * @description Updates a shop's details.
 */
export const updateShop = async (
  shopId: string,
  storeId: string,
  userId: string,
  data: shopValidator.UpdateShopInput,
  session?: ClientSession
): Promise<shopSanitizers.SanitizedShop> => {
  const shop = await Shop.findOneAndUpdate(
    { _id: shopId, store: storeId },
    {
      $set: data,
      updatedBy: new Types.ObjectId(userId),
    },
    { new: true, session, runValidators: true }
  ).lean();

  if (!shop) throw new Errors.NotFoundError('Shop not found');

  logger.info(`Shop updated: ${shop.shopName} (${shop._id})`);

  return shopSanitizers.shopSanitizer(shop as unknown as IShop);
};

/**
 * @function deleteShop
 * @description Deletes a shop from a store.
 */
export const deleteShop = async (
  shopId: string,
  storeId: string,
  session?: ClientSession
): Promise<shopSanitizers.SanitizedShop> => {
  const shop = await Shop.findOneAndDelete({ _id: shopId, store: storeId }, { session }).lean();

  if (!shop) throw new Errors.NotFoundError('Shop not found');

  logger.info(`Shop deleted: ${shop.shopName} (${shop._id})`);

  return shopSanitizers.shopSanitizer(shop as unknown as IShop);
};

export default {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
};
