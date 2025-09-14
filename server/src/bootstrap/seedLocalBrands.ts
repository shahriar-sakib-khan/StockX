import { Types } from 'mongoose';

import { GlobalBrand, LocalBrand } from '@/models/index.js';

const seedLocalBrands = async (
  workspaceId: string,
  divisionId: string,
  userId: string
): Promise<void> => {
  const globalBrands = await GlobalBrand.find();

  const localBrands = globalBrands.map(globalBrand => ({
    globalBrand: globalBrand._id,
    name: globalBrand.name,
    image: globalBrand.image,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    selectedBy: new Types.ObjectId(userId),
    isActive: false,
  }));

  await LocalBrand.insertMany(localBrands);
  console.log('[Seed] Local brands seeded successfully');
};

export default seedLocalBrands;
