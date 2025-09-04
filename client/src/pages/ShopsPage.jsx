import { useState } from "react";
import { ShopCard } from "../features";

export default function ShopsPage() {
    const [shops, setShops] = useState([
        {
            id: 1,
            name: "Auto Parts Ltd",
            contactName: "Rahim",
            phone: "01711-123456",
            address: "Dhaka",
            due: "12,000",
        },
        {
            id: 2,
            name: "Motor World",
            contactName: "Karim",
            phone: "01722-654321",
            address: "Chittagong",
            due: "0",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contactName: "",
        phone: "",
        address: "",
        due: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newShop = {
            id: Date.now(),
            ...formData,
        };
        setShops((prev) => [...prev, newShop]);
        setFormData({
            name: "",
            contactName: "",
            phone: "",
            address: "",
            due: "",
        });
        setIsModalOpen(false);
    };

    const onDelete = (id) => {
        setShops((prev) => prev.filter((shop) => shop.id !== id));
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">Shops</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="primary-button flex items-center gap-3 px-3 py-1"
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-600">
                            Add New Shop
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Shop Name"
                                className="rounded border border-gray-300 px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                placeholder="Contact Name"
                                className="rounded border border-gray-300 px-3 py-2"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="rounded border border-gray-300 px-3 py-2"
                            />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="rounded border border-gray-300 px-3 py-2"
                            />
                            <input
                                type="text"
                                name="due"
                                value={formData.due}
                                onChange={handleChange}
                                placeholder="Due Amount"
                                className="rounded border border-gray-300 px-3 py-2"
                            />

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
