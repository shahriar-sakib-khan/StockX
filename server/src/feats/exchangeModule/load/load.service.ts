import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';

/**
 * ----------------- Create Exchange Service -----------------
 */
export const loadCylinder = async (payload: any, mode: 'full' | 'empty', userId: string) => {
};

export const unloadCylinder = async (payload: any, mode: 'full' | 'empty', userId: string) => {
};

/**
 * ----------------- Default Export -----------------
 */
export default {
  loadCylinder,
  unloadCylinder,
};
