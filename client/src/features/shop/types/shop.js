// @ts-check

/** Shop CRUD operation typedefs */

/**
 * @typedef {Object} Shop
 * @property {string} id
 * @property {string} name
 * @property {string|null} contactName
 * @property {string|null} phone
 * @property {string|null} address
 * @property {string|null} image
 * @property {number} balance
 * @property {string} workspace
 * @property {string} division
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} NewShop
 * @property {string} name
 * @property {string|null} contactName
 * @property {string|null} phone
 * @property {string|null} address
 * @property {string|null} image
 */

/**
 * @typedef {Object} UpdatedShop
 * @property {string} name
 * @property {string|null} contactName
 * @property {string|null} phone
 * @property {string|null} address
 * @property {string|null} image
 */

/**
 * @typedef {Object} AllShopsResponse
 * @property {Shop[]} stores // api stores == client shops
 * @property {number} total
 */

/**
 * @typedef {Object} SingleShopResponse
 * @property {Shop} store // api store == client shop
 */

/**
 * @typedef {Object} CreateShopResponse
 * @property {string} message
 * @property {Shop} store // api store == client shop
 */

/**
 * @typedef {Object} UpdateShopResponse
 * @property {string} message
 * @property {Shop} store // api store == client shop
 */

/**
 * @typedef {Object} DeleteShopResponse
 * @property {string} message
 * @property {Shop} store // api store == client shop
 */

/** Shop payment operation typedefs */

// These will be implemented later when the api is ready

/**
 * @typedef {'fuel_payment' | 'repair_payment'} ShopCategoryType
 * @typedef {'cash' | 'bank' | 'mobile' | 'due' | 'other'} PaymentMethodType
 */

/**
 * @typedef {Object} ShopTransactionInput
 * @property {number} amount - Required. Transaction amount.
 * @property {ShopCategoryType} category - Required. Must be shop-related.
 * @property {PaymentMethodType} [paymentMethod] - Optional payment method.
 * @property {string} [ref] - Optional reference string (invoice/voucher).
 * @property {Object<string, any>} [details] - Optional extra metadata.
 * @property {string} workspace - Workspace ID.
 * @property {string} division - Division ID.
 */

/**
 * @typedef {Object} ShopTransaction
 * @property {string} id
 * @property {Object} workspace
 * @property {Object} division
 * @property {number} amount
 * @property {ShopCategoryType} category
 * @property {PaymentMethodType | null} paymentMethod
 * @property {string} counterpartyType
 * @property {Object | null} staff
 * @property {Object | null} shop
 * @property {Object | null} store
 * @property {Object | null} customer
 * @property {Object} transactedBy
 * @property {string | null} ref
 * @property {Object | null} details
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ShopTransactionResponse
 * @property {ShopTransaction} transaction
 * @property {Shop} shop - Updated shop summary (like totalRepairCost, totalFuelCost)
 */

/**
 * @typedef {Object} AllShopTransactionsResponse
 * @property {ShopTransaction[]} transactions
 * @property {number} total
 */

export {};
