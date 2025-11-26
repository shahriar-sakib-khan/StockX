import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Post, postSanitizers } from './index.js';
import { Store } from '@/feats/storeModule/index.js';

/**
 * ----------------- Fetch All Swap Posts -----------------
 */

/**
 * @function getAllPosts
 * @description Returns all swap posts visible to a store.
 * @param {string} storeId
 */
export const getAllPosts = async (storeId: string) => {
  const store = await Store.findById(storeId).lean();
  if (!store) throw new Errors.NotFoundError('Store not found.');

  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  return {
    posts: postSanitizers.allPostSanitizer(posts).posts,
  };
};

/**
 * ----------------- Fetch Single Post -----------------
 */

/**
 * @function getSinglePost
 * @description Returns details of a single swap post by ID.
 * @param {string} storeId
 * @param {string} postId
 */
export const getSinglePost = async (storeId: string, postId: string) => {
  const store = await Store.findById(storeId).lean();
  if (!store) throw new Errors.NotFoundError('Store not found.');

  const post = await Post.findById(postId).lean();
  if (!post) throw new Errors.NotFoundError('Swap post not found.');

  return postSanitizers.postSanitizer(post);
};

/**
 * ----------------- Create New Post -----------------
 */

/**
 * @function createPost
 * @description Creates a new swap post for a store.
 * @param {string} storeId
 * @param {any} payload
 * @returns Sanitized swap post
 */
export const createPost = async (userId: string, storeId: string, payload: any) => {
  const post = await Post.create({
    ...payload,
    store: new Types.ObjectId(storeId),
    createdBy: new Types.ObjectId(userId),
  });

  return postSanitizers.postSanitizer(post);
};

/**
 * ----------------- Perform Swap Between Stores -----------------
 */

/**
 * @function performSwap
 * @description Performs the actual swap operation between stores.
 * @param {string} storeId
 * @param {any} payload
 */
export const performSwap = async (storeId: string, payload: any) => {
  // const swap = await SwapAction.create({
  //   store: new Types.ObjectId(storeId),
  //   ...payload,
  // });
  const data = 'Swap performed successfully.';
  return {
    data,
  };
};

// /**
//  * ----------------- Like Post -----------------
//  */

// export const likePost = async (postId: string, userId: string) => {
//   const post = await Post.findById(postId);

//   if (!post) throw new Errors.NotFoundError('Post not found.');

//   post.likes.addToSet(new Types.ObjectId(userId));
//   await post.save();

//   return postSanitizers.postSanitizer(post.toObject());
// };

// /**
//  * ----------------- Unlike Post -----------------
//  */

// export const unlikePost = async (postId: string, userId: string) => {
//   const post = await Post.findById(postId);

//   if (!post) throw new Errors.NotFoundError('Post not found.');

//   post.likes.pull(new Types.ObjectId(userId));
//   await post.save();

//   return postSanitizers.postSanitizer(post.toObject());
// };

// /**
//  * ----------------- Save Post -----------------
//  */

// export const savePost = async (postId: string, userId: string) => {
//   const post = await Post.findById(postId);

//   if (!post) throw new Errors.NotFoundError('Post not found.');

//   post.savedBy.addToSet(new Types.ObjectId(userId));
//   await post.save();

//   return postSanitizers.postSanitizer(post.toObject());
// };

// /**
//  * ----------------- Unsave Post -----------------
//  */

// export const unsavePost = async (postId: string, userId: string) => {
//   const post = await Post.findById(postId);

//   if (!post) throw new Errors.NotFoundError('Post not found.');

//   post.savedBy.pull(new Types.ObjectId(userId));
//   await post.save();

//   return postSanitizers.postSanitizer(post.toObject());
// };

// /**
//  * ----------------- Comment on Post -----------------
//  */

// export const commentOnPost = async (postId: string, userId: string, payload: { text: string }) => {
//   const post = await Post.findById(postId);

//   if (!post) throw new Errors.NotFoundError('Post not found.');

//   post.comments.push({
//     user: new Types.ObjectId(userId),
//     text: payload.text,
//     createdAt: new Date(),
//   });

//   await post.save();

//   return postSanitizers.postSanitizer(post.toObject());
// };

// /**
//  * ----------------- Delete Comment -----------------
//  */

// export const deleteComment = async (postId: string, commentId: string, userId: string) => {
//   const post = await Post.findById(postId);

//   if (!post) throw new Errors.NotFoundError('Post not found.');

//   const comment = post.comments.id(commentId);

//   if (!comment) throw new Errors.NotFoundError('Comment not found.');

//   if (comment.user.toString() !== userId)
//     throw new Errors.BadRequestError('You can delete only your own comments.');

//   comment.deleteOne();
//   await post.save();

//   return postSanitizers.postSanitizer(post.toObject());
// };

// /**
//  * ----------------- Default Export -----------------
//  */

export default {
  getAllPosts,
  getSinglePost,
  createPost,
  performSwap,

  // likePost,
  // unlikePost,
  // savePost,
  // unsavePost,

  // commentOnPost,
  // deleteComment,
};
