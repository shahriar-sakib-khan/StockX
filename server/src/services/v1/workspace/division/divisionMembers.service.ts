/**
 * @module divisionMembers
 * @description Services for division members
 */

import { Division, DivisionMembership } from '@/models/index.js';
import { divisionMembershipSanitizers } from '@/sanitizers/index.js';
import { Errors } from '@/error/index.js';

/**
 * ----------------- Division Members CRUD -----------------
 */

/**
 * @function getDivisionMembers
 * @description Get all members of a division.
 *
 * @param {string} divisionId - The ID of the division to retrieve members for.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of members to retrieve per page.
 * @returns {Promise<SanitizedDivisionMemberships & { total: number }>} An array of user documents.
 */
export const getAllDivisionMembers = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<divisionMembershipSanitizers.SanitizedDivisionMemberships & { total: number }> => {
  // Check if division has members
  const total: number = await DivisionMembership.countDocuments({
    division: divisionId,
    workspace: workspaceId,
    status: 'active',
  });
  if (total === 0) return { members: [], total };

  const skip: number = (page - 1) * limit;
  const members = await DivisionMembership.find({
    division: divisionId,
    workspace: workspaceId,
    status: 'active',
  })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username email')
    .lean();

  return {
    members: divisionMembershipSanitizers.allDivisionMembershipSanitizer(members, [
      'id',
      'user',
      'divisionRoles',
      'addedBy',
    ]).members,
    total,
  };
};

/**
 * @function getSingleDivisionMember
 * @description Get a single member of a division.
 *
 * @param {string} memberId - The ID of the user to retrieve.
 * @param {string} divisionId - The ID of the division the user is in.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @returns {Promise<SanitizedDivisionMembership>} The user document.
 * @throws {NotFoundError} If the division membership is not found.
 */
export const getSingleDivisionMember = async (
  workspaceId: string,
  divisionId: string,
  memberId: string
): Promise<divisionMembershipSanitizers.SanitizedDivisionMembership> => {
  const divisionMembership = await DivisionMembership.findOne({
    user: memberId,
    division: divisionId,
    workspace: workspaceId,
  })
    .populate('user', 'username email')
    .lean();

  if (!divisionMembership) throw new Errors.NotFoundError('Division member not found');

  return divisionMembershipSanitizers.divisionMembershipSanitizer(divisionMembership);
};

/**
 * @function addMemberToDivision
 * @description Add a member to a division.
 *
 * @param {string} userId - The ID of the user who added the member.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {string} divisionId - The ID of the division to add the user to.
 * @param {string} memberId - The ID of the user to add to the division.
 * @returns {Promise<SanitizedDivisionMembership>} The created division membership document.
 * @throws {BadRequestError} If the user is not or already a member of the workspace .
 */
export const addMemberToDivision = async (
  userId: string,
  workspaceId: string,
  divisionId: string,
  memberId: string
): Promise<divisionMembershipSanitizers.SanitizedDivisionMembership> => {
  const existingMember = await DivisionMembership.exists({
    user: memberId,
    division: divisionId,
    workspace: workspaceId,
  }).lean();
  if (existingMember) throw new Errors.BadRequestError('User is already a member of the division.');

  const divisionMembership = await DivisionMembership.create({
    user: memberId,
    division: divisionId,
    workspace: workspaceId,
    divisionRoles: ['division_member'],
    addedBy: userId,
  });

  return divisionMembershipSanitizers.divisionMembershipSanitizer(divisionMembership);
};

/**
 * @function removeMemberFromDivision
 * @description Remove a member from a division.
 *
 * @param {string} userId - The ID of the user who removed the member.
 * @param {string} workspace - The ID of the workspace the division is in.
 * @param {string} division - The ID of the division to remove the user from.
 * @param {string} memberId - The ID of the user to remove from the division.
 * @returns {Promise<SanitizedDivisionMembership>} The removed division membership document.
 * @throws {BadRequestError} If the user is not or already a member of the workspace .
 */
export const removeMemberFromDivision = async (
  userId: string,
  workspace: string,
  division: string,
  memberId: string
): Promise<divisionMembershipSanitizers.SanitizedDivisionMembership> => {
  if (userId === memberId) throw new Errors.BadRequestError('You cannot remove yourself.');

  const member = await DivisionMembership.findOneAndDelete({ workspace, division, user: memberId })
    .populate('user', 'username email')
    .lean();

  if (!member) throw new Errors.BadRequestError('Not a member of the division.');

  return divisionMembershipSanitizers.divisionMembershipSanitizer(member);
};

/**
 * ----------------- Division Members Services (default export) -----------------
 */
export default {
  getAllDivisionMembers,
  getSingleDivisionMember,

  addMemberToDivision,
  removeMemberFromDivision,
};
