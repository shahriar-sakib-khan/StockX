import ShopProfile from "./ShopProfile";
import ProfileButton from "./ProfileButton";
import { FaPlus } from "react-icons/fa";

export default function SwapHeader({ onCreatePost }) {
    return (
        <header className="mx-auto flex h-[var(--titlebar-height)] max-w-7xl items-center justify-between px-4 py-2">
            {/* Left: User/Shop Context */}
            <ShopProfile />

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Desktop Create Button */}
                <button
                    onClick={onCreatePost}
                    className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 md:flex"
                >
                    <FaPlus className="text-xs" />
                    Create Post
                </button>

                <ProfileButton />
            </div>
        </header>
    );
}
