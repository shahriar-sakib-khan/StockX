import { Types, ClientSession } from 'mongoose';

import { Membership } from '../index.js';

import { Store, IStore, storeValidator, storeSanitizers } from './index.js';

import { generateStoreCode } from '@/common/index.js';
import { Errors } from '@/error/index.js';
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

  const defaultRoles = [
    { name: 'owner', permissions: ['*'] },
    { name: 'admin', permissions: ['manage_store', 'assign_roles'] },
    { name: 'manager', permissions: ['manage_store', 'assign_roles'] },
    { name: 'staff', permissions: [] },
    { name: 'driver', permissions: [] },
  ];

  const [store] = await Store.create(
    [
      {
        ...otherProps,
        name,
        storeCode,
        storeRoles: defaultRoles,
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

  // 1. Fetch Owned Stores
  const ownedStoresDocs = await Store.find({ createdBy: userObjectId }).lean();
  const ownedStores = ownedStoresDocs.map(doc => ({
    doc: doc as unknown as IStore,
    role: 'owner',
  }));

  // 2. Fetch Memberships (Joined)
  const memberships = await Membership.find({
    user: userObjectId,
    status: 'active',
  })
    .select('store storeRole')
    .lean();

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
  const store = await Store.findByIdAndDelete(storeId, { session }).lean();
  if (!store) throw new Errors.NotFoundError('Store not found');

  await Membership.deleteMany({ store: storeId }, { session });

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
