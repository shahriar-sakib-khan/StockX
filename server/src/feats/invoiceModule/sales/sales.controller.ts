import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { directSaleService, deliverySaleService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

// --- B2C DIRECT ---

export const directExchange = async (req: Request, res: Response) => {
  assertMembership(req);
  const result = await withTransaction(session =>
    directSaleService.createB2CSale(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
};

export const directNewPackage = async (req: Request, res: Response) => {
  assertMembership(req);
  const result = await withTransaction(session =>
    directSaleService.createB2CSale(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
};

export const directProduct = async (req: Request, res: Response) => {
  assertMembership(req);
  const result = await withTransaction(session =>
    directSaleService.createB2CSale(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
};

// --- B2B DELIVERY ---

export const deliveryExchange = async (req: Request, res: Response) => {
  assertMembership(req);
  const result = await withTransaction(session =>
    deliverySaleService.createB2BSale(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
};

export const deliveryNewPackage = async (req: Request, res: Response) => {
  assertMembership(req);
  const result = await withTransaction(session =>
    deliverySaleService.createB2BSale(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
};

export const deliveryProduct = async (req: Request, res: Response) => {
  assertMembership(req);
  const result = await withTransaction(session =>
    deliverySaleService.createB2BSale(req.body, req.user.userId, req.params.storeId, session)
  );
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
};

export default {
  directExchange,
  directNewPackage,
  directProduct,
  deliveryExchange,
  deliveryNewPackage,
  deliveryProduct,
};
