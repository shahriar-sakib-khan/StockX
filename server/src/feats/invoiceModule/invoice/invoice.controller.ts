import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { invoiceService } from './index.js';

import { assertMembership } from '@/common/index.js';

export const getSingleInvoice = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId, invoiceId } = req.params;
  const invoice = await invoiceService.getInvoiceById(invoiceId, storeId);
  res.status(StatusCodes.OK).json({ success: true, data: { invoice } });
};

export const getAllInvoices = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await invoiceService.getAllInvoices(storeId, page, limit);
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

export default { getSingleInvoice, getAllInvoices };
