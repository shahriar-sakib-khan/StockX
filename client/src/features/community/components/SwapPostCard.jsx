import { LuArrowLeftRight } from "react-icons/lu";
import { FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import CylinderItemCard from "./CylinderItemCard";

import {
    useLikePost,
    useUnlikePost,
    useSavePost,
    useUnsavePost,
} from "@/features/community/hooks/useSwapPostActions";

export default function SwapPostCard({ post, onPerformSwap }) {
    const isGive = post.postType === "give";
    const isTake = post.postType === "take";
    const isBoth = post.postType === "both";

    // 🔥 Hooks
    const likePost = useLikePost();
    const unlikePost = useUnlikePost();
    const savePost = useSavePost();
    const unsavePost = useUnsavePost();

    // 🔥 Actions
    const handleLike = () => {
        if (post?.isLiked) unlikePost.mutate(post._id);
        else likePost.mutate(post._id);
    };

    const handleSave = () => {
        if (post?.isSaved) unsavePost.mutate(post._id);
        else savePost.mutate(post._id);
    };

    return (
        <div className="flex flex-col rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-gray-200">
            {/* Header */}
            <header className="flex items-center justify-between bg-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                    {post.storeImage ? (
                        <img
                            src={post.storeImage}
                            alt={post.storeName}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-bold text-white">
                            {post.storeName?.charAt(0) ?? "S"}
                        </div>
                    )}

                    <div className="min-w-0">
                        <div className="truncate font-semibold text-gray-800">
                            {post.storeName}
                        </div>
                        <div className="text-xs text-gray-500">
                            {post.storeOwnerName
                                ? `${post.storeOwnerName} · `
                                : ""}
                            {post.phone ?? "—"}
                        </div>
                    </div>
                </div>

                <LuArrowLeftRight className="text-blue-600" />
            </header>

            {/* Posted time */}
            <div className="px-4 py-2 text-xs text-gray-500">
                Posted: {new Date(post.createdAt).toLocaleString()}
            </div>

            {/* Offer (giving) */}
            {(isGive || isBoth) && (
                <section className="px-4 py-2">
                    <h4 className="font-medium text-green-700">Offering</h4>
                    <div className="mt-2 flex flex-wrap gap-3">
                        {(post.offer || []).map((c, i) => (
                            <CylinderItemCard
                                key={i}
                                item={c}
                                variant="offer"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Demand (looking for) */}
            {(isTake || isBoth) && (
                <section className="px-4 py-2">
                    <h4 className="font-medium text-red-700">Looking For</h4>
                    <div className="mt-2 flex flex-wrap gap-3">
                        {(post.take || []).map((c, i) => (
                            <CylinderItemCard key={i} item={c} variant="take" />
                        ))}
                    </div>
                </section>
            )}

            {/* description */}
            {post.description && (
                <div className="px-4 py-2 text-sm text-gray-600">
                    {post.description}
                </div>
            )}

            {/* actions */}
            <footer className="mt-4 mb-4 flex items-center justify-between px-6">
                {/* Swap */}
                <div>
                    <button
                        onClick={() => onPerformSwap && onPerformSwap(post)}
                        className="primary-button px-3 py-1"
                    >
                        Swap
                    </button>
                </div>

                {/* Like / Comment / Save */}
                <div className="flex items-center gap-5 text-lg text-gray-500">
                    {/* LIKE */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
                    >
                        <FaHeart
                            className={post?.isLiked ? "text-red-500" : ""}
                        />
                        <span className="hidden sm:inline">
                            {post?.isLiked ? "Unlike" : "Like"}
                        </span>
                    </button>

                    {/* COMMENT */}
                    <button
                        onClick={() => console.log("open comment UI")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500"
                    >
                        <FaRegCommentDots />
                        <span className="hidden sm:inline">Comment</span>
                    </button>

                    {/* SAVE */}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-yellow-500"
                    >
                        <FaBookmark
                            className={post?.isSaved ? "text-yellow-500" : ""}
                        />
                        <span className="hidden sm:inline">
                            {post?.isSaved ? "Unsave" : "Save"}
                        </span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
