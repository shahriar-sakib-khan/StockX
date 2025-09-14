import { HydratedDocument } from 'mongoose';

import { ITxCategory } from '@/models/index.js';
import {
  resolveRef,
  listSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Transaction Category -----------------
 */
export const txCategorySanitizer = (category: ITxCategory | HydratedDocument<ITxCategory>) => ({
  id: String(category._id),
  code: category.code,
  name: category.name,
  debitAccountCode: category.debitAccountCode,
  creditAccountCode: category.creditAccountCode,
  descriptionTemplate: category.descriptionTemplate ?? null,
  isActive: category.isActive,

  workspace: resolveRef(category.workspace ?? null, workspaceSanitizer),
  division: resolveRef(category.division ?? null, divisionSanitizer),

  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export type SanitizedTxCategory = ReturnType<typeof txCategorySanitizer>;

/**
 * ----------------- Transaction Category List -----------------
 * Can optionally select only specific fields
 */
export const allTxCategorySanitizer = (
  categories: ITxCategory[] | HydratedDocument<ITxCategory>[],
  fields?: (keyof SanitizedTxCategory)[]
) => ({
  categories: listSanitizer(categories, txCategorySanitizer, fields),
});

export type SanitizedTxCategories = ReturnType<typeof allTxCategorySanitizer>;
