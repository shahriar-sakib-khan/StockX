/**
 * @module RegulatorController
 * 
 * @description Controller for managing gas regulator inventory.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { regulatorService } from './index.js';

/**
 * ----------------- Regulator Inventory Controller -----------------
 */

export const getRegulatorInventory = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const inventoryData = await regulatorService.getRegulatorInventory(storeId);

  res.status(StatusCodes.OK).json(inventoryData);
};

export default {
  getRegulatorInventory,
};
