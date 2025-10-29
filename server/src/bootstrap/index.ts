export { default as seedLocalBrands } from './seedLocalBrands.js';
export { default as seedLocalCylinders } from './seedLocalCylinders.js';
export { default as seedLocalRegulators } from './seedLocalRegulators.js';
export { default as seedLocalStoves } from './seedLocalStoves.js';
export { default as seedBaseTxCategories } from './seedBaseTxCategories.js';
export { default as seedBaseAccounts } from './seedBaseAccounts.js';

import seedGlobalBrands from './seedGlobalBrands.js';

export default async function runBootstrap() {
  await seedGlobalBrands();
}
