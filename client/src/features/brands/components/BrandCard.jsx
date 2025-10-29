export default function BrandCard({ brand, isActive, changed, onToggle }) {
    return (
        <div
            onClick={() => onToggle(brand.id)}
            className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-150 active:scale-[0.99] ${
                isActive
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
            }`}
        >
            <div className="flex h-20 w-full items-center justify-center bg-white">
                <img
                    src={brand.brandImage}
                    alt={brand.name}
                    className="max-h-12 max-w-[70%] object-contain transition-transform duration-200 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="w-full truncate text-sm font-semibold text-gray-800">
                    {brand.name}
                </span>
            </div>

            {changed && (
                <div
                    className={`absolute top-2 right-2 rounded-full p-1.5 shadow-md transition-all ${
                        isActive ? "bg-emerald-500" : "bg-emerald-500"
                    }`}
                >
                    {isActive ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="white"
                            className="h-3.5 w-3.5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.704 5.29a1 1 0 010 1.42l-7.42 7.42a1 1 0 01-1.42 0L3.296 9.546a1 1 0 011.408-1.42l3.58 3.58 6.716-6.716a1 1 0 011.42 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5"
                        >
                            <path d="M6.225 4.811a1 1 0 011.414 0L10 7.172l2.361-2.361a1 1 0 111.414 1.414L11.414 8.586l2.361 2.361a1 1 0 11-1.414 1.414L10 10l-2.361 2.361a1 1 0 11-1.414-1.414L8.586 8.586 6.225 6.225a1 1 0 010-1.414z" />
                        </svg>
                    )}
                </div>
            )}
        </div>
    );
}
