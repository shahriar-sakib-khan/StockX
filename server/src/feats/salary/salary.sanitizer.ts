import { HydratedDocument } from 'mongoose';

import { ISalary } from './salary.model.js';
import {
  resolveRef,
  listSanitizer,
  divisionMembershipSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
  cycleSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Single salary -----------------
 */
export const salarySanitizer = (salary: ISalary | HydratedDocument<ISalary>) => ({
  id: String(salary._id),
  member: resolveRef(salary.member ?? null, divisionMembershipSanitizer),
  division: resolveRef(salary.division ?? null, divisionSanitizer),
  workspace: resolveRef(salary.workspace ?? null, workspaceSanitizer),
  cycle: resolveRef(salary.cycle ?? null, cycleSanitizer),

  monthlySalary: salary.monthlySalary,
  paidAmount: salary.paidAmount,
  dueAmount: salary.dueAmount,
  isPaid: salary.isPaid ?? false,

  createdAt: salary.createdAt,
  updatedAt: salary.updatedAt,
});

export type SanitizedSalary = ReturnType<typeof salarySanitizer>;

/**
 * ----------------- List of DivMemberSalaries -----------------
 * Optional field selection supported
 */
export const allSalarySanitizer = (
  salaryList: ISalary[] | HydratedDocument<ISalary>[],
  fields?: (keyof SanitizedSalary)[]
) => ({
  salaries: listSanitizer(salaryList, salarySanitizer, fields),
});

export type SanitizedSalaries = ReturnType<typeof allSalarySanitizer>;
