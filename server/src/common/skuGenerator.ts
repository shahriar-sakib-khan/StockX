import { Types } from 'mongoose';

import { Cylinder } from '@/models/index.js';

interface GenerateSKUInput {
  name: string;
  size: number;
  unit: string;
  regulatorType: string;
  storeId: string | Types.ObjectId; // scope SKU to workspace
}

/**
 * Generate unique Stock Keeping Unit
 * @returns {string} sku
 * @example GEN-22-12L-1
 */
export const generateSKU = async ({
  name,
  size,
  unit,
  regulatorType,
  storeId,
}: GenerateSKUInput): Promise<string> => {
  const brandCode = name?.substring(0, 3).toUpperCase() || 'GEN';
  const sizeUnit = size && unit ? `${size}${unit[0].toUpperCase()}` : '12L';
  const regulatorTypeCode = regulatorType?.replace(/\D/g, '').substring(0, 2).toUpperCase() || '22';
  const baseSku = `${brandCode}-${regulatorTypeCode}-${sizeUnit}`;

  // Fetch all existing SKUs starting with baseSku within this workspace
  const existingSkus = await Cylinder.find({
    sku: { $regex: `^${baseSku}` },
    store: storeId,
  }).select('sku');

  if (!existingSkus.length) return baseSku;

  // Extract numeric suffixes and determine max
  const suffixes = existingSkus.map(d => {
    const match = d.sku.match(/-(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const maxSuffix = suffixes.length ? Math.max(...suffixes) : 0;
  return maxSuffix ? `${baseSku}-${maxSuffix + 1}` : baseSku;
};
