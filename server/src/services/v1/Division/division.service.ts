import { HydratedDocument } from 'mongoose';

import { Division, IDivision, DivisionMembership } from '@/models';
import { DivisionInput } from '@/validations/division.validation';
import e from 'express';

/**
 * @function createDivision
 * @description Create a new division for the given workspace and user.
 *
 * @param {DivisionInput} userData - Division creation data.
 * @param {string} workspaceId - The ID of the workspace to create the division in.
 * @param {string} userId - The ID of the user creating the division.
 * @returns {Promise<HydratedDocument<IDivision>>} The newly created division document.
 * @throws {Error} If division name already exists.
 */
const createDivision = async (
  userData: DivisionInput,
  workspaceId: string,
  userId: string
): Promise<HydratedDocument<IDivision>> => {
  const { name, description } = userData;

  const existingDivision = await Division.findOne({ name }).select('_id');
  if (existingDivision) throw new Error('Division name already exists');

  const division = await Division.create({
    name,
    description,
    createdBy: userId,
    workspace: workspaceId,
  });

  await DivisionMembership.create({
    user: userId,
    workspace: workspaceId,
    division: division._id,
    divisionRoles: ['admin'],
  });

  return division;
};

/**
 * @function getSingleDivision
 * @description Get a single division by its ID.
 *
 * @param {string} divisionId - The ID of the division to retrieve.
 * @returns {Promise<HydratedDocument<IDivision>>} The division document.
 * @throws {Error} If division is not found.
 */
export const getSingleDivision = async (
  workspaceId: string,
  divisionId: string
): Promise<HydratedDocument<IDivision>> => {
  const division = await Division.findOne({ _id: divisionId, workspace: workspaceId });
  if (!division) throw new Error('Division not found');

  return division;
};

/**
 * @function updateDivision
 * @description Update a division by its ID.
 *
 * @param {DivisionInput} userData - Division update data.
 * @param {string} divisionId - The ID of the division to update.
 * @returns {Promise<HydratedDocument<IDivision>>} The updated division document.
 * @throws {Error} If division is not found.
 */
export const updateDivision = async (
  userData: DivisionInput,
  divisionId: string
): Promise<HydratedDocument<IDivision>> => {
  const { name, description } = userData;

  const division = await Division.findByIdAndUpdate(
    divisionId,
    { name, description },
    { new: true }
  );

  if (!division) throw new Error('Division not found');

  return division;
};

/**
 * @function deleteDivision
 * @description Delete a division by its ID.
 *
 * @param {string} divisionId - The ID of the division to delete.
 * @returns {Promise<HydratedDocument<IDivision>>} The deleted division document.
 * @throws {Error} If division is not found.
 */
export const deleteDivision = async (divisionId: string): Promise<HydratedDocument<IDivision>> => {
  const division = await Division.findByIdAndDelete(divisionId);

  if (!division) throw new Error('Division not found');

  return division;
};

/**
 * @function getAllDivisions
 * @description Get all divisions for the given workspace.
 *
 * @param {string} workspaceId - The ID of the workspace to retrieve divisions for.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of divisions to retrieve per page.
 * @returns {Promise<HydratedDocument<IDivision>[]>} An array of division documents.
 */
export const getAllDivisions = async (
  workspaceId: string,
  page: number,
  limit: number
): Promise<HydratedDocument<IDivision>[]> => {
  const divisions = await Division.find({ workspace: workspaceId })
    .skip((page - 1) * limit)
    .limit(limit);

  return divisions;
};

export default {
  createDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
  getAllDivisions,
};
