import { Types, ClientSession } from 'mongoose';

import { Membership } from '../index.js';

import { DefaultStoreRoles } from './store.constants.js';

import { Store, IStore, storeValidator, storeSanitizers } from './index.js';

import { generateStoreCode } from '@/common/index.js';
import { Errors } from '@/error/index.js';
import { localBrandService } from '@/feats/brandModule/index.js';
import { cylinderService } from '@/feats/cylinderModule/index.js';
import { regulatorService, stoveService } from '@/feats/productModule/index.js';
import { staffService } from '@/feats/staffModule/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';
import { vehicleService } from '@/feats/vehicleModule/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function createStore
 * @description Creates a new store, assigns the creator as 'owner', and returns the store with role.
 */
export const createStore = async (
  data: storeValidator.CreateStoreInput,
  userId: string,
  session?: ClientSession
): Promise<storeSanitizers.SanitizedStore & { myRole: string }> => {
  const { name, ...otherProps } = data;

  const exists = await Store.exists({ name, createdBy: userId }).session(session || null);
  if (exists) throw new Errors.BadRequestError('You already have a store with this name');

  const storeCode = generateStoreCode();

  const [store] = await Store.create(
    [
      {
        ...otherProps,
        name,
        storeCode,
        storeRoles: DefaultStoreRoles,
        createdBy: new Types.ObjectId(userId),
      },
    ],
    { session }
  );

  await Membership.create(
    [
      {
        store: store._id,
        user: new Types.ObjectId(userId),
        storeRole: 'owner',
        status: 'active',
      },
    ],
    { session }
  );

  logger.info(`Store created: ${name} (${storeCode}) by user ${userId}`);

  return {
    ...storeSanitizers.storeSanitizer(store),
    myRole: 'owner',
  };
};

/**
 * @function getSingleStore
 * @description Fetches a store and determines the user's role (Owner check vs Membership lookup).
 */
export const getSingleStore = async (
  storeId: string,
  userId: string
): Promise<storeSanitizers.SanitizedStore & { myRole: string }> => {
  const store = await Store.findById(storeId).lean();
  if (!store) throw new Errors.NotFoundError('Store not found');

  let myRole = 'visitor';

  // 1. Check Ownership (Fastest)
  if (String(store.createdBy) === userId) {
    myRole = 'owner';
  } else {
    // 2. Check Membership
    const membership = await Membership.findOne({
      store: storeId,
      user: userId,
      status: 'active',
    })
      .select('storeRole')
      .lean();

    if (membership) myRole = membership.storeRole;
  }

  return {
    ...storeSanitizers.storeSanitizer(store as unknown as IStore),
    myRole,
  };
};

/**
 * @function getAllStores
 * @description Fetches all stores (owned + joined) for a user with 'all' or 'detailed' mode.
 */
export const getAllStores = async (
  userId: string,
  page: number,
  limit: number,
  mode: 'all' | 'detailed' = 'all'
): Promise<{
  stores: (Partial<storeSanitizers.SanitizedStore> & { myRole: string })[];
  total: number;
}> => {
  const skip = (page - 1) * limit;
  const userObjectId = new Types.ObjectId(userId);

  // OPTIMIZATION: Run independent queries in parallel
  const [ownedStoresDocs, memberships] = await Promise.all([
    // 1. Fetch Owned Stores
    Store.find({ createdBy: userObjectId }).lean(),
    // 2. Fetch Memberships (Joined)
    Membership.find({ user: userObjectId, status: 'active' }).select('store storeRole').lean(),
  ]);

  const ownedStores = ownedStoresDocs.map(doc => ({
    doc: doc as unknown as IStore,
    role: 'owner',
  }));

  const joinedStoreIds = memberships.map(m => m.store);

  // Map for O(1) Role Lookup
  const roleMap = memberships.reduce(
    (acc, curr) => {
      acc[String(curr.store)] = curr.storeRole;
      return acc;
    },
    {} as Record<string, string>
  );

  const joinedStoresDocs = await Store.find({
    _id: { $in: joinedStoreIds },
    createdBy: { $ne: userObjectId },
  }).lean();

  const joinedStores = joinedStoresDocs.map(doc => ({
    doc: doc as unknown as IStore,
    role: roleMap[String(doc._id)] || 'member',
  }));

  // 3. Combine & Paginate
  const allStores = [...ownedStores, ...joinedStores];
  const total = allStores.length;
  const paginatedItems = allStores.slice(skip, skip + limit);

  // 4. Determine Fields based on Mode
  let selectedFields: (keyof storeSanitizers.SanitizedStore)[] | undefined;

  if (mode === 'all') {
    selectedFields = ['id', 'name', 'storeCode', 'image', 'description', 'phone', 'location'];
  }

  // 5. Sanitize
  const sanitizedStores = storeSanitizers.allStoreSanitizer(
    paginatedItems.map(item => item.doc),
    selectedFields
  ).stores;

  // 6. Merge Roles back
  const finalStores = sanitizedStores.map((store, index) => ({
    ...store,
    myRole: paginatedItems[index].role,
  }));

  return {
    stores: finalStores,
    total,
  };
};

/**
 * @function updateStore
 * @description Updates a store and returns it with the user's role.
 */
export const updateStore = async (
  storeId: string,
  userId: string,
  data: storeValidator.UpdateStoreInput,
  session?: ClientSession
): Promise<storeSanitizers.SanitizedStore & { myRole: string }> => {
  const myRole = String(
    await Membership.findOne({
      store: storeId,
      user: userId,
      status: 'active',
    })
      .select('storeRole')
      .lean()
      .then(m => (m ? m.storeRole : 'visitor'))
  );

  if (myRole !== 'owner') {
    throw new Errors.ForbiddenError('You do not have permission to update this store');
  }

  if (data.name) {
    const exists = await Store.exists({
      name: data.name,
      _id: { $ne: storeId },
    }).session(session || null);

    if (exists) throw new Errors.BadRequestError('Store name is already taken');
  }

  const store = await Store.findByIdAndUpdate(
    storeId,
    { $set: data },
    { new: true, session, runValidators: true }
  ).lean();

  if (!store) throw new Errors.NotFoundError('Store not found');

  logger.info(`Store updated: ${store.name} (${storeId})`);

  return {
    ...storeSanitizers.storeSanitizer(store as unknown as IStore),
    myRole,
  };
};

/**
 * @function deleteStore
 * @description Deletes a store and returns it with 'owner' role.
 */
export const deleteStore = async (
  storeId: string,
  session?: ClientSession
): Promise<storeSanitizers.SanitizedStore & { myRole: string }> => {
  // 1. Delete the Store Document
  const store = await Store.findByIdAndDelete(storeId, { session }).lean();
  if (!store) throw new Errors.NotFoundError('Store not found');

  // 2. Delete Memberships
  await Membership.deleteMany({ store: storeId }, { session });

  // 3. Cascading Delete (Call other services)
  await vehicleService.removeAllVehicles(storeId, session);
  await transactionService.removeAllTransactions(storeId, session);
  await localBrandService.removeAllLocalBrands(storeId, session);

  // Future Implementations:
  await cylinderService.removeAllCylinders(storeId, session);
  await stoveService.removeAllStoves(storeId, session);
  await regulatorService.removeAllRegulators(storeId, session);
  await staffService.removeAllStaff(storeId, session);

  logger.info(`Store deleted: ${store.name} (${storeId})`);

  return {
    ...storeSanitizers.storeSanitizer(store as unknown as IStore),
    myRole: 'owner',
  };
};

export default {
  createStore,
  getSingleStore,
  getAllStores,
  updateStore,
  deleteStore,
};
