import ShopProfile from "./ShopProfile";
import ProfileButton from "./ProfileButton";

export default function SwapHeader({ onCreatePost }) {
    return (
        <div className="flex items-center justify-between px-4">
            <ShopProfile />

            <div className="flex items-center gap-3">
                <button
                    onClick={onCreatePost}
                    className="primary-button px-4 py-1"
                >
                    Create Post
                </button>

                <ProfileButton />
            </div>
        </div>
    );
}
