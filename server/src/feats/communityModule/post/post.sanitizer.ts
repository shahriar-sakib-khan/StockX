/**
 * @module PostSanitizer
 *
 * @description Sanitizers for Post model.
 */

import { HydratedDocument } from 'mongoose';
import { resolveRef, listSanitizer, storeSanitizer, userSanitizer } from '@/sanitizers/index.js';
import { IPost } from './index.js';

/**
 * ----------------- Post -----------------
 */
export const postSanitizer = (post: IPost | HydratedDocument<IPost>) => ({
  id: String(post._id),

  store: resolveRef(post.store, storeSanitizer),
  storeName: post.storeName,
  storeOwnerName: post.storeOwnerName ?? null,
  phone: post.phone,
  storeImage: post.storeImage ?? null,

  postType: post.postType,

  offer:
    post.offer?.map(o => ({
      brand: o.brand,
      size: o.size,
      regulatorType: o.regulatorType,
      quantity: o.quantity,
    })) ?? [],

  take:
    post.take?.map(t => ({
      brand: t.brand,
      size: t.size,
      regulatorType: t.regulatorType,
      quantity: t.quantity,
    })) ?? [],

  description: post.description ?? null,

  likes: post.likes ?? [],

  comments:
    post.comments?.map(c => ({
      user: resolveRef(c.userId, userSanitizer),
      text: c.text,
      createdAt: c.createdAt,
    })) ?? [],

  title: post.title,

  createdBy: resolveRef(post.createdBy, userSanitizer),
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export type SanitizedPost = ReturnType<typeof postSanitizer>;

/**
 * ----------------- Post List -----------------
 * Can optionally select only specific fields
 */
export const allPostSanitizer = (
  posts: IPost[] | HydratedDocument<IPost>[],
  fields?: (keyof SanitizedPost)[]
) => ({
  posts: listSanitizer(posts, postSanitizer, fields),
});

export type SanitizedPosts = ReturnType<typeof allPostSanitizer>;
