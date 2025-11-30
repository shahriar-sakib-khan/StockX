import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { FaPlus } from "react-icons/fa";

// Components
import { SwapHeader, SwapFeed } from "@/features/community/components";

export default function CommunityPage() {
    const navigate = useNavigate();
    const storeId = useAuthStore((s) => s.currentStore?.id);

    return (
        <div className="flex h-full flex-col bg-gray-50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white shadow-sm">
                <SwapHeader onCreatePost={() => navigate("/community/create")} />
            </div>

            {/* Scrollable Feed Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 pt-6">
                <div className="mx-auto max-w-2xl">
                    {/* Mobile Create Button (Visible only on small screens for quick access) */}
                    <button
                        onClick={() => navigate("/community/create")}
                        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white p-4 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 md:hidden"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <FaPlus />
                        </div>
                        <span className="font-medium">Start a swap request...</span>
                    </button>

                    <SwapFeed storeId={storeId} />
                </div>
            </div>
        </div>
    );
}
