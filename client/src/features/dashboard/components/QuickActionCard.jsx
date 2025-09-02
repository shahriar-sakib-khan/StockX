import { NavLink } from "react-router-dom";

export default function QuickActionCard({
    path = "",
    imgSrc = "",
    title = "",
}) {
    return (
        <NavLink
            to={path}
            className="flex flex-col items-center justify-center gap-2 rounded-md bg-gray-200/70 p-4 font-bold text-gray-600 decoration-0"
        >
            <img src={imgSrc} alt="" className="max-w-16" />
            <span>{title}</span>
        </NavLink>
    );
}
