import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

import { SwapHeader, SwapFeed } from "@/features/community/components";

export default function CommunityPage() {
    const navigate = useNavigate();
    const storeId = useAuthStore((s) => s.currentStore?.id);

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            <SwapHeader onCreatePost={() => navigate("/community/create")} />

            <div className="px-4">
                <SwapFeed storeId={storeId} />
            </div>
        </div>
    );
}
