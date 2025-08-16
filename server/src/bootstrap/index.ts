import seedGlobalBrands from './seedGlobalBrands';

export { default as seedLocalBrands } from './seedLocalBrands';
export { default as seedLocalCylinders } from './seedLocalCylinders';
export { default as seedBaseTxCategories } from './seedBaseTxCategories';
export { default as seedBaseAccounts } from './seedBaseAccounts';

export default async function runBootstrap() {
  await seedGlobalBrands();
}
