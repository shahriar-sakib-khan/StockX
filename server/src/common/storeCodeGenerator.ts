import crypto from 'crypto';
/**
 * Helper: Generate a 6-character uppercase alphanumeric code
 * Example: "7X9A2M"
 */
export const generateStoreCode = (): string => {
  return crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
};
