import { Types, ClientSession, Model } from 'mongoose';

import { Vehicle } from '../index.js';

import { cargoValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { Cylinder } from '@/feats/cylinderModule/index.js';
import { Regulator, Stove } from '@/feats/productModule/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';
import { logger } from '@/utils/index.js';

/**
 * Helper to ensure all IDs in the request actually exist in the DB for this store.
 */
const validateIdsExist = async (
  model: Model<any>,
  ids: string[],
  storeId: string,
  entityName: string
) => {
  if (!ids.length) return;

  // Deduplicate IDs
  const uniqueIds = [...new Set(ids)];

  const count = await model.countDocuments({
    _id: { $in: uniqueIds },
    store: storeId,
  });

  if (count !== uniqueIds.length) {
    // Optimization: Find exactly which ones are missing for the error message
    const foundDocs = await model
      .find({ _id: { $in: uniqueIds }, store: storeId })
      .select('_id')
      .lean();

    const foundIds = new Set(foundDocs.map(d => String(d._id)));
    const missingIds = uniqueIds.filter(id => !foundIds.has(id));

    throw new Errors.NotFoundError(
      `The following ${entityName} IDs were not found in this store: ${missingIds.join(', ')}`
    );
  }
};

/**
 * @function loadVehicle
 * @description Moves stock FROM Store TO Vehicle.
 */
export const loadVehicle = async (
  vehicleId: string,
  storeId: string,
  userId: string,
  data: cargoValidator.CargoOperationInput,
  session?: ClientSession
) => {
  // 1. Pre-validation: Check existence of all entities
  await Promise.all([
    validateIdsExist(
      Cylinder,
      data.cylinders.map(c => c.cylinderId),
      storeId,
      'Cylinder'
    ),
    validateIdsExist(
      Stove,
      data.stoves.map(s => s.productId),
      storeId,
      'Stove'
    ),
    validateIdsExist(
      Regulator,
      data.regulators.map(r => r.productId),
      storeId,
      'Regulator'
    ),
  ]);

  const vehicle = await Vehicle.findOne({ _id: vehicleId, store: storeId }).session(
    session || null
  );
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // 2. Process Cylinders
  for (const item of data.cylinders) {
    // A. Deduct from Store (Atomic Check & Set)
    const storeCyl = await Cylinder.findOneAndUpdate(
      {
        _id: item.cylinderId,
        store: storeId,
        fullCount: { $gte: item.fullCount },
        emptyCount: { $gte: item.emptyCount },
      },
      {
        $inc: {
          fullCount: -item.fullCount,
          emptyCount: -item.emptyCount,
        },
      },
      { new: true, session }
    );

    // Since we validated existence above, null here specifically means stock issues
    if (!storeCyl) {
      throw new Errors.BadRequestError(
        `Insufficient store stock for cylinder: ${item.cylinderId} (Requested: F=${item.fullCount}, E=${item.emptyCount})`
      );
    }

    // B. Add to Vehicle
    const existingIdx = vehicle.inventory.cylinders.findIndex(
      c => String(c.cylinderId) === item.cylinderId
    );
    if (existingIdx > -1) {
      vehicle.inventory.cylinders[existingIdx].fullCount += item.fullCount;
      vehicle.inventory.cylinders[existingIdx].emptyCount += item.emptyCount;
    } else {
      vehicle.inventory.cylinders.push({
        cylinderId: new Types.ObjectId(item.cylinderId),
        fullCount: item.fullCount,
        emptyCount: item.emptyCount,
        defectedCount: 0,
      });
    }
  }

  // 3. Process Stoves
  for (const item of data.stoves) {
    const storeStove = await Stove.findOneAndUpdate(
      { _id: item.productId, store: storeId, stockCount: { $gte: item.quantity } },
      { $inc: { stockCount: -item.quantity } },
      { session }
    );
    if (!storeStove) {
      throw new Errors.BadRequestError(`Insufficient store stock for stove: ${item.productId}`);
    }

    const idx = vehicle.inventory.stoves.findIndex(s => String(s.productId) === item.productId);
    if (idx > -1) vehicle.inventory.stoves[idx].quantity += item.quantity;
    else
      vehicle.inventory.stoves.push({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
      });
  }

  // 4. Process Regulators
  for (const item of data.regulators) {
    const storeReg = await Regulator.findOneAndUpdate(
      { _id: item.productId, store: storeId, stockCount: { $gte: item.quantity } },
      { $inc: { stockCount: -item.quantity } },
      { session }
    );
    if (!storeReg) {
      throw new Errors.BadRequestError(`Insufficient store stock for regulator: ${item.productId}`);
    }

    const idx = vehicle.inventory.regulators.findIndex(r => String(r.productId) === item.productId);
    if (idx > -1) vehicle.inventory.regulators[idx].quantity += item.quantity;
    else
      vehicle.inventory.regulators.push({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
      });
  }

  await vehicle.save({ session });

  // 5. Log Transaction
  await transactionService.recordTransaction(
    {
      category: 'stock_transfer_out',
      amount: 0,
      paymentMethod: 'other',
      vehicleId,
      details: { note: 'Stock Loaded to Vehicle', ...data },
    },
    userId,
    storeId,
    session
  );

  logger.info(`Vehicle Loaded: ${vehicle.regNumber} (${vehicleId})`);
  return vehicle;
};

/**
 * @function unloadVehicle
 * @description Moves stock FROM Vehicle TO Store.
 */
export const unloadVehicle = async (
  vehicleId: string,
  storeId: string,
  userId: string,
  data: cargoValidator.CargoOperationInput,
  session?: ClientSession
) => {
  // 1. Pre-validation: Check existence of all entities (Cannot dump unknown items to store)
  await Promise.all([
    validateIdsExist(
      Cylinder,
      data.cylinders.map(c => c.cylinderId),
      storeId,
      'Cylinder'
    ),
    validateIdsExist(
      Stove,
      data.stoves.map(s => s.productId),
      storeId,
      'Stove'
    ),
    validateIdsExist(
      Regulator,
      data.regulators.map(r => r.productId),
      storeId,
      'Regulator'
    ),
  ]);

  const vehicle = await Vehicle.findOne({ _id: vehicleId, store: storeId }).session(
    session || null
  );
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // 2. Process Cylinders
  for (const item of data.cylinders) {
    // A. Deduct from Vehicle Memory
    const vCyl = vehicle.inventory.cylinders.find(c => String(c.cylinderId) === item.cylinderId);

    if (
      !vCyl ||
      vCyl.fullCount < item.fullCount ||
      vCyl.emptyCount < item.emptyCount ||
      vCyl.defectedCount < item.defectedCount
    ) {
      throw new Errors.BadRequestError(
        `Vehicle insufficient stock for cylinder: ${item.cylinderId}`
      );
    }

    vCyl.fullCount -= item.fullCount;
    vCyl.emptyCount -= item.emptyCount;
    vCyl.defectedCount -= item.defectedCount;

    // B. Add to Store (Using findOneAndUpdate to ensure target exists)
    await Cylinder.findOneAndUpdate(
      { _id: item.cylinderId, store: storeId },
      {
        $inc: {
          fullCount: item.fullCount,
          emptyCount: item.emptyCount,
          defectedCount: item.defectedCount,
        },
      },
      { session }
    );
  }

  // 3. Process Stoves
  for (const item of data.stoves) {
    const vStove = vehicle.inventory.stoves.find(s => String(s.productId) === item.productId);
    if (!vStove || vStove.quantity < item.quantity) {
      throw new Errors.BadRequestError(`Vehicle insufficient stock for stove: ${item.productId}`);
    }

    vStove.quantity -= item.quantity;

    await Stove.findOneAndUpdate(
      { _id: item.productId, store: storeId },
      { $inc: { stockCount: item.quantity } },
      { session }
    );
  }

  // 4. Process Regulators
  for (const item of data.regulators) {
    const vReg = vehicle.inventory.regulators.find(r => String(r.productId) === item.productId);
    if (!vReg || vReg.quantity < item.quantity) {
      throw new Errors.BadRequestError(
        `Vehicle insufficient stock for regulator: ${item.productId}`
      );
    }

    vReg.quantity -= item.quantity;

    await Regulator.findOneAndUpdate(
      { _id: item.productId, store: storeId },
      { $inc: { stockCount: item.quantity } },
      { session }
    );
  }

  await vehicle.save({ session });

  // 5. Log Transaction
  await transactionService.recordTransaction(
    {
      category: 'stock_transfer_in',
      amount: 0,
      paymentMethod: 'other',
      vehicleId,
      details: { note: 'Stock Unloaded from Vehicle', ...data },
    },
    userId,
    storeId,
    session
  );

  logger.info(`Vehicle Unloaded: ${vehicle.regNumber} (${vehicleId})`);
  return vehicle;
};

export default { loadVehicle, unloadVehicle };
