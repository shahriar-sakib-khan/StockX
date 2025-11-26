import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

export default function ProfileButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/community/my-posts")}
            className="primary-button flex items-center gap-3 px-3 py-1"
        >
            <CgProfile className="text-xl" />
            <span className="text-sm font-medium">My Posts</span>
        </button>
    );
}
