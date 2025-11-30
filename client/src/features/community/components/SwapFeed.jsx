import { useFetchSwapPosts, usePerformSwap } from "@/features/community/hooks";
import SwapPostCard from "./SwapPostCard";
import { FaInbox } from "react-icons/fa";

export default function SwapFeed({ storeId }) {
    const { data: posts = [], isLoading } = useFetchSwapPosts(storeId);
    const performSwap = usePerformSwap(storeId);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 w-full animate-pulse rounded-xl bg-white shadow-sm" />
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-center text-gray-400">
                <FaInbox className="mb-3 text-4xl text-gray-300" />
                <p>No swap requests available.</p>
                <p className="text-sm">Be the first to create one!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {posts.map((post) => (
                <SwapPostCard
                    key={post._id ?? post.id}
                    post={post}
                    onPerformSwap={(p) => performSwap.mutate(p)}
                />
            ))}
        </div>
    );
}
