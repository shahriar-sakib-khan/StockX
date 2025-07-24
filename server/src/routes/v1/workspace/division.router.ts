import express from 'express';

import { divisionController } from '@/controllers/v1';
import { workspaceScope, divisionScope, validateRequest } from '@/middlewares';
import { division } from '@/validations';

const router = express.Router({ mergeParams: true });

router.post('/',workspaceScope(['admin']), validateRequest(division.divisionSchema), divisionController.createDivision);

router.get('/:divisionId', divisionController.singleDivision);

router.put(
  '/:divisionId',
  divisionScope(['admin']),
  validateRequest(division.divisionSchema),
  divisionController.updateDivision
);

router.get('/', divisionController.allDivisions);

router.delete('/:divisionId', divisionScope(['admin']), divisionController.deleteDivision);

export default router;
