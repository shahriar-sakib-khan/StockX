import { useFetchSwapPosts, usePerformSwap } from "@/features/community/hooks";
import { SwapPostCard } from "./index";

export default function SwapFeed({ storeId }) {
    const { data: posts = [], isLoading } = useFetchSwapPosts(storeId);
    const performSwap = usePerformSwap(storeId);

    return (
        <div>
            <h3 className="px-4 text-lg font-semibold text-gray-600">
                Community Swap Posts
            </h3>

            {isLoading && (
                <div className="px-4 text-gray-500">Loading posts...</div>
            )}

            <div className="mb-10 flex flex-col gap-4 px-4">
                {posts.map((post) => (
                    <SwapPostCard
                        key={post._id ?? post.id}
                        post={post}
                        onPerformSwap={(p) => performSwap.mutate(p)}
                    />
                ))}
            </div>
        </div>
    );
}
