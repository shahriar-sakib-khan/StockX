import { Types, ClientSession } from 'mongoose';

import { Staff, IStaff, staffSanitizers, staffValidator, staffMiddleware } from './index.js';

import { AuthUser } from '@/common/assertions.js';
import { Errors } from '@/error/index.js';
import { Store } from '@/feats/storeModule/index.js';
import { Passwords, JWTs, logger } from '@/utils/index.js';

/**
 * @function createStaff
 * @description Create a new staff member
 */
export const createStaff = async (
  storeId: string,
  actor: AuthUser,
  data: staffValidator.CreateStaffInput,
  session?: ClientSession
): Promise<staffSanitizers.SanitizedStaff> => {
  // Hierarchy Check
  // Global Users (type undefined or 'user') are treated as Owners (supreme)
  const isGlobalOwner = actor.type !== 'staff';
  staffMiddleware.assertHierarchy(actor.role, data.role, isGlobalOwner);

  const { username, password, baseSalary, ...profile } = data;

  const exists = await Staff.exists({ store: storeId, username }).session(session || null);
  if (exists) throw new Errors.BadRequestError('Username already exists in this store');

  const hashedPassword = await Passwords.hashPassword(password);

  const [staff] = await Staff.create(
    [
      {
        store: new Types.ObjectId(storeId),
        username,
        password: hashedPassword,
        ...profile,
        payroll: {
          baseSalary: baseSalary || 0,
          currentDue: 0,
          totalPaid: 0,
        },
      },
    ],
    { session }
  );

  logger.info(`Staff created: ${username} in store ${storeId}`);

  return staffSanitizers.staffSanitizer(staff);
};

/**
 * @function loginStaff
 * @description Staff login
 */
export const loginStaff = async (
  data: staffValidator.StaffLoginInput
): Promise<{ token: string; staff: staffSanitizers.SanitizedStaff }> => {
  const { storeCode, username, password } = data;

  const store = await Store.findById(storeCode).select('_id').lean();
  if (!store) throw new Errors.NotFoundError('Store not found');

  const staff = await Staff.findOne({ store: store._id, username }).select('+password').lean();
  if (!staff) throw new Errors.UnauthenticatedError('Invalid credentials');
  if (!staff.isActive) throw new Errors.UnauthenticatedError('Account is inactive');

  const isValid = await Passwords.compareHashedPassword(
    password,
    (staff as unknown as IStaff).password!
  );
  if (!isValid) throw new Errors.UnauthenticatedError('Invalid credentials');

  const token = JWTs.createStaffAccessToken({
    userId: String(staff._id),
    role: staff.role,
    storeId: String(store._id),
  });

  logger.info(`Staff login: ${username} in store ${store._id}`);

  return { token, staff: staffSanitizers.staffSanitizer(staff as unknown as IStaff) };
};

/**
 * @function getAllStaffs
 * @description List all staff for a store. (Read-only, no logs)
 */
export const getAllStaffs = async (
  storeId: string,
  page: number,
  limit: number
): Promise<{ staffs: Partial<staffSanitizers.SanitizedStaff>[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { store: new Types.ObjectId(storeId) };

  const [docs, total] = await Promise.all([
    Staff.find(query).skip(skip).limit(limit).lean(),
    Staff.countDocuments(query),
  ]);

  return {
    staffs: staffSanitizers.allStaffSanitizer(docs as unknown as IStaff[]).staffs,
    total,
  };
};

/**
 * @function updateStaff
 * @description Update a staff member.
 */
export const updateStaff = async (
  storeId: string,
  staffId: string,
  actor: AuthUser,
  data: staffValidator.UpdateStaffInput,
  session?: ClientSession
): Promise<staffSanitizers.SanitizedStaff> => {
  const isGlobalOwner = actor.type !== 'staff';

  // Fetch target role for hierarchy check
  const targetStaff = await Staff.findById(staffId).select('role username').lean();
  if (!targetStaff) throw new Errors.NotFoundError('Staff member not found');

  // Check 1: Can I manage this staff member?
  staffMiddleware.assertHierarchy(actor.role, targetStaff.role, isGlobalOwner);

  // Check 2: If promoting, can I assign this role?
  if (data.role) {
    staffMiddleware.assertHierarchy(actor.role, data.role, isGlobalOwner);
  }

  const { password, baseSalary, ...updates } = data;
  const updatePayload: any = { ...updates };

  if (password) updatePayload.password = await Passwords.hashPassword(password);
  if (baseSalary !== undefined) updatePayload['payroll.baseSalary'] = baseSalary;

  const staff = await Staff.findOneAndUpdate(
    { _id: staffId, store: storeId },
    { $set: updatePayload },
    { new: true, session, runValidators: true }
  ).lean();

  logger.info(`Staff updated: ${targetStaff.username} (${staffId}) in store ${storeId}`);

  return staffSanitizers.staffSanitizer(staff as unknown as IStaff);
};

/**
 * @function deleteStaff
 * @description Delete a staff member
 */
export const deleteStaff = async (
  storeId: string,
  staffId: string,
  actor: AuthUser,
  session?: ClientSession
): Promise<staffSanitizers.SanitizedStaff> => {
  const isGlobalOwner = actor.type !== 'staff';

  const targetStaff = await Staff.findById(staffId).select('role username').lean();
  if (!targetStaff) throw new Errors.NotFoundError('Staff member not found');

  staffMiddleware.assertHierarchy(actor.role, targetStaff.role, isGlobalOwner);

  const staff = await Staff.findOneAndDelete({ _id: staffId, store: storeId }, { session }).lean();

  logger.info(`Staff deleted: ${targetStaff.username} (${staffId}) from store ${storeId}`);

  return staffSanitizers.staffSanitizer(staff as unknown as IStaff);
};

/**
 * @function removeAllStaff
 * @description Deletes all staff for a specific store (Cascading Delete).
 */
export const removeAllStaff = async (storeId: string, session?: ClientSession): Promise<void> => {
  const result = await Staff.deleteMany({ store: storeId }, { session });
  logger.info(`[Cleanup] Deleted ${result.deletedCount} staff members for store ${storeId}`);
};

export default {
  createStaff,
  loginStaff,
  getAllStaffs,
  updateStaff,
  deleteStaff,
  removeAllStaff,
};
