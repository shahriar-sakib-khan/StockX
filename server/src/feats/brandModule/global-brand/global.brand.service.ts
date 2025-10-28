// src/feats/brandModule/global-brand/global.brand.service.ts
import { Types } from 'mongoose';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

import { Errors } from '@/error/index.js';
import { GlobalBrand, IGlobalBrand } from './index.js';

type MulterFiles = {
  brandImage?: Express.Multer.File[];
  cylinderImage?: Express.Multer.File[];
};

type CloudinaryUploadResult = { url?: string; public_id?: string };

const uploadBufferToCloudinary = (
  file?: Express.Multer.File,
  folder = 'brands'
): Promise<CloudinaryUploadResult> => {
  if (!file) return Promise.resolve({ url: undefined, public_id: undefined });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        resolve({
          url: result?.secure_url,
          public_id: result?.public_id,
        });
      }
    );

    // file.buffer exists when using multer.memoryStorage()
    if (!file.buffer) {
      // If using disk storage, fallback to path-based upload
      cloudinary.uploader
        .upload(file.path, { folder })
        .then((res: UploadApiResponse) =>
          resolve({ url: res.secure_url, public_id: res.public_id })
        )
        .catch(reject);
      return;
    }

    // stream the buffer
    // @ts-ignore - stream.end expects Buffer
    stream.end(file.buffer);
  });
};

/**
 * Parse potential JSON fields sent as strings via multipart/form-data
 * (e.g. prices and sizes). Keeps existing array if already array.
 */
const parseMaybeJSONFields = (data: Partial<IGlobalBrand>): Partial<IGlobalBrand> => {
  const parsed: Partial<IGlobalBrand> = { ...data };

  // sizes may come as stringified JSON in form-data: "[5,12,20]"
  if (typeof parsed.sizes === 'string') {
    try {
      const s = JSON.parse(parsed.sizes as unknown as string);
      if (Array.isArray(s)) parsed.sizes = s.map(Number);
      else parsed.sizes = [];
    } catch {
      parsed.sizes = [];
    }
  }

  // prices may come as stringified JSON: '[{"size":12,"regulatorType":"20","price":4800}]'
  if (typeof parsed.prices === 'string') {
    try {
      const p = JSON.parse(parsed.prices as unknown as string);
      if (Array.isArray(p)) parsed.prices = p as IGlobalBrand['prices'];
      else parsed.prices = [];
    } catch {
      parsed.prices = [];
    }
  }

  return parsed;
};

/**
 * ----------------- Service Functions -----------------
 */

export const getAllGlobalBrands = async (): Promise<IGlobalBrand[]> => {
  return await GlobalBrand.find().sort({ createdAt: -1 }).lean();
};

export const getGlobalBrandById = async (id: string): Promise<IGlobalBrand | null> => {
  if (!Types.ObjectId.isValid(id)) throw new Errors.BadRequestError('Invalid brand ID');

  return await GlobalBrand.findById(id).lean();
};

export const createGlobalBrand = async (
  data: Partial<IGlobalBrand>,
  files?: MulterFiles
): Promise<IGlobalBrand> => {
  // Safely parse string fields sent via multipart/form-data
  const safeData = parseMaybeJSONFields(data);

  // upload files (buffer or disk path) to cloudinary
  const brandUpload = await uploadBufferToCloudinary(files?.brandImage?.[0]);
  const cylinderUpload = await uploadBufferToCloudinary(files?.cylinderImage?.[0]);

  const newDoc = await GlobalBrand.create({
    ...safeData,
    brandImage: brandUpload.url ?? (safeData.brandImage as string | undefined),
    brandImagePublicId: brandUpload.public_id ?? undefined,
    cylinderImage: cylinderUpload.url ?? (safeData.cylinderImage as string | undefined),
    cylinderImagePublicId: cylinderUpload.public_id ?? undefined,
  } as Partial<IGlobalBrand>);

  return newDoc;
};

export const updateGlobalBrand = async (
  id: string,
  data: Partial<IGlobalBrand>,
  files?: MulterFiles
): Promise<IGlobalBrand | null> => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid brand ID');

  const brand = await GlobalBrand.findById(id);
  if (!brand) throw new Errors.NotFoundError('Brand not found');

  const safeData = parseMaybeJSONFields(data);

  // If brand image is replaced, remove old public id then upload new one
  if (files?.brandImage?.[0]) {
    if (brand.brandImagePublicId) {
      try {
        await cloudinary.uploader.destroy(brand.brandImagePublicId);
      } catch (err) {
        // log but don't stop execution
        console.warn('Failed to destroy previous brandImage at Cloudinary', err);
      }
    }
    const res = await uploadBufferToCloudinary(files.brandImage[0]);
    brand.brandImage = res.url ?? brand.brandImage;
    brand.brandImagePublicId = res.public_id ?? brand.brandImagePublicId;
  }

  // Cylinder image replacement
  if (files?.cylinderImage?.[0]) {
    if (brand.cylinderImagePublicId) {
      try {
        await cloudinary.uploader.destroy(brand.cylinderImagePublicId);
      } catch (err) {
        console.warn('Failed to destroy previous cylinderImage at Cloudinary', err);
      }
    }
    const res = await uploadBufferToCloudinary(files.cylinderImage[0]);
    brand.cylinderImage = res.url ?? brand.cylinderImage;
    brand.cylinderImagePublicId = res.public_id ?? brand.cylinderImagePublicId;
  }

  // Assign other fields - sizes/prices already parsed.
  Object.assign(brand, safeData);
  await brand.save();

  // Return plain object shape similar to .lean()
  return brand.toObject() as IGlobalBrand;
};

export const deleteGlobalBrand = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid brand ID');

  const brand = await GlobalBrand.findById(id);
  if (!brand) throw new Error('Brand not found');

  // attempt to cleanup images from Cloudinary (best-effort)
  if (brand.brandImagePublicId) {
    try {
      await cloudinary.uploader.destroy(brand.brandImagePublicId);
    } catch (err) {
      console.warn('Failed to destroy brandImage at Cloudinary', err);
    }
  }
  if (brand.cylinderImagePublicId) {
    try {
      await cloudinary.uploader.destroy(brand.cylinderImagePublicId);
    } catch (err) {
      console.warn('Failed to destroy cylinderImage at Cloudinary', err);
    }
  }

  await brand.deleteOne();
};

export default {
  getAllGlobalBrands,
  getGlobalBrandById,
  createGlobalBrand,
  updateGlobalBrand,
  deleteGlobalBrand,
};
