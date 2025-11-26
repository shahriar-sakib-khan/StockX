import { useAuthStore } from "@/stores/useAuthStore";
import ShopProfile from "@/features/community/components/ShopProfile";
import SwapPostCard from "@/features/community/components/SwapPostCard";
import { useFetchSwapPosts } from "@/features/community/hooks";

export default function MyPostsPage() {
    const userId = useAuthStore((s) => s.user?.id);
    const storeId = useAuthStore((s) => s.currentStore?.id);

    const { data: posts = [], isLoading } = useFetchSwapPosts(storeId);

    const myPosts = posts.filter(
        (p) => p.createdBy === userId || p.storeId === storeId,
    );

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <ShopProfile />
            </div>

            <h3 className="px-4 text-lg font-semibold text-gray-600">
                My Swap Posts
            </h3>

            {isLoading && <div className="px-4 text-gray-500">Loading...</div>}

            {myPosts.length === 0 && !isLoading && (
                <div className="px-4 text-center text-gray-500">
                    You haven't created any posts yet.
                </div>
            )}

            <div className="mb-10 flex flex-col gap-4 px-4">
                {myPosts.map((post) => (
                    <SwapPostCard key={post._id ?? post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
