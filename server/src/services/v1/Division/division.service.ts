import { Types } from 'mongoose';

import { Division, DivisionMembership } from '@/models';
import { DivisionInput } from '@/validations/division.validation';
import { divisionSanitizers } from '@/utils';
import { Errors } from '@/error';

/**
 * @function createDivision
 * @description Create a new division for the given workspace and user.
 *
 * @param {DivisionInput} userData - Division creation data.
 * @param {string} workspaceId - The ID of the workspace to create the division in.
 * @param {string} userId - The ID of the user creating the division.
 * @returns {Promise<SanitizedDivision>} The newly created division document.
 * @throws {Error} If division name already exists.
 */
const createDivision = async (
  userData: DivisionInput,
  userId: string,
  workspaceId: string
): Promise<divisionSanitizers.SanitizedDivision> => {
  const { name, description } = userData;

  const existingDivision = await Division.exists({ name, workspace: workspaceId });
  if (existingDivision) throw new Errors.BadRequestError('Division name already exists');

  const division = await Division.create({
    name,
    description,
    createdBy: userId,
    workspace: new Types.ObjectId(workspaceId),
  });

  await DivisionMembership.create({
    user: userId,
    workspace: workspaceId,
    division: division._id,
    divisionRoles: ['division_admin', 'division_creator'],
  });

  return divisionSanitizers.divisionSanitizer(division);
};

/**
 * @function getSingleDivision
 * @description Get a single division by its ID.
 *
 * @param {string} divisionId - The ID of the division to retrieve.
 * @returns {Promise<SanitizedDivision>} The division document.
 * @throws {Error} If division is not found.
 */
export const getSingleDivision = async (
  workspaceId: string,
  divisionId: string
): Promise<divisionSanitizers.SanitizedDivision> => {
  const division = await Division.findOne({ _id: divisionId, workspace: workspaceId })
    .populate('createdBy', 'username email')
    .populate('workspace', 'name')
    .lean();

  if (!division) throw new Errors.NotFoundError('Division not found');

  return divisionSanitizers.divisionSanitizer(division);
};

/**
 * @function updateDivision
 * @description Update a division by its ID.
 *
 * @param {DivisionInput} userData - Division update data.
 * @param {string} divisionId - The ID of the division to update.
 * @returns {Promise<SanitizedDivision>} The updated division document.
 * @throws {Error} If division is not found or division name already exists.
 */
export const updateDivision = async (
  userData: DivisionInput,
  divisionId: string
): Promise<divisionSanitizers.SanitizedDivision> => {
  const { name, description } = userData;

  const existingDivision = await Division.exists({ name, _id: { $ne: divisionId } });
  if (existingDivision) throw new Errors.BadRequestError('Division name already exists');

  const division = await Division.findByIdAndUpdate(
    divisionId,
    { name, description },
    { new: true }
  )
    .select('name description')
    .lean();

  if (!division) throw new Errors.NotFoundError('Division not found');

  return divisionSanitizers.divisionSanitizer(division);
};

/**
 * @function deleteDivision
 * @description Delete a division by its ID.
 *
 * @param {string} divisionId - The ID of the division to delete.
 * @returns {Promise<SanitizedDivision>} The deleted division document.
 * @throws {Error} If division is not found.
 */
export const deleteDivision = async (
  divisionId: string
): Promise<divisionSanitizers.SanitizedDivision> => {
  const division = await Division.findByIdAndDelete(divisionId)
    .select('name description')
    .populate('createdBy', 'username email')
    .lean();

  if (!division) throw new Errors.NotFoundError('Division not found');

  return divisionSanitizers.divisionSanitizer(division);
};

/**
 * @function getAllDivisions
 * @description Get all divisions for the given workspace.
 *
 * @param {string} workspaceId - The ID of the workspace to retrieve divisions for.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of divisions to retrieve per page.
 * @returns {Promise<SanitizedAllDivisions & { total: number }>} An array of division documents.
 */
export const getAllDivisions = async (
  workspaceId: string,
  page: number,
  limit: number
): Promise<divisionSanitizers.SanitizedDivisions & { total: number }> => {
  const total: number = await Division.countDocuments({ workspace: workspaceId });
  if (total === 0) return { divisions: [], total };

  const skip: number = (page - 1) * limit;
  const divisions = await Division.find({ workspace: workspaceId }).skip(skip).limit(limit).lean();

  return { divisions: divisionSanitizers.allDivisionSanitizer(divisions).divisions, total };
};

/**
 * @function getMyDivisionProfile
 * @description Get the division profile for the given user and division.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} divisionId - The ID of the division.
 * @param {string} workspaceId - The ID of the workspace.
 * @returns {Promise<SanitizedDivisionMembership>} The division membership document.
 */
export const getMyDivisionProfile = async (
  userId: string,
  divisionId: string,
  workspaceId: string
): Promise<divisionSanitizers.SanitizedDivisionMembership> => {
  const division = await DivisionMembership.findOne({
    user: userId,
    division: divisionId,
    workspace: workspaceId,
  })
    .populate('user', 'username email')
    .populate('division', 'name')
    .populate('workspace', 'name')
    .lean();
  if (!division) throw new Errors.NotFoundError('Division not found');

  return divisionSanitizers.divisionMembershipSanitizer(division);
};

export default {
  createDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
  getAllDivisions,

  getMyDivisionProfile,
};
