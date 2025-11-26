/**
 * @module PostController
 *
 * @description Controller for community swap post operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { postService } from './index.js';
import { assertAuth } from '@/common/assertions.js';

/**
 * ------------------------------------------------------
 * Community Posts (Store scoped)
 * ------------------------------------------------------
 */

/**
 * @route   GET /stores/:storeId/swap
 * @desc    Fetch all swap posts visible to a store
 */
export const getAllPosts = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const { posts } = await postService.getAllPosts(storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Posts fetched successfully`,
    data: posts,
  });
};

/**
 * @route   POST /stores/:storeId/swap/post
 * @desc    Create a swap post
 */
export const createPost = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;
  const payload = req.body;

  const post = await postService.createPost(userId, storeId, payload);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: `Post created successfully.`,
    data: post,
  });
};

// /**
//  * @route   POST /stores/:storeId/swap
//  * @desc    Perform swap operation
//  */
// export const performSwap = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { storeId } = req.params;
//   const payload = req.body;

//   const result = await postService.performSwap(storeId, userId, payload);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Swap performed successfully.`,
//     data: result,
//   });
// };

// /**
//  * ------------------------------------------------------
//  * Single Post Routes
//  * ------------------------------------------------------
//  */

// /**
//  * @route   GET /community/swap/:postId
//  * @desc    Fetch single post details
//  */
// export const getSinglePost = async (req: Request, res: Response) => {
//   const { storeId, postId } = req.params;

//   const post = await postService.getSinglePost(storeId, postId);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Post fetched successfully`,
//     data: post,
//   });
// };

// /**
//  * @route   POST /swap/:postId/like
//  * @desc    Like a post
//  */
// export const likePost = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { postId } = req.params;

//   const updated = await postService.likePost(postId, userId);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Post liked.`,
//     data: updated,
//   });
// };

// /**
//  * @route   POST /swap/:postId/unlike
//  * @desc    Unlike a post
//  */
// export const unlikePost = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { postId } = req.params;

//   const updated = await postService.unlikePost(postId, userId);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Post unliked.`,
//     data: updated,
//   });
// };

// /**
//  * @route   POST /swap/:postId/save
//  * @desc    Save (bookmark) a post
//  */
// export const savePost = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { postId } = req.params;

//   const updated = await postService.savePost(postId, userId);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Post saved.`,
//     data: updated,
//   });
// };

// /**
//  * @route   POST /swap/:postId/unsave
//  * @desc    Unsave (remove bookmark)
//  */
// export const unsavePost = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { postId } = req.params;

//   const updated = await postService.unsavePost(postId, userId);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Post unsaved.`,
//     data: updated,
//   });
// };

// /**
//  * @route   POST /swap/:postId/comment
//  * @desc    Add a comment
//  */
// export const addComment = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { postId } = req.params;
//   const { text } = req.body;

//   if (!text) throw new Error('Comment text is required.');

//   const comment = await postService.addComment(postId, userId, text);

//   res.status(StatusCodes.CREATED).json({
//     success: true,
//     message: `Comment added.`,
//     data: comment,
//   });
// };

// /**
//  * @route   DELETE /swap/:postId/comment/:commentId
//  * @desc    Delete a comment
//  */
// export const deleteComment = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { postId, commentId } = req.params;

//   const result = await postService.deleteComment(postId, commentId, userId);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: `Comment deleted.`,
//     data: result,
//   });
// };

/**
 * ------------------------------------------------------
 * Default Export
 * ------------------------------------------------------
 */
export default {
  getAllPosts,
  createPost,
  // performSwap,
  // getSinglePost,
  // likePost,
  // unlikePost,
  // savePost,
  // unsavePost,
  // addComment,
  // deleteComment,
};
