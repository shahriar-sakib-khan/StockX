/**
 * @module CloudinaryHelper
 *
 * @description
 * Cloudinary configuration and upload utility — safe for both API and script-based calls.
 */

import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

/** ----------------- Environment Safety Check ----------------- */
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
}

/** ----------------- Cloudinary Configuration ----------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** ----------------- Upload Utility -----------------
 * Uploads a file to Cloudinary and returns { url, publicId }.
 * Automatically handles missing files and folders gracefully.
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ File not found: ${filePath}`);
  }

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: publicId, // 👈 this line added
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    return { url: res.secure_url, publicId: res.public_id };
  } catch (error: any) {
    console.error(`❌ Cloudinary upload failed for ${filePath}: ${error.message}`);
    throw error;
  }
};

/** ----------------- API Seed Helper -----------------
 * Use inside an API route to handle seeding images from a folder.
 */
export const seedFolderToCloudinary = async (
  localFolderPath: string,
  cloudFolder: string
): Promise<{ uploaded: number; results: any[] }> => {
  try {
    const absFolderPath = path.resolve(localFolderPath);
    if (!fs.existsSync(absFolderPath)) {
      throw new Error(`Seed folder not found: ${absFolderPath}`);
    }

    const files = fs.readdirSync(absFolderPath).filter(f => !f.startsWith('.'));
    console.log(`🌱 Seeding ${files.length} files to Cloudinary (${cloudFolder})...`);

    const results = [];
    for (const file of files) {
      const filePath = path.join(absFolderPath, file);
      const res = await uploadToCloudinary(filePath, cloudFolder);
      results.push(res);
    }

    console.log(`✅ Successfully uploaded ${results.length} files.`);
    return { uploaded: results.length, results };
  } catch (err: any) {
    console.error(`❌ Seeding failed: ${err.message}`);
    throw err;
  }
};

export default cloudinary;
