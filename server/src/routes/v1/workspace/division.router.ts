import express from 'express';

import { divisionController } from '@/controllers/v1';
import { workspaceScope, divisionScope, validateRequest } from '@/middlewares';
import { division } from '@/validations';

const router = express.Router({ mergeParams: true });

// <============================> General Division Routes <============================>

router.post(
  '/',
  workspaceScope(['admin']),
  validateRequest(division.divisionSchema),
  divisionController.createDivision
);
router.get('/:divisionId', divisionController.singleDivision);
router.put(
  '/:divisionId',
  divisionScope(['admin']),
  validateRequest(division.divisionSchema),
  divisionController.updateDivision
);
router.get('/', divisionController.allDivisions);
router.delete('/:divisionId', divisionScope(['admin']), divisionController.deleteDivision);

// <============================> Division Member Routes <============================>

router.get('/:divisionId/members', divisionController.getMembers);
router.post('/:divisionId/members', divisionScope(['admin']), divisionController.addMember);
router.delete('/:divisionId/members', divisionScope(['admin']), divisionController.removeMember);

// <============================> Division Role Routes <============================>

router.get('/:divisionId/roles', divisionScope(['admin']), divisionController.getRoles);
router.post('/:divisionId/roles', divisionScope(['admin']), divisionController.addRole);
router.put('/:divisionId/roles/:roleId', divisionScope(['admin']), divisionController.updateRole);
router.delete(
  '/:divisionId/roles/:roleId',
  divisionScope(['admin']),
  divisionController.removeRole
);

// <============================> Role Assignment Routes <============================>

router.post(
  '/:divisionId/roles/:userId/assign',
  divisionScope(['admin']),
  divisionController.assignRole
);
router.delete(
  '/:divisionId/roles/:userId/unassign/:roleId',
  divisionScope(['admin']),
  divisionController.unassignRole
);

export default router;
