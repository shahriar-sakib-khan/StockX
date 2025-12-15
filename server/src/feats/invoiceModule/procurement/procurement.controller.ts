import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { procurementService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const purchasePackage = async (req: Request, res: Response) => {
  assertMembership(req);
  await withTransaction(session =>
    procurementService.handlePackagePurchase(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Package purchase recorded' });
};

export const purchaseRefill = async (req: Request, res: Response) => {
  assertMembership(req);
  await withTransaction(session =>
    procurementService.handleRefillPurchase(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Refill purchase recorded' });
};

export const purchaseProduct = async (req: Request, res: Response) => {
  assertMembership(req);
  await withTransaction(session =>
    procurementService.handleProductPurchase(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Product purchase recorded' });
};

export const exchangeDefected = async (req: Request, res: Response) => {
  assertMembership(req);
  await withTransaction(session =>
    procurementService.handleDefectedExchange(
      req.body,
      req.user.userId,
      req.params.storeId,
      session
    )
  );
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Defected exchange recorded' });
};

export default {
  purchasePackage,
  purchaseRefill,
  purchaseProduct,
  exchangeDefected,
};
