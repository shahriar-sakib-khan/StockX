import API from "@/services/apiClient";

/**
 * GET /community/swap
 * Fetches all swap posts visible to this store/user.
 */
export const fetchSwapPosts = async (storeId) => {
    const { data } = await API.get(`/stores/${storeId}/swap`);
    return data;
};

/**
 * GET /community/swap/:postId
 * Fetch single post details
 */
export const fetchSingleSwapPost = async (postId) => {
    const { data } = await API.get(`/community/swap/${postId}`);
    return data;
};

/**
 * POST /stores/:storeId/swap/post
 * Creates a new swap post for a store
 */
export const createSwapPost = async (storeId, payload) => {
    const { data } = await API.post(`/stores/${storeId}/swap/post`, payload);
    return data;
};

/**
 * POST /stores/:storeId/swap
 * Performs the actual swap action between two stores
 */
export const performSwap = async (storeId, payload) => {
    const { data } = await API.post(`/stores/${storeId}/swap`, payload);
    return data;
};

/**
 * POST /swap/:postId/like
 */
export const likeSwapPost = async (postId) => {
    const { data } = await API.post(`/swap/${postId}/like`);
    return data;
};

/**
 * POST /swap/:postId/unlike
 */
export const unlikeSwapPost = async (postId) => {
    const { data } = await API.post(`/swap/${postId}/unlike`);
    return data;
};

/**
 * POST /swap/:postId/save
 */
export const saveSwapPost = async (postId) => {
    const { data } = await API.post(`/swap/${postId}/save`);
    return data;
};

/**
 * POST /swap/:postId/unsave
 */
export const unsaveSwapPost = async (postId) => {
    const { data } = await API.post(`/swap/${postId}/unsave`);
    return data;
};

/**
 * POST /swap/:postId/comment
 */
export const commentOnPost = async (postId, payload) => {
    const { data } = await API.post(`/swap/${postId}/comment`, payload);
    return data;
};

/**
 * DELETE /swap/:postId/comment/:commentId
 */
export const deleteComment = async ({ postId, commentId }) => {
    const { data } = await API.delete(`/swap/${postId}/comment/${commentId}`);
    return data;
};
