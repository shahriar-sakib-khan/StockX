import { NavLink } from "react-router-dom";

export default function QuickActionCard({
    path = "",
    imgSrc = "",
    title = "",
}) {
    return (
        <NavLink
            to={path}
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md active:scale-95"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <img src={imgSrc} alt={title} className="h-6 w-6 object-contain" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">
                {title}
            </span>
        </NavLink>
    );
}
