import { useState } from "react";
import {
    FaHeart, FaRegHeart, FaCommentDots,
    FaExchangeAlt, FaPhoneAlt, FaStore
} from "react-icons/fa";
import CylinderItemCard from "./CylinderItemCard";

import {
    useLikePost,
    useUnlikePost,
    useSavePost,
    useUnsavePost,
} from "@/features/community/hooks/useSwapPostActions";

// Time Ago Helper
const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (days > 7) return date.toLocaleDateString();
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor((now - date) / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
};

export default function SwapPostCard({ post, onPerformSwap }) {
    const isGive = post.postType === "give";
    const isTake = post.postType === "take";
    const isBoth = post.postType === "both";

    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);

    const likePost = useLikePost();
    const unlikePost = useUnlikePost();

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        if (isLiked) unlikePost.mutate(post._id);
        else likePost.mutate(post._id);
    };

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md">

            {/* --- Header --- */}
            <div className="flex items-center justify-between bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                    {/* Larger Avatar */}
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white shadow-sm">
                        {post.storeImage ? (
                            <img
                                src={post.storeImage}
                                alt={post.storeName}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <FaStore className="text-xl text-gray-400" />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {post.storeName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <span>{post.location || "Dhaka"}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {post.phone && (
                    <a
                        href={`tel:${post.phone}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100"
                    >
                        <FaPhoneAlt size={14} />
                    </a>
                )}
            </div>

            {/* --- Description --- */}
            {post.description && (
                <div className="px-5 pb-4 text-sm font-medium text-gray-700 leading-relaxed">
                    {post.description}
                </div>
            )}

            {/* --- Swap Content (Full Width Blocks) --- */}
            <div className="flex flex-col border-t border-gray-100 sm:flex-row">

                {/* GIVING ZONE */}
                {(isGive || isBoth) && (
                    <div className="flex-1 bg-emerald-50/50 p-4 sm:border-r sm:border-emerald-100">
                        <div className="mb-3 flex items-center justify-between">
                            <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-[10px]">↓</span>
                                Offering
                            </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
                            {(post.offer || []).map((c, i) => (
                                <CylinderItemCard key={i} item={c} variant="offer" />
                            ))}
                        </div>
                    </div>
                )}

                {/* TAKING ZONE */}
                {(isTake || isBoth) && (
                    <div className="flex-1 bg-red-50/50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-800">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-200 text-[10px]">↑</span>
                                Seeking
                            </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
                            {(post.take || []).map((c, i) => (
                                <CylinderItemCard key={i} item={c} variant="take" />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Footer --- */}
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <div className="flex gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                            isLiked ? "text-rose-600" : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {isLiked ? <FaHeart /> : <FaRegHeart className="text-lg" />}
                        <span>{likeCount || "Like"}</span>
                    </button>

                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                        <FaCommentDots className="text-lg" />
                        <span>Comment</span>
                    </button>
                </div>

                <button
                    onClick={() => onPerformSwap && onPerformSwap(post)}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                    <FaExchangeAlt />
                    <span>Swap</span>
                </button>
            </div>
        </article>
    );
}
