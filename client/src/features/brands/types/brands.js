// @ts-check

/**
 * @typedef {Object} Brand
 * @property {string} id
 * @property {string} name
 * @property {string} [image]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} SelectedBrand
 * @property {string} id
 * @property {boolean} isActive
 */

/**
 * @typedef {Partial<{
 *   id: string;
 *   name: string;
 *   image: string;
 *   globalBrand: any;
 *   division: any;
 *   workspace: any;
 *   selectedBy: any;
 *   isActive: boolean;
 *   totalFullCount: number;
 *   totalEmptyCount: number;
 * }>} DetailedBrand


/**
 * @typedef {Object} BrandsResponse
 * @property {Brand[]} localBrands
 * @property {number} total
 */

/**
 * @typedef {Object} DetailedBrandsResponse
 * @property {DetailedBrand[]} localBrands
 * @property {number} total
 */

/**
 * @typedef {Object} SaveBrandsResponse
 * @property {string} message
 * @property {SelectedBrand[]} [updatedBrands]
 */

export {};
