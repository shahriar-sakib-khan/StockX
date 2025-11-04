import { useState } from "react";

export default function ShopSelector({ shops, selectedShop, setSelectedShop }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative mb-8 flex justify-center">
            <div className="relative">
                <button
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-lg font-medium text-gray-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span>
                        {selectedShop ? selectedShop.name : "Select Shop"}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                            dropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute top-full left-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
                        {shops.map((shop) => (
                            <button
                                key={shop.id}
                                className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-blue-50"
                                onClick={() => {
                                    setSelectedShop(shop);
                                    setDropdownOpen(false);
                                }}
                            >
                                <img
                                    src={shop.image}
                                    alt={shop.name}
                                    className="h-8 w-8 rounded-md object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {shop.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {shop.location}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
