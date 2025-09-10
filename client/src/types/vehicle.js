// @ts-check

/** Vehicle CRUD operation typedefs */

/**
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} regNumber
 * @property {string|null} vehicleBrand
 * @property {string|null} vehicleModel
 * @property {string} workspace
 * @property {string} division
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
 * @property {VehicleCategoryType} category - Required. Must be vehicle-related.
 * @property {PaymentMethodType} [paymentMethod] - Optional payment method.
 * @property {string} [ref] - Optional reference string (invoice/voucher).
 * @property {Object<string, any>} [details] - Optional extra metadata.
 * @property {string} workspace - Workspace ID.
 * @property {string} division - Division ID.
 */

/**
 * @typedef {Object} VehicleTransaction
 * @property {string} id
 * @property {Object} workspace
 * @property {Object} division
 * @property {number} amount
 * @property {VehicleCategoryType} category
 * @property {PaymentMethodType | null} paymentMethod
 * @property {string} counterpartyType
 * @property {Object | null} staff
 * @property {Object | null} vehicle
 * @property {Object | null} store
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
