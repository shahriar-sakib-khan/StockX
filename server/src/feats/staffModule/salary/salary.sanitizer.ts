import { HydratedDocument } from 'mongoose';

import { IStaff } from '../index.js';

import { listSanitizer, resolveRef, storeSanitizer } from '@/sanitizers/index.js';

// Specific sanitizer for Salary View
export const salarySanitizer = (doc: IStaff | HydratedDocument<IStaff>) => ({
  id: String(doc._id),
  store: resolveRef(doc.store, storeSanitizer),
  name: doc.name,
  role: doc.role,

  // Focused Payload
  payroll: {
    baseSalary: doc.payroll.baseSalary,
    currentDue: doc.payroll.currentDue,
    totalPaid: doc.payroll.totalPaid,
    lastPaymentDate: doc.payroll.lastPaymentDate || null,
  },
  updatedAt: doc.updatedAt,
});

export type SanitizedSalary = ReturnType<typeof salarySanitizer>;

export const allSalarySanitizer = (
  docs: IStaff[] | HydratedDocument<IStaff>[],
  fields?: (keyof SanitizedSalary)[]
) => ({
  salaries: listSanitizer(docs, salarySanitizer, fields),
});
