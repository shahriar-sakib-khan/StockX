import { GlobalBrand } from '@/models/index.js';

/**
 * ----------------- Default Brands List -----------------
 */
const defaultBrands = [
  {
    name: 'Omera',
    brandImage: 'brandImageURL',
    cylinderImage: 'cylinderImageURL',
    regulatorTypes: ['20', '22'],
    sizes: [5, 12, 20],
    prices: [
      { size: 6, regulatorType: '22', price: 2500 },
      { size: 12, regulatorType: '20', price: 4800 },
      { size: 12, regulatorType: '22', price: 4600 },
    ],
  },
  {
    name: 'Bashundhara',
    brandImage: 'brandImageURL',
    cylinderImage: 'cylinderImageURL',
    regulatorTypes: ['20', '22'],
    sizes: [5, 12, 20],
    prices: [
      { size: 12, regulatorType: '20', price: 4500 },
      { size: 12, regulatorType: '22', price: 4550 },
      { size: 18, regulatorType: '22', price: 6700 },
    ],
  },
  {
    name: 'Green LPG',
    brandImage: 'brandImageURL',
    cylinderImage: 'cylinderImageURL',
    regulatorTypes: ['20', '22'],
    sizes: [5, 12, 20],
    prices: [
      { size: 5, regulatorType: '22', price: 2300 },
      { size: 12, regulatorType: '20', price: 4400 },
      { size: 12, regulatorType: '22', price: 8200 },
    ],
  },
];

/**
 * @function seedGlobalBrands
 * @description
 * Seeds the GlobalBrand collection with default brands.
 */
const seedGlobalBrands = async () => {
  const count = await GlobalBrand.countDocuments();
  if (count === defaultBrands.length) {
    console.log('[Seed] GlobalBrand collection already seeded.');
    return;
  }

  await GlobalBrand.deleteMany({});
  await GlobalBrand.insertMany(defaultBrands);

  console.log('[Seed] Inserted default GlobalBrands.');
};

export default seedGlobalBrands;
