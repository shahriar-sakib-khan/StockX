/**
 * @module ShopTxController
 *
 * @description
 * Controller for managing shop-level transactions including cylinder exchanges, due clearance,
 * and retrieving shop transaction histories.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';
import { shopTxService } from './index.js';

/**
 * ----------------- Shop Transaction Controller -----------------
 */

/**
 * @route   POST /stores/:storeId/shops/:shopId/clear-due
 * @desc    Clear due for a specific shop
 * @access  Authenticated
 */
export const clearShopDue = async (req: Request, res: Response) => {
  try {
    assertAuth(req);
    const { userId } = req.user;
    const { storeId, shopId } = req.params;

    const tx = await shopTxService.clearShopDue(req.body, userId, storeId, shopId);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Shop due cleared successfully',
      data: tx,
    });
  } catch (error: any) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to clear shop due',
    });
  }
};

/**
 * @route   GET /stores/:storeId/shops/:shopId/transactions
 * @desc    Get all transactions for a single shop (paginated)
 * @access  Authenticated
 */
export const singleShopTransactions = async (req: Request, res: Response) => {
  try {
    assertAuth(req);
    const { storeId, shopId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await shopTxService.singleShopTransactions(storeId, shopId, page, limit);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fetched shop transactions successfully',
      data: result,
      meta: { page, limit },
    });
  } catch (error: any) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to fetch shop transactions',
    });
  }
};

/**
 * @route   GET /stores/:storeId/shop-transactions
 * @desc    Get all shop-related transactions for a store (paginated)
 * @access  Authenticated
 */
export const allShopTransactions = async (req: Request, res: Response) => {
  try {
    assertAuth(req);
    const { storeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await shopTxService.allShopTransactions(storeId, page, limit);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fetched all shop-related transactions successfully',
      data: result,
      meta: { page, limit },
    });
  } catch (error: any) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to fetch all shop transactions',
    });
  }
};

/**
 * @route   POST /stores/:storeId/shops/exchange
 * @desc    Handle cylinder exchange transaction for a shop
 * @access  Authenticated
 */
export const cylinderExchangeGasSell = async (req: Request, res: Response) => {
  try {
    assertAuth(req);
    const { userId } = req.user;
    const { storeId } = req.params;

    const result = await shopTxService.handleCylinderExchangeGasSell(req.body, userId, storeId);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Shop cylinder exchange recorded successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to record shop exchange transaction',
    });
  }
};

/**
 * ----------------- Default Exports (shopTxController) -----------------
 */
export default {
  clearShopDue,
  singleShopTransactions,
  allShopTransactions,
  cylinderExchangeGasSell,
};
