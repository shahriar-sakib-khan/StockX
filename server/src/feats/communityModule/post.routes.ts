import { Router } from 'express';
import { postController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: LPG cylinder swap community posts
 */

const router = Router({ mergeParams: true });

/**
 * ------------------------------------------------------
 * Community Feed (Store scoped)
 * ------------------------------------------------------
 */

/**
 * @route   GET /stores/:storeId/swap
 * @desc    Get all swap posts visible to this store
 * @access  Authenticated
 */
router.get('/swap', postController.getAllPosts);

/**
 * @route   POST /stores/:storeId/swap/post
 * @desc    Create a new swap post
 * @body    offer[], take[], description, postType
 * @access  Authenticated
 */
router.post('/swap/post', postController.createPost);

/**
 * @route   POST /stores/:storeId/swap
 * @desc    Perform a swap action between two stores
 * @access  Authenticated
 */
router.post('/swap', postController.performSwap);

/**
 * ------------------------------------------------------
 * Single Post Routes (Not store scoped)
 * ------------------------------------------------------
 */

/**
 * @route   GET /community/swap/:postId
 * @desc    Fetch single post details
 * @access  Authenticated
 */
router.get('/swap/:postId', postController.getSinglePost);

/**
 * @route   POST /swap/:postId/like
 * @desc    Like a post
 * @access  Authenticated
 */
router.post('/swap/:postId/like', postController.likePost);

/**
 * @route   POST /swap/:postId/unlike
 * @desc    Unlike a post
 * @access  Authenticated
 */
router.post('/swap/:postId/unlike', postController.unlikePost);

/**
 * @route   POST /swap/:postId/save
 * @desc    Save a post (bookmark)
 * @access  Authenticated
 */
router.post('/swap/:postId/save', postController.savePost);

/**
 * @route   POST /swap/:postId/unsave
 * @desc    Unsave a post (remove bookmark)
 * @access  Authenticated
 */
router.post('/swap/:postId/unsave', postController.unsavePost);

/**
 * @route   POST /swap/:postId/comment
 * @desc    Add a comment to a post
 * @body    text
 * @access  Authenticated
 */
router.post('/swap/:postId/comment', postController.addComment);

/**
 * @route   DELETE /swap/:postId/comment/:commentId
 * @desc    Delete a comment from a post
 * @access  Authenticated
 */
router.delete('/swap/:postId/comment/:commentId', postController.deleteComment);

export default router;
