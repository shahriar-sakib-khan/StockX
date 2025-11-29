import { useLocation } from "react-router-dom";
import { pagesConfig } from "../../pages/utils/pagesConfig";

export default function Titlebar() {
    const location = useLocation();
    const config = pagesConfig[location.pathname];

    const title = config?.title || "Overview";
    const PageIconComponent = config?.icon;

    return (
        <section className="sticky top-0 z-20 flex min-h-[var(--titlebar-height)] items-center border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-3 text-gray-700">
                {PageIconComponent && (
                    <span className="flex items-center justify-center rounded bg-indigo-50 p-1.5 text-indigo-600">
                        <PageIconComponent className="text-lg" />
                    </span>
                )}
                <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                    {title}
                </h1>
            </div>
        </section>
    );
}
