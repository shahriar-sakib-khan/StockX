import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/community/my-posts")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
            title="My Swap History"
        >
            <FaUserCircle className="text-lg text-gray-400" />
            <span className="hidden sm:inline">My Activity</span>
        </button>
    );
}
