/**
 * @module staff.service
 *
 * @description Services for staff-related operations within workspace divisions.
 * Handles CRUD, salary plans, attendance tracking, and payments.
 */

import { Types } from 'mongoose';

import { Staff } from '@/models';
import { Errors } from '@/error';
import { staff } from '@/validations';
import { staffSanitizers } from '@/utils';

/**
 * ----------------- Staff CRUD -----------------
 */

/**
 * @function createStaff
 * @description Create a new staff member within a division and workspace.
 *
 * @param {staff.StaffInput} staffData - Staff creation data.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<staffSanitizers.SanitizedStaff>} Created staff document.
 */
export const createStaff = async (
  staffData: staff.CreateStaffInput,
  workspaceId: string,
  divisionId: string
): Promise<staffSanitizers.SanitizedStaff> => {
  const { name, phone, role, image, salary } = staffData;

  // Ensure unique phone number within the same workspace & division
  const existing = await Staff.exists({ phone, workspace: workspaceId, division: divisionId });
  if (existing)
    throw new Errors.BadRequestError('Staff member with this phone number already exists');

  const newStaff = await Staff.create({
    name,
    phone,
    role,
    image,
    salary,
    joiningDate: new Date(),
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  return staffSanitizers.staffSanitizer(newStaff);
};

/**
 * @function getSingleStaff
 * @description Fetch a single staff member by ID.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {string} staffId - Staff ID.
 * @returns {Promise<staffSanitizers.SanitizedStaff>} Staff document.
 */
export const getSingleStaff = async (
  workspaceId: string,
  divisionId: string,
  staffId: string
): Promise<staffSanitizers.SanitizedStaff> => {
  // const staffDoc = await Staff.findById(staffId).lean();
  const staffDoc = await Staff.findOne({
    _id: staffId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();

  if (!staffDoc) throw new Errors.NotFoundError('Staff member not found');

  return staffSanitizers.staffSanitizer(staffDoc);
};

/**
 * @function updateStaff
 * @description Update staff member information.
 *
 * @param {staff.UpdateStaffInput} staffData - Fields to update.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {string} staffId - Staff ID.
 * @returns {Promise<staffSanitizers.SanitizedStaff>} Updated staff document.
 */
export const updateStaff = async (
  staffData: staff.UpdateStaffInput,
  workspaceId: string,
  divisionId: string,
  staffId: string
): Promise<staffSanitizers.SanitizedStaff> => {
  const { name, phone, role, image, salary } = staffData;

  // Check for duplicate phone
  const existingPhone = await Staff.exists({
    phone,
    workspace: workspaceId,
    division: divisionId,
    _id: { $ne: staffId },
  });
  if (existingPhone)
    throw new Errors.BadRequestError('Staff member with this phone number already exists');

  const updatedStaff = await Staff.findOneAndUpdate(
    { _id: staffId, workspace: workspaceId, division: divisionId },
    { name, phone, role, image, salary },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedStaff) throw new Errors.NotFoundError('Staff member not found');

  return staffSanitizers.staffSanitizer(updatedStaff);
};

/**
 * @function deleteStaff
 * @description Remove a staff member from a division.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {string} staffId - Staff ID.
 * @returns {Promise<staffSanitizers.SanitizedStaff>} Deleted staff document.
 */
export const deleteStaff = async (
  workspaceId: string,
  divisionId: string,
  staffId: string
): Promise<staffSanitizers.SanitizedStaff> => {
  const deletedStaff = await Staff.findOneAndDelete({
    _id: staffId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();

  if (!deletedStaff) throw new Errors.NotFoundError('Staff member not found');

  return staffSanitizers.staffSanitizer(deletedStaff);
};

/**
 * @function getAllStaff
 * @description Get paginated staff list for a workspace and division.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {number} page - Page number.
 * @param {number} limit - Records per page.
 * @returns {Promise<staffSanitizers.SanitizedStaffs & { total: number }>} Paginated staff list.
 */
export const getAllStaff = async (
  workspaceId: string,
  divisionId: string,
  page: number,
  limit: number
): Promise<staffSanitizers.SanitizedStaffs & { total: number }> => {
  const total = await Staff.countDocuments({ workspace: workspaceId, division: divisionId });
  if (total === 0) return { staff: [], total };

  const skip: number = (page - 1) * limit;
  const staffList = await Staff.find({ workspace: workspaceId, division: divisionId })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    staff: staffSanitizers.allStaffSanitizer(staffList, [
      'id',
      'name',
      'phone',
      'role',
      'image',
      'salary',
    ]).staff,
    total,
  };
};

/**
 * ----------------- Default Export (staffService) -----------------
 */
export default {
  createStaff, // Create a new staff member
  getSingleStaff, // Get details of a single staff member
  updateStaff, // Update staff member details
  deleteStaff, // Delete a staff member
  getAllStaff, // Get all staff members in a division
};
