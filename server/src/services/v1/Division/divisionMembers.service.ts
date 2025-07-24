import { Errors } from '@/error';
import { Division, DivisionMembership, IDivisionMembership, IUser, Membership } from '@/models';
import e from 'express';
import { HydratedDocument } from 'mongoose';

/**
 * @function getDivisionMembers
 * @description Get all members of a division.
 *
 * @param {string} divisionId - The ID of the division to retrieve members for.
 * @returns {Promise<HydratedDocument<IUser>[]>} An array of user documents.
 */
export const getDivisionMembers = async (
  divisionId: string,
  page: number,
  limit: number
): Promise<HydratedDocument<IUser>[]> => {
  const skip: number = (page - 1) * limit;
  const divisionMemberships = await DivisionMembership.find({
    division: divisionId,
    status: 'active',
  })
    .skip(skip)
    .limit(limit)
    .populate('user');

  const members = divisionMemberships.map(m => m.user as unknown as HydratedDocument<IUser>);

  return members;
};

/**
 * @function addMemberToDivision
 * @description Add a member to a division.
 *
 * @param {string} memberId - The ID of the user to add to the division.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {string} divisionId - The ID of the division to add the user to.
 * @returns {Promise<HydratedDocument<IDivisionMembership>>} The created division membership document.
 */
export const addMemberToDivision = async (
  memberId: string,
  workspaceId: string,
  divisionId: string,
  invitedBy: string
): Promise<HydratedDocument<IDivisionMembership>> => {
  // Check if user is a member of the workspace
  const isWorkspaceMember = await Membership.findOne({
    user: memberId,
    workspace: workspaceId,
    status: 'active',
  }).select('_id');
  if (!isWorkspaceMember)
    throw new Errors.BadRequestError('User is not a member of this workspace');

  // Check if division exists in the workspace
  const divisionExist = await Division.findOne({
    _id: divisionId,
    workspace: workspaceId,
  }).select('_id');
  if (!divisionExist) throw new Errors.BadRequestError('Division does not exist in this workspace');

  // Check if user is already a member of the division
  const existingMembership = await DivisionMembership.findOne({
    user: memberId,
    workspace: workspaceId,
    division: divisionId,
  }).select('_id');
  if (existingMembership)
    throw new Errors.BadRequestError('User already a member of this division');

  const divisionMembership = await DivisionMembership.create({
    user: memberId,
    division: divisionId,
    workspace: workspaceId,
    divisionRoles: ['user'],
    status: 'active',
    invitedBy,
  });

  return divisionMembership;
};

export const removeMemberFromDivision = async (
  memberId: string,
  workspaceId: string,
  divisionId: string
): Promise<HydratedDocument<IDivisionMembership>> => {
  const divisionMembership = await DivisionMembership.findOneAndDelete({
    user: memberId,
    workspace: workspaceId,
    division: divisionId,
  });
  if (!divisionMembership)
    throw new Errors.BadRequestError('User is not a member of this division');

  return divisionMembership;
};

export default { getDivisionMembers, addMemberToDivision, removeMemberFromDivision };
