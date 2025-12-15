import { ClientSession, Types } from 'mongoose';

import { generateInvoiceAndTransaction } from '../invoice/invoice.helper.js';

import { Errors } from '@/error/index.js';
import { Cylinder } from '@/feats/cylinderModule/index.js';
import { Vehicle } from '@/feats/vehicleModule/index.js';

interface B2BInput {
  shopId: string;
  vehicleId: string;
  items: any[];
  empties?: any[];
  discount: number;
  paidAmount: number;
  paymentMethod?: string;
  ref?: string;
}

export const createB2BSale = async (
  data: B2BInput,
  userId: string,
  storeId: string,
  session?: ClientSession
) => {
  const { vehicleId, items, empties = [], ...financials } = data;

  const vehicle = await Vehicle.findOne({ _id: vehicleId, store: storeId }).session(
    session || null
  );
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // 1. Deduct Stock from Vehicle (No price validation here as prices aren't in Vehicle)
  // NOTE: B2B Delivery typically uses agreed prices or store prices.
  // For safety, you might want to fetch prices from Cylinder/Product models here too,
  // but for brevity we focus on inventory logic.

  for (const item of items) {
    let vItem;
    // Both 'gas' and 'cylinder' consume a full cylinder from truck
    if (item.productType === 'cylinder' || item.productType === 'gas') {
      vItem = vehicle.inventory.cylinders.find((c: any) => String(c.cylinderId) === item.productId);
      if (!vItem || vItem.fullCount < item.quantity) {
        throw new Errors.BadRequestError(`Truck Insufficient Stock: ${item.name}`);
      }
      vItem.fullCount -= item.quantity;
    } else {
      const list =
        item.productType === 'stove' ? vehicle.inventory.stoves : vehicle.inventory.regulators;
      vItem = list.find((p: any) => String(p.productId) === item.productId);
      if (!vItem || vItem.quantity < item.quantity) {
        throw new Errors.BadRequestError(`Truck Insufficient Stock: ${item.name}`);
      }
      vItem.quantity -= item.quantity;
    }
  }

  // 2. Add Empties to Vehicle
  if (empties.length) {
    for (const item of empties) {
      const vItem = vehicle.inventory.cylinders.find(
        (c: any) => String(c.cylinderId) === item.productId
      );
      if (vItem) {
        vItem.emptyCount += item.quantity;
      } else {
        // Verify existence in global store before adding to truck
        const exists = await Cylinder.exists({ _id: item.productId, store: storeId }).session(
          session || null
        );
        if (!exists) throw new Errors.BadRequestError(`Invalid cylinder ID: ${item.name}`);

        vehicle.inventory.cylinders.push({
          cylinderId: new Types.ObjectId(item.productId),
          fullCount: 0,
          emptyCount: item.quantity,
          defectedCount: 0,
        });
      }
    }
  }

  await vehicle.save({ session });

  return await generateInvoiceAndTransaction(
    { storeId, userId, session },
    {
      items,
      empties,
      financials: {
        discount: financials.discount,
        paidAmount: financials.paidAmount,
        paymentMethod: financials.paymentMethod,
      },
      meta: {
        shopId: data.shopId,
        vehicleId,
        channel: 'b2b_delivery',
        ref: financials.ref,
      },
    }
  );
};

export default { createB2BSale };
