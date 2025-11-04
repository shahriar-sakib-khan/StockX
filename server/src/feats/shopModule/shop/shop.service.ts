/**
 * @module shop.service
 *
 * @description Services for shop management within a store.
 */

import { Types } from 'mongoose';
import { Errors } from '@/error/index.js';
import { Shop, shopSanitizers, shopValidator } from './index.js';

/**
 * ----------------- Create Shop -----------------
 */
export const createShop = async (
  payload: shopValidator.CreateShopInput,
  userId: string,
  storeId: string
): Promise<shopSanitizers.SanitizedShop> => {
  const { shopName, ownerName, phoneNumber, location, image } = payload;

  const existing = await Shop.exists({ store: storeId, shopName, location });
  if (existing)
    throw new Errors.BadRequestError(`Shop with this name already exists at ${location}`);

  const shop = await Shop.create({
    store: new Types.ObjectId(storeId),
    shopName,
    ownerName,
    phoneNumber,
    location,
    image,
    totalDue: 100,
    createdBy: new Types.ObjectId(userId),
  });

  return shopSanitizers.shopSanitizer(shop);
};

/**
 * ----------------- Get All Shops -----------------
 */
export const getAllShops = async (
  storeId: string,
  page: number,
  limit: number
): Promise<shopSanitizers.SanitizedShops & { total: number }> => {
  const total = await Shop.countDocuments({ store: storeId });
  if (total === 0) return { shops: [], total };

  const skip = (page - 1) * limit;
  const shops = await Shop.find({ store: storeId }).skip(skip).limit(limit).lean();

  return {
    shops: shopSanitizers.allShopSanitizer(shops, [
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
 * ----------------- Get Single Shop -----------------
 */
export const getShopById = async (storeId: string, shopId: string) => {
  const shop = await Shop.findOne({ _id: shopId, store: storeId }).lean();

  if (!shop) throw new Errors.NotFoundError('Shop not found');

  return shopSanitizers.shopSanitizer(shop);
};

/**
 * ----------------- Update Shop -----------------
 */
export const updateShop = async (
  payload: shopValidator.UpdateShopInput,
  userId: string,
  storeId: string,
  shopId: string
) => {
  const { shopName, ownerName, phoneNumber, location, image } = payload;

  const existing = await Shop.exists({ store: storeId, shopName, location });
  if (existing)
    throw new Errors.BadRequestError(`Shop with this name already exists at ${location}`);

  const updatedShop = await Shop.findOneAndUpdate(
    { _id: shopId, store: storeId },
    {
      shopName,
      ownerName,
      phoneNumber,
      location,
      image,
      updatedBy: new Types.ObjectId(userId),
      updatedAt: new Date(),
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedShop) throw new Errors.NotFoundError('Shop not found');

  return shopSanitizers.shopSanitizer(updatedShop);
};

/**
 * ----------------- Delete Shop -----------------
 */
export const deleteShop = async (storeId: string, shopId: string) => {
  const deleted = await Shop.findOneAndDelete({ _id: shopId, store: storeId }).lean();

  if (!deleted) throw new Errors.NotFoundError('Shop not found');

  return shopSanitizers.shopSanitizer(deleted);
};

export default {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
};
