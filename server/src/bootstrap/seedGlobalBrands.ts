import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { uploadToCloudinary } from '@/config/index.js';
import { GlobalBrand } from '@/feats/brandModule/index.js';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRANDS_DIR = path.join(__dirname, './assets/brands');
const CYLINDERS_DIR = path.join(__dirname, './assets/cylinders');

const SIZES = [5.5, 12, 12.5, 15, 20, 25, 30, 33, 35, 45];
const REGULATOR_TYPES = ['20', '22'];

const PRICE_PER_KG = 103.4;
const CUSTOM_PRICES: Record<number, number> = {
  5.5: 569,
  12: 1241,
  15: 1551,
  20: 2068,
  25: 2585,
  30: 3102,
  35: 3619,
  45: 4653,
};

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------
const predictPrice = (size: number): number =>
  CUSTOM_PRICES[size] ?? Math.round(size * PRICE_PER_KG);

/**

* Attempts to upload a file to Cloudinary with retries. */
const uploadWithRetry = async (
  filePath: string,
  folder: string,
  customName: string,
  retries = 2
) => {
  try {
    return await uploadToCloudinary(filePath, folder, customName);
  } catch (err) {
    if (retries > 0) {
      console.warn(`⚠️ Upload failed for ${path.basename(filePath)}, retrying...`);
      return uploadWithRetry(filePath, folder, customName, retries - 1);
    }
    console.error(`❌ Failed to upload ${filePath} after retries:`, err);
    throw err;
  }
};

// -----------------------------------------------------------------------------
// Seeder Function
// -----------------------------------------------------------------------------
const seedGlobalBrands = async (): Promise<void> => {
  const brandFiles = fs.readdirSync(BRANDS_DIR);
  const expectedCount = brandFiles.length;

  const existingBrands = await GlobalBrand.find();
  const existingCount = existingBrands.length;

  const healthy =
    existingCount === expectedCount &&
    brandFiles.every(file =>
      existingBrands.some(b => b.name === path.basename(file, path.extname(file)).toLowerCase())
    );

  if (healthy) {
    console.log(`✅ [Seed:GlobalBrand] Already healthy (${existingCount}).`);
    return;
  }

  console.log(`⚙️ [Seed:GlobalBrand] Rebuilding brand dataset...`);
  await GlobalBrand.deleteMany({});

  const cylinderFiles = fs.readdirSync(CYLINDERS_DIR);
  const brands = [];

  for (const brandFile of brandFiles) {
    const name = path.basename(brandFile, path.extname(brandFile)).toLowerCase();
    const cylinderFile = cylinderFiles.find(f => f.toLowerCase().startsWith(name));

    // ----------------- Upload brand image -----------------
    const brandUpload = await uploadWithRetry(
      path.join(BRANDS_DIR, brandFile),
      'brands',
      `${name}-brand`
    );

    // ----------------- Upload cylinder image (if exists) -----------------
    const cylinderUpload = cylinderFile
      ? await uploadWithRetry(
          path.join(CYLINDERS_DIR, cylinderFile),
          'cylinders',
          `${name}-cylinder`
        )
      : null;

    // ----------------- Price matrix generation -----------------
    const prices = SIZES.flatMap(size =>
      REGULATOR_TYPES.map(reg => ({
        size,
        regulatorType: reg,
        price: predictPrice(size),
      }))
    );

    brands.push({
      name,
      brandImage: brandUpload.url,
      brandImagePublicId: brandUpload.publicId,
      cylinderImage: cylinderUpload?.url ?? '',
      cylinderImagePublicId: cylinderUpload?.publicId ?? '',
      regulatorTypes: REGULATOR_TYPES,
      sizes: SIZES,
      prices,
    });
  }

  await GlobalBrand.insertMany(brands);
  console.log(`✅ [Seed:GlobalBrand] Seeded ${brands.length} brands successfully.`);
};

export default seedGlobalBrands;
