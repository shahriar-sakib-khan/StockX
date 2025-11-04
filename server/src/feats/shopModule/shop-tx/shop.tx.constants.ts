/**
 * @module shopTx.constants
 *
 * @description
 * Constants for shop-related cylinder transactions.
 * Provides key-value objects instead of plain strings for stronger typing,
 * consistency across APIs, and safer enum-style usage in both backend and frontend.
 */

/**
 * ----------------- Transaction Categories -----------------
 */

export const ShopTxCategory = {
  // ========== Cylinder Exchange ==========
  CYLINDER_EXCHANGE_CASH: 'cylinder_exchange_cash', // exchange full-for-empty cylinders with immediate payment
  CYLINDER_EXCHANGE_CREDIT: 'cylinder_exchange_credit', // exchange on credit (due payment)
  CYLINDER_EXCHANGE_RETURN: 'cylinder_exchange_return', // reverse or correction entry for exchanges
  
  // ========== Retail/Wholesale Sales ==========
  CYLINDER_SALE_TO_SHOP_CASH: 'cylinder_sale_to_shop_cash', // sell cylinders to shop for cash
  CYLINDER_SALE_TO_SHOP_CREDIT: 'cylinder_sale_to_shop_credit', // sell cylinders to shop on credit
  
  // ========== Payment/Settlement ==========
  SHOP_PAYMENT_RECEIVED: 'shop_payment_received', // payment received from shop to clear due
  SHOP_PAYMENT_ADJUSTMENT: 'shop_payment_adjustment', // adjust shop balance (discount, correction, etc.)

  SHOP_DUE_PAYMENT: "SHOP_DUE_PAYMENT",
} as const;

export type ShopTxCategoryType = (typeof ShopTxCategory)[keyof typeof ShopTxCategory];

/**
 * ----------------- Payment Methods -----------------
 */
export const ShopPaymentMethod = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE: 'mobile',
  DUE: 'due',
  NON_CASH: 'non-cash',
  OTHER: 'other',
} as const;

export type ShopPaymentMethodType = (typeof ShopPaymentMethod)[keyof typeof ShopPaymentMethod];

/**
 * ----------------- Counterparty Kind -----------------
 */
export const ShopCounterpartyKind = {
  SHOP: 'shop',
  STORE: 'store',
  SUPPLIER: 'supplier',
  CUSTOMER: 'customer',
  INTERNAL: 'internal',
} as const;

export type ShopCounterpartyKindType =
  (typeof ShopCounterpartyKind)[keyof typeof ShopCounterpartyKind];
