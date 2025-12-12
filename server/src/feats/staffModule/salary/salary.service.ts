import { Types, ClientSession } from 'mongoose';

import { assertHierarchy } from '../staff/staff.middleware.js';

import { salaryValidator, salarySanitizers } from './index.js';

import { AuthUser } from '@/common/assertions.js';
import { Errors } from '@/error/index.js';
import { Staff, IStaff } from '@/feats/staffModule/staff/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function getPayrollList
 * @description List staff with their salary details. (Read-Only)
 */
export const getPayrollList = async (
  storeId: string,
  page: number,
  limit: number
): Promise<{ salaries: Partial<salarySanitizers.SanitizedSalary>[]; total: number }> => {
  const skip = (page - 1) * limit;
  const storeObjectId = new Types.ObjectId(storeId);

  // Filter: Active staff only
  const query = {
    store: storeObjectId,
    isActive: true,
  };

  const [docs, total] = await Promise.all([
    Staff.find(query).skip(skip).limit(limit).select('name role payroll updatedAt store').lean(),
    Staff.countDocuments(query),
  ]);

  return {
    salaries: salarySanitizers.allSalarySanitizer(docs as unknown as IStaff[]).salaries,
    total,
  };
};

/**
 * @function getStaffSalary
 * @description Get specific staff salary details.
 */
export const getStaffSalary = async (
  storeId: string,
  staffId: string
): Promise<salarySanitizers.SanitizedSalary> => {
  const staff = await Staff.findOne({
    _id: new Types.ObjectId(staffId),
    store: new Types.ObjectId(storeId),
  }).lean();

  if (!staff) throw new Errors.NotFoundError('Staff member not found');

  return salarySanitizers.salarySanitizer(staff as unknown as IStaff);
};

/**
 * @function setSalary
 * @description Configure base salary. Enforces hierarchy checks.
 */
export const setSalary = async (
  storeId: string,
  staffId: string,
  actor: AuthUser,
  data: salaryValidator.SetSalaryInput,
  session?: ClientSession
): Promise<salarySanitizers.SanitizedSalary> => {
  const isGlobalOwner = actor.type !== 'staff';

  // 1. Fetch target for hierarchy check
  const targetStaff = await Staff.findById(staffId).select('role username').lean();
  if (!targetStaff) throw new Errors.NotFoundError('Staff member not found');

  // 2. Hierarchy Check (e.g., Admin cannot set salary for another Admin)
  assertHierarchy(actor.role, targetStaff.role, isGlobalOwner);

  // 3. Update
  const staff = await Staff.findOneAndUpdate(
    {
      _id: new Types.ObjectId(staffId),
      store: new Types.ObjectId(storeId),
    },
    { $set: { 'payroll.baseSalary': data.amount } },
    { new: true, session, runValidators: true }
  ).lean();

  logger.info(
    `Salary updated for ${targetStaff.username} (${staffId}) by ${actor.userId} in store ${storeId}`
  );

  return salarySanitizers.salarySanitizer(staff as unknown as IStaff);
};

/**
 * @function removeSalary
 * @description Reset salary config to 0. Enforces hierarchy checks.
 */
export const removeSalary = async (
  storeId: string,
  staffId: string,
  actor: AuthUser,
  session?: ClientSession
): Promise<salarySanitizers.SanitizedSalary> => {
  const isGlobalOwner = actor.type !== 'staff';

  const targetStaff = await Staff.findById(staffId).select('role username').lean();
  if (!targetStaff) throw new Errors.NotFoundError('Staff member not found');

  // Hierarchy Check
  assertHierarchy(actor.role, targetStaff.role, isGlobalOwner);

  const staff = await Staff.findOneAndUpdate(
    {
      _id: new Types.ObjectId(staffId),
      store: new Types.ObjectId(storeId),
    },
    { $set: { 'payroll.baseSalary': 0 } },
    { new: true, session }
  ).lean();

  logger.info(
    `Salary removed for ${targetStaff.username} (${staffId}) by ${actor.userId} in store ${storeId}`
  );

  return salarySanitizers.salarySanitizer(staff as unknown as IStaff);
};

export default {
  getPayrollList,
  getStaffSalary,
  setSalary,
  removeSalary,
};
