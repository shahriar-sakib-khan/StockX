/**
 * @module StoveController
 *
 * @description Controller for managing gas stove inventory.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { stoveService } from './index.js';

/**
 * ----------------- Stove Inventory Controller -----------------
 */

/**
 * @function getStoveInventory
 * @description Retrieves stove inventory data for a specific store
 */
export const getStoveInventory = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const inventoryData = await stoveService.getStoveInventory(storeId);

  res.status(StatusCodes.OK).json(inventoryData);
};

/**
 * ----------------- Default Exports (stoveController) -----------------
 */
export default {
  getStoveInventory,
};
