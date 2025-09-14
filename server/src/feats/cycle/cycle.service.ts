/**
 * @module cycle.service
 *
 * @description Services for salary cycle management within workspace divisions.
 * Handles CRUD and lifecycle operations for salary cycles.
 */

import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Cycle, cycleValidator, cycleSanitizers } from '@/feats/cycle/index.js';

/**
 * ----------------- Create a New Cycle -----------------
 * @function createCycle
 * @description Start a new salary cycle for the given workspace and division.
 *
 * @param {cycleValidator.CreateCycleInput} cycleData - Data for the new cycle.
 * @param {string} workspaceId - ID of the workspace.
 * @param {string} divisionId - ID of the division.
 * @returns {Promise<cycleSanitizers.SanitizedCycle>} The newly created cycle.
 * @throws {Errors.BadRequestError} If an active cycle already exists.
 * @throws {Errors.BadRequestError} If a cycle with the same month/year already exists.
 */
export const createCycle = async (
  cycleData: cycleValidator.CreateCycleInput,
  workspaceId: string,
  divisionId: string
): Promise<cycleSanitizers.SanitizedCycle> => {
  const { month, year } = cycleData;

  // Ensure no active cycle already exists
  const existingActiveCycle = await Cycle.exists({
    workspace: workspaceId,
    division: divisionId,
    isClosed: false,
  }).lean();

  if (existingActiveCycle) {
    throw new Errors.BadRequestError(
      'An active cycle already exists. Close it before creating a new one.'
    );
  }

  // Ensure this month/year pair isn't duplicated
  const existingMonthYear = await Cycle.findOne({
    workspace: workspaceId,
    division: divisionId,
    month,
    year,
  }).lean();

  if (existingMonthYear) {
    throw new Errors.BadRequestError(`Cycle for ${month}/${year} already exists.`);
  }

  // Create the new cycle
  const newCycle = await Cycle.create({
    name: `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year} Cycle`,
    month,
    year,
    isClosed: false,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  return cycleSanitizers.cycleSanitizer(newCycle);
};

/**
 * ----------------- Get Active Cycle -----------------
 * @function getActiveCycle
 * @description Fetch the currently active salary cycle for a division.
 *
 * @param {string} workspaceId - ID of the workspace.
 * @param {string} divisionId - ID of the division.
 * @returns {Promise<cycleSanitizers.SanitizedCycle>} The active cycle.
 * @throws {Errors.NotFoundError} If no active cycle is found.
 */
export const getActiveCycle = async (
  workspaceId: string,
  divisionId: string
): Promise<cycleSanitizers.SanitizedCycle> => {
  const activeCycle = await Cycle.findOne({
    workspace: workspaceId,
    division: divisionId,
    isClosed: false,
  }).lean();

  if (!activeCycle) {
    throw new Errors.NotFoundError('No active cycle found for this division.');
  }

  return cycleSanitizers.cycleSanitizer(activeCycle);
};

/**
 * ----------------- Close Cycle -----------------
 * @function closeCycle
 * @description Close the currently active salary cycle by ID.
 *
 * @param {string} workspaceId - ID of the workspace.
 * @param {string} divisionId - ID of the division.
 * @param {string} cycleId - ID of the cycle to close.
 * @returns {Promise<cycleSanitizers.SanitizedCycle>} The closed cycle.
 * @throws {Errors.NotFoundError} If the cycle is not found or already closed.
 */
export const closeCycle = async (
  workspaceId: string,
  divisionId: string,
  cycleId: string
): Promise<cycleSanitizers.SanitizedCycle> => {
  const updatedCycle = await Cycle.findOneAndUpdate(
    { _id: cycleId, workspace: workspaceId, division: divisionId, isClosed: false },
    { isClosed: true },
    { new: true }
  ).lean();

  if (!updatedCycle) {
    throw new Errors.NotFoundError('Cycle not found or already closed.');
  }

  return cycleSanitizers.cycleSanitizer(updatedCycle);
};

/**
 * ----------------- Get All Cycles -----------------
 * @function getAllCycles
 * @description Retrieve paginated list of cycles for a division.
 *
 * @param {string} workspaceId - ID of the workspace.
 * @param {string} divisionId - ID of the division.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Number of cycles per page (default: 20, max: 100).
 * @returns {Promise<cycleSanitizers.SanitizedCycles & { total: number }>} List of cycles and total count.
 */
export const getAllCycles = async (
  workspaceId: string,
  divisionId: string,
  page: number,
  limit: number
): Promise<cycleSanitizers.SanitizedCycles & { total: number }> => {
  const total = await Cycle.countDocuments({ workspace: workspaceId, division: divisionId });
  if (total === 0) return { cycles: [], total };

  const skip = (page - 1) * limit;

  const cycleList = await Cycle.find({ workspace: workspaceId, division: divisionId })
    .sort({ year: -1, month: -1 }) // most recent first
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    cycles: cycleSanitizers.allCyclesSanitizer(cycleList, [
      'id',
      'name',
      'month',
      'year',
      'isClosed',
      'createdAt',
    ]).cycles,
    total,
  };
};

/**
 * ----------------- Reopen Cycle -----------------
 * @function reopenCycle
 * @description Reopen a closed salary cycle by ID.
 *
 * @param {string} workspaceId - ID of the workspace.
 * @param {string} divisionId - ID of the division.
 * @param {string} cycleId - ID of the cycle to reopen.
 * @returns {Promise<cycleSanitizers.SanitizedCycle>} The reopened cycle.
 * @throws {Errors.NotFoundError} If the cycle is not found or already active.
 * @throws {Errors.BadRequestError} If an active cycle already exists.
 */
export const reopenCycle = async (
  workspaceId: string,
  divisionId: string,
  cycleId: string
): Promise<cycleSanitizers.SanitizedCycle> => {
  // Ensure no active cycle already exists
  const existingActiveCycle = await Cycle.exists({
    workspace: workspaceId,
    division: divisionId,
    isClosed: false,
  }).lean();

  if (existingActiveCycle && existingActiveCycle._id.toString() !== cycleId) {
    throw new Errors.BadRequestError(
      'An active cycle already exists. Close it before reopening this one.'
    );
  }

  // Ensure the cycle exists
  const cycle = await Cycle.findOne({ _id: cycleId, workspace: workspaceId, division: divisionId });
  if (!cycle) throw new Errors.NotFoundError('Cycle not found');
  if (!cycle.isClosed) throw new Errors.BadRequestError('Cycle is already active');

  cycle.isClosed = false;

  await cycle.save();

  return cycleSanitizers.cycleSanitizer(cycle);
};

/**
 * ----------------- Default Export (cycleService) -----------------
 */
export default {
  createCycle, // Start a new salary cycle
  getActiveCycle, // Get the currently active cycle
  closeCycle, // Close a cycle
  getAllCycles, // List all cycles

  reopenCycle, // Reopen a closed cycle
};
