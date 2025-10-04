// @ts-check

/** Vehicle CRUD operation typedefs */

/**
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} regNumber
 * @property {string|null} vehicleBrand
 * @property {string|null} vehicleModel
 * @property {string} store - Store ID this vehicle belongs to
 * @property {number} totalFuelCost
 * @property {number} totalRepairCost
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} NewVehicle
 * @property {string} regNumber
 * @property {string} vehicleBrand
 * @property {string} vehicleModel
 */

/**
 * @typedef {Object} UpdatedVehicle
 * @property {string} regNumber
 * @property {string} vehicleBrand
 * @property {string} vehicleModel
 */

/**
 * @typedef {Object} AllVehiclesResponse
 * @property {Vehicle[]} vehicles
 * @property {number} total
 */

/**
 * @typedef {Object} SingleVehicleResponse
 * @property {Vehicle} vehicle
 */

/**
 * @typedef {Object} CreateVehicleResponse
 * @property {string} message
 * @property {Vehicle} vehicle
 */

/**
 * @typedef {Object} UpdateVehicleResponse
 * @property {string} message
 * @property {Vehicle} vehicle
 */

/**
 * @typedef {Object} DeleteVehicleResponse
 * @property {string} message
 * @property {Vehicle} vehicle
 */

/** Vehicle transaction/expenses operation typedefs */

/**
 * @typedef {'fuel_payment' | 'repair_payment'} VehicleCategoryType
 * @typedef {'cash' | 'bank' | 'mobile' | 'due' | 'other'} PaymentMethodType
 */

/**
 * @typedef {Object} VehicleTransactionInput
 * @property {number} amount - Required. Transaction amount.
 * @property {VehicleCategoryType} category - Required. Must be either "fuel_payment" or "repair_payment".
 * @property {PaymentMethodType} [paymentMethod] - Optional payment method.
 * @property {string} [ref] - Optional reference string (invoice/voucher).
 * @property {Object<string, any>} [details] - Optional extra metadata (like garage info for repairs, fuel type, etc).
 * @property {string} store - Store ID this transaction is tied to
 */

/**
 * @typedef {Object} VehicleTransaction
 * @property {string} id
 * @property {string} store - Store ID
 * @property {number} amount
 * @property {VehicleCategoryType} category
 * @property {PaymentMethodType | null} paymentMethod
 * @property {string} counterpartyType
 * @property {Object | null} staff
 * @property {Object | null} vehicle
 * @property {Object | null} customer
 * @property {Object} transactedBy
 * @property {string | null} ref
 * @property {Object | null} details
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} VehicleTransactionResponse
 * @property {VehicleTransaction} transaction
 * @property {Vehicle} vehicle - Updated vehicle summary (like totalRepairCost, totalFuelCost)
 */

/**
 * @typedef {Object} AllVehicleTransactionsResponse
 * @property {VehicleTransaction[]} transactions
 * @property {number} total
 */

export {};
