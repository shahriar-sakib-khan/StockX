import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';
import { stoveTxService } from './index.js';

/**
 * ----------------- Handle Stove Transaction (Buy / Sell) -----------------
 */
export const handleStoveTransaction = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const burnerCount = Number(req.query.burnerCount);
  let mode = String(req.query.mode) as 'buy' | 'sell' | undefined;

  if (mode !== 'buy' && mode !== 'sell') {
    mode = 'sell';
    console.warn(`[WARN] Invalid mode provided, defaulting to 'sell'`);
  }

  const result = await stoveTxService.handleStoveTransaction(
    req.body,
    burnerCount,
    mode,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Stove transaction (${mode}) recorded successfully.`,
    data: result,
  });
};

/**
 * ----------------- Mark or Unmark Defected Stoves -----------------
 */
export const handleDefectedMarking = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const burnerCount = Number(req.query.burnerCount);
  let doMark = true;
  if (String(req.query.doMark) === 'false') {
    doMark = false;
  } else if (String(req.query.doMark) !== 'true') {
    console.warn(`[WARN] Invalid mode provided, defaulting to 'true'`);
  }

  const result = await stoveTxService.handleDefectedStoveMarking(
    req.body,
    burnerCount,
    doMark,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Stove defect status updated successfully.`,
    data: result,
  });
};

export default { handleStoveTransaction, handleDefectedMarking };
