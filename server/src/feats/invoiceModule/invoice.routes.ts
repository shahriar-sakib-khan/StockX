import { Router } from 'express';

import { invoiceController, invoiceValidator } from './invoice/index.js';
import { salesController } from './sales/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Invoice & Sales
 */

// ----------------- B2C DIRECT (Store -> Customer) -----------------
// 1. Refill Exchange (Gas)
router.post(
  '/sales/direct/exchange',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(invoiceValidator.b2cExchangeSchema),
  salesController.directExchange
);

// 2. New Package (Cylinder + Gas)
router.post(
  '/sales/direct/new',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(invoiceValidator.b2cNewSchema),
  salesController.directNewPackage
);

// 3. Product Sale (Stoves)
router.post(
  '/sales/direct/product',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(invoiceValidator.b2cProductSchema),
  salesController.directProduct
);

// ----------------- B2B DELIVERY (Vehicle -> Shop) -----------------
// 4. Refill Exchange
router.post(
  '/sales/delivery/exchange',
  storeScope(['owner', 'admin', 'manager', 'driver']),
  validateRequest(invoiceValidator.b2bExchangeSchema),
  salesController.deliveryExchange
);

// 5. New Package
router.post(
  '/sales/delivery/new',
  storeScope(['owner', 'admin', 'manager', 'driver']),
  validateRequest(invoiceValidator.b2bNewSchema),
  salesController.deliveryNewPackage
);

// 6. Product Sale
router.post(
  '/sales/delivery/product',
  storeScope(['owner', 'admin', 'manager', 'driver']),
  validateRequest(invoiceValidator.b2bProductSchema),
  salesController.deliveryProduct
);

// ----------------- READ -----------------
router.get('/', storeScope(['owner', 'admin', 'manager']), invoiceController.getAllInvoices);
router.get(
  '/:invoiceId',
  storeScope(['owner', 'admin', 'manager']),
  invoiceController.getSingleInvoice
);

export default router;
