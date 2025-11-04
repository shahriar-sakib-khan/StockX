import { HydratedDocument } from 'mongoose';
import { resolveRef, listSanitizer, storeSanitizer, userSanitizer } from '@/sanitizers/index.js';
import { IShop } from './index.js';

/**
 * ----------------- Shop Sanitizer -----------------
 */
export const shopSanitizer = (shop: IShop | HydratedDocument<IShop>) => ({
  id: String(shop._id),
  store: resolveRef(shop.store ?? null, storeSanitizer),

  shopName: shop.shopName,
  ownerName: shop.ownerName ?? null,
  phoneNumber: shop.phoneNumber ?? null,
  location: shop.location,
  image: shop.image ?? null,

  totalDue: shop.totalDue,
  totalPurchases: shop.totalPurchases,
  totalPayments: shop.totalPayments,
  totalDeliveries: shop.totalDeliveries,

  createdBy: resolveRef(shop.createdBy, userSanitizer),
  updatedBy: resolveRef(shop.updatedBy ?? null, userSanitizer),
  createdAt: shop.createdAt,
  updatedAt: shop.updatedAt,
});

export type SanitizedShop = ReturnType<typeof shopSanitizer>;

export const allShopSanitizer = (
  shops: IShop[] | HydratedDocument<IShop>[],
  fields?: (keyof SanitizedShop)[]
) => ({
  shops: listSanitizer(shops, shopSanitizer, fields),
});

export type SanitizedShops = ReturnType<typeof allShopSanitizer>;
