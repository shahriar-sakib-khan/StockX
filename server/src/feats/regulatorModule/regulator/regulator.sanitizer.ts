import { HydratedDocument } from 'mongoose';

import { resolveRef, listSanitizer, storeSanitizer, userSanitizer } from '@/sanitizers/index.js';

import { IRegulator } from './index.js';

/**
 * ----------------- Regulator -----------------
 */
export const regulatorSanitizer = (regulator: IRegulator | HydratedDocument<IRegulator>) => ({
  id: String(regulator._id),
  store: resolveRef(regulator.store, storeSanitizer),

  name: regulator.name,
  regulatorImage: regulator.regulatorImage ?? null,
  regulatorType: regulator.regulatorType,
  price: regulator.price,
  stockCount: regulator.stockCount,
  problemCount: regulator.problemCount,

  createdBy: resolveRef(regulator.createdBy, userSanitizer),
  createdAt: regulator.createdAt,
  updatedAt: regulator.updatedAt,
});

export type SanitizedRegulator = ReturnType<typeof regulatorSanitizer>;

/**
 * ----------------- Regulator List -----------------
 * Can optionally select only specific fields
 */
export const allRegulatorSanitizer = (
  regulators: IRegulator[] | HydratedDocument<IRegulator>[],
  fields?: (keyof SanitizedRegulator)[]
) => ({
  regulators: listSanitizer(regulators, regulatorSanitizer, fields),
});

export type SanitizedRegulators = ReturnType<typeof allRegulatorSanitizer>;
