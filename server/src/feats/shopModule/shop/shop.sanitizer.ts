import { HydratedDocument } from 'mongoose';

import { IShop } from './index.js';

import { listSanitizer, resolveRef, userSanitizer, storeSanitizer } from '@/sanitizers/index.js';

export const shopSanitizer = (doc: IShop | HydratedDocument<IShop>) => ({
  id: String(doc._id),
  store: resolveRef(doc.store, storeSanitizer),
  shopName: doc.shopName,
  ownerName: doc.ownerName || null,
  phoneNumber: doc.phoneNumber || null,
  location: doc.location,
  image: doc.image || null,

  // Stats
  totalDue: doc.totalDue,
  totalPurchases: doc.totalPurchases,
  totalPayments: doc.totalPayments,
  totalDeliveries: doc.totalDeliveries,

  createdBy: resolveRef(doc.createdBy, userSanitizer),
  updatedBy: resolveRef(doc.updatedBy, userSanitizer),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export type SanitizedShop = ReturnType<typeof shopSanitizer>;

export const allShopSanitizer = (
  docs: IShop[] | HydratedDocument<IShop>[],
  fields?: (keyof SanitizedShop)[]
) => ({
  shops: listSanitizer(docs, shopSanitizer, fields),
});
