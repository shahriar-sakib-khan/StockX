/**
 * @module staff.service
 *
 * @description Services for staff (membership) related operations.
 * Handles adding, updating, and removing staff from stores.
 */

import mongoose, { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Membership } from '@/models/index.js';

/**
 * ----------------- Staff CRUD Services -----------------
 */

/**
 * @function getAllStaffs
 * @description Get paginated staff list for a store.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Records per page.
 * @returns {Promise<{ staffDocs: any[], total: number }>}
 */
export const getAllStaffs = async (
  storeId: string,
  page: number,
  limit: number
): Promise<{ staffDocs: any[]; total: number }> => {
  const skip = (page - 1) * limit;

  const [staffDocs, total] = await Promise.all([
    Membership.find({ store: new Types.ObjectId(storeId) })
      .populate('user', 'name email phone image') // Populating user details
      .skip(skip)
      .limit(limit)
      .lean(),
    Membership.countDocuments({ store: new Types.ObjectId(storeId) }),
  ]);

  return { staffDocs, total };
};

/**
 * @function getSingleStaff
 * @description Fetch a single staff member (membership) by ID.
 *
 * @param {string} storeId - Store ID.
 * @param {string} staffId - Membership ID.
 * @returns {Promise<any>} Staff document.
 */
export const getSingleStaff = async (storeId: string, staffId: string): Promise<any> => {
  const staffDoc = await Membership.findOne({
    _id: new Types.ObjectId(staffId),
    store: new Types.ObjectId(storeId),
  })
    .populate('user', 'name email phone image')
    .lean();

  if (!staffDoc) throw new Errors.NotFoundError('Staff member not found');

  return staffDoc;
};

/**
 * @function updateStaff
 * @description Update staff roles or status.
 * Uses transactions to ensure data integrity.
 *
 * @param {string} storeId - Store ID.
 * @param {string} staffId - Membership ID.
 * @param {string[]} storeRoles - New roles.
 * @param {string} status - New status.
 * @returns {Promise<any>} Updated staff document.
 */
export const updateStaff = async (
  storeId: string,
  staffId: string,
  storeRoles?: string[],
  status?: string
): Promise<any> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatePayload: any = {};
    if (storeRoles) updatePayload.storeRoles = storeRoles;
    if (status) updatePayload.status = status;

    const updatedStaff = await Membership.findOneAndUpdate(
      {
        _id: new Types.ObjectId(staffId),
        store: new Types.ObjectId(storeId),
      },
      { $set: updatePayload },
      { new: true, session } // Pass session here
    ).lean();

    if (!updatedStaff) {
      throw new Errors.NotFoundError('Staff member not found');
    }

    await session.commitTransaction();
    return updatedStaff;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * @function deleteStaff
 * @description Remove a staff member from a store (Delete Membership).
 * Uses transactions.
 *
 * @param {string} storeId - Store ID.
 * @param {string} staffId - Membership ID.
 * @returns {Promise<any>} Deleted staff document.
 */
export const deleteStaff = async (storeId: string, staffId: string): Promise<any> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedStaff = await Membership.findOneAndDelete({
      _id: new Types.ObjectId(staffId),
      store: new Types.ObjectId(storeId),
    }).session(session);

    if (!deletedStaff) {
      throw new Errors.NotFoundError('Staff member not found');
    }

    await session.commitTransaction();
    return deletedStaff;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * ----------------- Default Export (staffService) -----------------
 */
export default {
  getAllStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
