import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';
import { regulatorTxService } from './index.js';

/**
 * ----------------- Handle Regulator Transaction (Buy / Sell) -----------------
 */
export const handleRegulatorTransaction = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const regulatorType = Number(req.query.regulatorType);
  let mode = String(req.query.mode) as 'buy' | 'sell' | undefined;

  if (mode !== 'buy' && mode !== 'sell') {
    mode = 'sell';
    console.warn(`[WARN] Invalid mode provided, defaulting to 'sell'`);
  }

  const result = await regulatorTxService.handleRegulatorTransaction(
    req.body,
    regulatorType,
    mode,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Regulator transaction (${mode}) recorded successfully.`,
    data: result,
  });
};

/**
 * ----------------- Mark or Unmark Defected Regulators -----------------
 */
export const handleDefectedMarking = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const regulatorType = Number(req.query.regulatorType);
  let doMark = true;
  if (String(req.query.doMark) === 'false') {
    doMark = false;
  } else if (String(req.query.doMark) !== 'true') {
    console.warn(`[WARN] Invalid mode provided, defaulting to 'true'`);
  }

  const result = await regulatorTxService.handleDefectedRegulatorMarking(
    req.body,
    regulatorType,
    doMark,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Regulator defect status updated successfully.`,
    data: result,
  });
};

export default { handleRegulatorTransaction, handleDefectedMarking };
