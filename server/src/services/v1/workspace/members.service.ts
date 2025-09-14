import { Types } from 'mongoose';

import { Membership, Workspace } from '@/models/index.js';
import { workspaceMembershipSanitizers } from '@/sanitizers/index.js';
import { Errors } from '@/error/index.js';

/**
 * All active workspace members.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<SanitizedUsers & { total: number }>} List of active user of this workspaces.
 */
export const getAllWorkspaceMembers = async (
  page: number,
  limit: number,
  workspaceId: string
): Promise<workspaceMembershipSanitizers.SanitizedMemberships & { total: number }> => {
  const total: number = await Membership.countDocuments({
    workspace: new Types.ObjectId(workspaceId),
    status: 'active',
  });

  if (total === 0) return { memberships: [], total };

  const skip: number = (page - 1) * limit;
  const memberships = await Membership.find({ workspace: workspaceId, status: 'active' })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username email')
    .lean();

  return {
    memberships: workspaceMembershipSanitizers.allMembershipSanitizer(memberships, [
      'id',
      'user',
      'workspaceRoles',
    ]).memberships,
    total,
  };
};

export const getWorkspaceMember = async (
  workspace: string,
  memberId: string
): Promise<workspaceMembershipSanitizers.SanitizedMembership> => {
  const member = await Membership.findOne({
    workspace: new Types.ObjectId(workspace),
    user: new Types.ObjectId(memberId),
  })
    .populate('user', 'username email')
    .lean();

  if (!member) throw new Errors.BadRequestError('Membership does not exist.');

  return workspaceMembershipSanitizers.membershipSanitizer(member);
};

/**
 * Remove a member from a workspace.
 *
 * @param {string} workspace - Workspace ID.
 * @param {string} memberId - Member ID.
 * @returns {Promise<workspaceMembershipSanitizers.SanitizedMembership>} Sanitized workspace member.
 */
export const removeWorkspaceMember = async (
  userId: string,
  workspace: string,
  memberId: string
): Promise<workspaceMembershipSanitizers.SanitizedMembership> => {
  if (userId === memberId) throw new Errors.BadRequestError('You cannot remove yourself.');

  const member = await Membership.findOneAndDelete({ workspace, user: memberId })
    .populate('user', 'username email')
    .lean();

  if (!member) throw new Errors.BadRequestError('Member does not exist.');

  return workspaceMembershipSanitizers.membershipSanitizer(member);
};

/**
 * ----------------- Workspace Member Roles Assignments -----------------
 */

/**
 * Assigns a role to a user in the workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} memberId - Member ID.
 * @param {string} roleId - Role ID.
 * @returns {Promise<SanitizedMembership>} Sanitized membership.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const assignRoleToUser = async (
  workspaceId: string,
  memberId: string,
  roleId: string
): Promise<workspaceMembershipSanitizers.SanitizedMembership> => {
  const workspace = await Workspace.findById(workspaceId).select('workspaceRoles').lean();
  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  const role = workspace.workspaceRoles.find(r => r._id?.equals(roleId));
  if (!role) throw new Errors.NotFoundError('Role not found in workspace');

  const membership = await Membership.findOneAndUpdate(
    { user: memberId, workspace: workspaceId },
    { $addToSet: { workspaceRoles: role.name } },
    { new: true }
  )
    .populate('user', 'username email')
    .lean();

  if (!membership) throw new Errors.NotFoundError('Membership not found');

  return workspaceMembershipSanitizers.membershipSanitizer(membership);
};

/**
 * Unassign a role from a user in the workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} memberId - Member ID.
 * @param {string} roleId - Role ID.
 * @returns {Promise<SanitizedMembership>} Sanitized membership.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const unassignRoleFromUser = async (
  workspaceId: string,
  memberId: string,
  roleId: string
): Promise<workspaceMembershipSanitizers.SanitizedMembership> => {
  const workspace = await Workspace.findById(workspaceId).select('workspaceRoles').lean();
  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  const role = workspace.workspaceRoles.find(r => r._id?.equals(roleId));
  if (!role) throw new Errors.NotFoundError('Role not found in workspace');

  const membership = await Membership.findOneAndUpdate(
    { user: memberId, workspace: workspaceId },
    { $pull: { workspaceRoles: role.name } },
    { new: true }
  )
    .populate('user', 'username email')
    .lean();

  if (!membership) throw new Errors.NotFoundError('Membership not found');

  return workspaceMembershipSanitizers.membershipSanitizer(membership);
};

export default {
  getAllWorkspaceMembers,
  getWorkspaceMember,
  removeWorkspaceMember,

  assignRoleToUser,
  unassignRoleFromUser,
};
