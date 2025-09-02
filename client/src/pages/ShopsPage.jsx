import { useState } from "react";
import { ShopCard } from "../features";

export default function ShopsPage() {
    const [shops, setShops] = useState([
        {
            id: 1,
            name: "Auto Parts Ltd",
            contactName: "Rahim",
            phone: "01711-123456",
            address: "Dhaka, Bangladesh",
        },
        {
            id: 2,
            name: "Motor World",
            contactName: "Karim",
            phone: "01722-654321",
            address: "Chittagong, Bangladesh",
        },
    ]);

    const onDelete = (id) => {
        setShops((prev) => prev.filter((shop) => shop.id !== id));
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">Shops</h2>
                <button
                    className="primary-button flex items-center gap-3 px-3 py-1"
                    onClick={() =>
                        setShops((prev) => [
                            ...prev,
                            {
                                id: Date.now(),
                                name: "New Shop",
                                contactName: "New Contact",
                                phone: "0000",
                                address: "Unknown",
                            },
                        ])
                    }
                >
                    Add Shop <span className="text-xl">+</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-5 px-4">
                {shops.map((shop) => (
                    <ShopCard
                        key={shop.id}
                        shopInfo={shop}
                        onDelete={() => onDelete(shop.id)}
                    />
                ))}
            </div>
        </div>
    );
}
