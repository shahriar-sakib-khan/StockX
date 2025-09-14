import { Router } from 'express';

import { divisionController } from '@/controllers/v1/index.js';
import { workspaceScope, divisionScope, validateRequest } from '@/middlewares/index.js';
import { division } from '@/validations/index.js';
import inventoryRouter from './inventory.router.js';
import transactionRouter from './transaction.router.js';
import vehicleRouter from './vehicle.router.js';
import storeRouter from './store.router.js';
import { staffRouter, cycleRouter, salaryRouter } from '@/feats/routers/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Division
 *   description: Workspace division management
 */

/**
 * ----------------- Division CRUD -----------------
 */

/**
 * @route   POST /workspace/:workspaceId/divisions
 * @desc    Create a new division within a workspace
 * @access  Admin (workspace)
 */
router.post(
  '/',
  workspaceScope(['division_admin']),
  validateRequest(division.divisionInputSchema),
  divisionController.createDivision
);

/**
 * @route   GET /workspace/:workspaceId/divisions
 * @desc    Get all divisions in the workspace
 * @access  Authenticated (workspace)
 */
router.get('/', workspaceScope(), divisionController.allDivisions);

/**
 * @route   GET /workspace/:workspaceId/divisions/:divisionId
 * @desc    Get a single division by ID
 * @access  Authenticated (division)
 */
router.get('/:divisionId', divisionScope(), divisionController.singleDivision);

/**
 * @route   PUT /workspace/:workspaceId/divisions/:divisionId
 * @desc    Update a division
 * @access  Admin (division)
 */
router.put(
  '/:divisionId',
  divisionScope(['division_division_admin']),
  validateRequest(division.divisionInputSchema),
  divisionController.updateDivision
);

/**
 * @route   DELETE /workspace/:workspaceId/divisions/:divisionId
 * @desc    Delete a division
 * @access  Admin (division)
 */
router.delete('/:divisionId', divisionScope(['division_admin']), divisionController.deleteDivision);

/**
 * @route   GET /workspace/:workspaceId/divisions/:divisionId/profile
 * @desc    Get current user’s profile in a division (roles, permissions)
 * @access  Authenticated (division)
 */
router.get('/:divisionId/profile', divisionScope(), divisionController.myDivisionProfile);

/**
 * ----------------- Division Member Routes -----------------
 */

/**
 * @route   GET /workspace/:workspaceId/divisions/:divisionId/members
 * @desc    Get all members of a division
 * @access  Authenticated
 */
router.get('/:divisionId/members', divisionScope(), divisionController.allMembers);

/**
 * @route   GET /workspace/:workspaceId/divisions/:divisionId/members/:memberId
 * @desc    Get a single member of a division
 * @access  Admin (division)
 */
router.get(
  '/:divisionId/members/:memberId',
  divisionScope(['division_admin']),
  divisionController.getMember
);

/**
 * @route   POST /workspace/:workspaceId/divisions/:divisionId/members/:memberId
 * @desc    Add a member to the division
 * @access  Admin (division)
 */
router.post(
  '/:divisionId/members/:memberId',
  divisionScope(['division_admin']),
  // validateRequest(division.divisionMemberSchema),
  divisionController.addMember
);

/**
 * @route   DELETE /workspace/:workspaceId/divisions/:divisionId/members/:memberId
 * @desc    Remove a member from the division
 * @access  Admin (division)
 */
router.delete(
  '/:divisionId/members/:memberId',
  divisionScope(['division_admin']),
  divisionController.removeMember
);

/**
 * ----------------- Division Role Routes -----------------
 */

/**
 * @route   GET /workspace/:workspaceId/divisions/:divisionId/roles
 * @desc    Get all roles defined in the division
 * @access  Admin (division)
 */
router.get('/:divisionId/roles', divisionScope(['division_admin']), divisionController.getRoles);

/**
 * @route   POST /workspace/:workspaceId/divisions/:divisionId/roles
 * @desc    Add a new role to the division
 * @access  Admin (division)
 */
router.post(
  '/:divisionId/roles',
  divisionScope(['division_admin']),
  validateRequest(division.divisionRoleInputSchema),
  divisionController.addRole
);

/**
 * @route   PUT /workspace/:workspaceId/divisions/:divisionId/roles/:roleId
 * @desc    Update a division role
 * @access  Admin (division)
 */
router.put(
  '/:divisionId/roles/:roleId',
  divisionScope(['division_admin']),
  validateRequest(division.divisionUpdateRoleSchema),
  divisionController.updateRole
);

/**
 * @route   DELETE /workspace/:workspaceId/divisions/:divisionId/roles/:roleId
 * @desc    Remove a division role
 * @access  Admin (division)
 */
router.delete(
  '/:divisionId/roles/:roleId',
  divisionScope(['division_admin']),
  divisionController.removeRole
);

/**
 * ----------------- Role Assignment Routes -----------------
 */

/**
 * @route   POST /workspace/:workspaceId/divisions/:divisionId/roles/:userId/assign/:roleId
 * @desc    Assign a role to a user in the division
 * @access  Admin (division)
 */
router.post(
  '/:divisionId/roles/:userId/assign/:roleId',
  divisionScope(['division_admin']),
  divisionController.assignRole
);

/**
 * @route   DELETE /workspace/:workspaceId/divisions/:divisionId/roles/:userId/unassign/:roleId
 * @desc    Unassign a role from a user in the division
 * @access  Admin (division)
 */
router.delete(
  '/:divisionId/roles/:userId/unassign/:roleId',
  divisionScope(['division_admin']),
  divisionController.unassignRole
);

/**
 * ----------------- Division Cycle Sub-Routes -----------------
 */
router.use('/:divisionId/', divisionScope(), cycleRouter);

/**
 * ----------------- Division Vehicle Sub-Routes -----------------
 */
router.use('/:divisionId/vehicles', divisionScope(), vehicleRouter);

/**
 * ----------------- Division Store Sub-Routes -----------------
 */
router.use('/:divisionId/stores', divisionScope(), storeRouter);

/**
 * ----------------- Division Inventory Sub-Routes -----------------
 */
router.use('/:divisionId/inventory', divisionScope(), inventoryRouter);

/**
 * ----------------- Division Transaction Sub-Routes -----------------
 */
router.use('/:divisionId/transactions', divisionScope(), transactionRouter);

/**
 * ----------------- Division Staff Sub-Routes -----------------
 */
router.use('/:divisionId/', divisionScope(), staffRouter);

/**
 * ----------------- Division Salary Sub-Routes -----------------
 */
router.use('/:divisionId/', divisionScope(), salaryRouter);

export default router;
