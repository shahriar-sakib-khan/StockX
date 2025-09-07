// @ts-check

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

export {};
