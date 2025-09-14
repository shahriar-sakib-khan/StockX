import { HydratedDocument } from 'mongoose';

import { IStaff } from '@/feats/staff/index.js';
import {
  resolveRef,
  listSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Staff -----------------
 */
export const staffSanitizer = (staff: IStaff | HydratedDocument<IStaff>) => ({
  id: String(staff._id),
  name: staff.name,
  phone: staff.phone,
  role: staff.role,
  image: staff.image ?? null,

  salary: staff.salary,
  joiningDate: staff.joiningDate,

  workspace: resolveRef(staff.workspace ?? null, workspaceSanitizer),
  division: resolveRef(staff.division ?? null, divisionSanitizer),

  createdAt: staff.createdAt,
  updatedAt: staff.updatedAt,
});

export type SanitizedStaff = ReturnType<typeof staffSanitizer>;

/**
 * ----------------- Staff List -----------------
 * Optional field selection supported
 */
export const allStaffSanitizer = (
  staffList: IStaff[] | HydratedDocument<IStaff>[],
  fields?: (keyof SanitizedStaff)[]
) => ({
  staff: listSanitizer(staffList, staffSanitizer, fields),
});

export type SanitizedStaffs = ReturnType<typeof allStaffSanitizer>;
