import { HydratedDocument } from 'mongoose';

import { IAccount } from '@/models/index.js';
import {
  resolveRef,
  listSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Account -----------------
 */
export const accountSanitizer = (account: IAccount | HydratedDocument<IAccount>) => ({
  id: String(account._id),
  code: account.code,
  name: account.name,
  type: account.type,
  isActive: account.isActive,

  workspace: resolveRef(account.workspace ?? null, workspaceSanitizer),
  division: resolveRef(account.division ?? null, divisionSanitizer),

  createdAt: account.createdAt,
  updatedAt: account.updatedAt,
});

export type SanitizedAccount = ReturnType<typeof accountSanitizer>;

/**
 * ----------------- Account List -----------------
 * Can optionally select only specific fields
 */
export const allAccountSanitizer = (
  accounts: IAccount[] | HydratedDocument<IAccount>[],
  fields?: (keyof SanitizedAccount)[]
) => ({
  accounts: listSanitizer(accounts, accountSanitizer, fields),
});

export type SanitizedAccounts = ReturnType<typeof allAccountSanitizer>;
