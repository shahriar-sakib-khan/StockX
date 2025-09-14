import { GlobalBrand } from '@/models/index.js';

const defaultBrands = [
  {
    name: 'Omera',
    image: 'imagURL',
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
    image: 'imagURL',
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
    image: 'imagURL',
    regulatorTypes: ['20', '22'],
    sizes: [5, 12, 20],
    prices: [
      { size: 5, regulatorType: '22', price: 2300 },
      { size: 12, regulatorType: '20', price: 4400 },
      { size: 12, regulatorType: '22', price: 8200 },
    ],
  },
];

const seedGlobalBrands = async () => {
  const count = await GlobalBrand.countDocuments();
  if (count > 0) {
    console.log('[Seed] GlobalBrand collection already seeded.');
    return;
  }

  await GlobalBrand.insertMany(defaultBrands);
  console.log('[Seed] Inserted default GlobalBrands.');
};

export default seedGlobalBrands;
