import { Router } from 'express';
import multer from 'multer';

import { globalBrandController } from './index.js';

const router = Router({ mergeParams: true });

// Use memory storage for Cloudinary upload (no local files)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Global Brands
 *   description: Admin management for global brand data
 */

router.get('/global-brands', globalBrandController.allGlobalBrands);
router.get('/global-brands/:id', globalBrandController.getSingleGlobalBrand);

router.post(
  '/global-brands',
  upload.fields([
    { name: 'brandImage', maxCount: 1 },
    { name: 'cylinderImage', maxCount: 1 },
  ]),
  globalBrandController.createGlobalBrand
);

router.patch(
  '/global-brands/:id',
  upload.fields([
    { name: 'brandImage', maxCount: 1 },
    { name: 'cylinderImage', maxCount: 1 },
  ]),
  globalBrandController.updateGlobalBrand
);

router.delete('/global-brands/:id', globalBrandController.deleteGlobalBrand);

export default router;
