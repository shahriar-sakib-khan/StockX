import { HydratedDocument } from 'mongoose';

import { IStaff } from './index.js';

import { listSanitizer } from '@/sanitizers/index.js';

export const staffSanitizer = (doc: IStaff | HydratedDocument<IStaff>) => ({
  id: String(doc._id),
  username: doc.username,
  role: doc.role,
  isActive: doc.isActive,

  name: doc.name,
  phone: doc.phone,
  image: doc.image || null,
  address: doc.address || null,

  payroll: {
    baseSalary: doc.payroll.baseSalary,
    currentDue: doc.payroll.currentDue,
    totalPaid: doc.payroll.totalPaid,
    lastPaymentDate: doc.payroll.lastPaymentDate || null,
  },

  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export type SanitizedStaff = ReturnType<typeof staffSanitizer>;

export const allStaffSanitizer = (
  docs: IStaff[] | HydratedDocument<IStaff>[],
  fields?: (keyof SanitizedStaff)[]
) => ({
  staffs: listSanitizer(docs, staffSanitizer, fields), // <--- FIXED: Key is now 'staffs'
});
