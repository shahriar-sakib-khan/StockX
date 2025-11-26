import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    likeSwapPost,
    unlikeSwapPost,
    saveSwapPost,
    unsaveSwapPost,
    commentOnPost,
    deleteComment,
} from "../services/swap";

/**
 * Like a post
 */
export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: likeSwapPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["swap-posts"]);
        },
    });
};

/**
 * Unlike a post
 */
export const useUnlikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unlikeSwapPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["swap-posts"]);
        },
    });
};

/**
 * Save a post
 */
export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveSwapPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["swap-posts"]);
            queryClient.invalidateQueries(["saved-posts"]);
        },
    });
};

/**
 * Unsave a post
 */
export const useUnsavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unsaveSwapPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["swap-posts"]);
            queryClient.invalidateQueries(["saved-posts"]);
        },
    });
};

/**
 * Comment on post
 */
export const useCommentOnPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, payload }) => commentOnPost(postId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["swap-posts"]);
        },
    });
};

/**
 * Delete comment
 */
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["swap-posts"]);
        },
    });
};
