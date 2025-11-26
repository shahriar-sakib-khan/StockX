import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import ShopProfile from "@/features/community/components/ShopProfile";
import SwapComposer from "@/features/community/components/SwapComposer";
import { useCreateSwapPost } from "@/features/community/hooks";

export default function CreateSwapPostPage() {
    const navigate = useNavigate();
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const createPost = useCreateSwapPost(storeId);

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <ShopProfile />
                <button
                    onClick={() => navigate(-1)}
                    className="rounded border px-4 py-1 text-gray-600 hover:bg-gray-100"
                >
                    Back
                </button>
            </div>

            <div className="px-4">
                <SwapComposer
                    onSubmit={async (payload) => {
                        await createPost.mutateAsync(payload);
                        navigate("/community");
                    }}
                />
            </div>
        </div>
    );
}
