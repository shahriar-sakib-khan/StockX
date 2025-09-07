// @ts-check

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} username
 * @property {string|null} [address]
 * @property {string} role
 */

/**
 * @typedef {Object} RegisterResponse
 * @property {string} message
 * @property {User} user
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} message
 * @property {User} user
 * @property {string} accessToken
 */

/**
 * @typedef {Object} LogoutResponse
 * @property {string} message
 */

/**
 * @typedef {Object} RefreshResponse
 * @property {string} accessToken
 */

/**
 * @typedef {Object} GetUserResponse
 * @property {User} user
 */

/**
 * @typedef {Object} UpdateUserResponse
 * @property {string} message
 * @property {User} user
 */

/**
 * @typedef {Object} Workspace
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Division
 * @property {string} id
 * @property {string} name
 */

export {};
