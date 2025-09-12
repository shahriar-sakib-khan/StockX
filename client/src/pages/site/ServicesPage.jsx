import { useState } from "react";
import { Plus } from "lucide-react"; // icon library

function ServicePage() {
    const [services, setServices] = useState([
        {
            id: 1,
            name: "Daily Sales Management",
            description:
                "Track and manage your daily sales with our powerful tools. Get real-time insights into your business.",
            icon: "🛒",
        },
        {
            id: 2,
            name: "LPG Community",
            description:
                "Connect with other LPG providers and customers in our community. Share best practices and grow together.",
            icon: "👥",
        },
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", icon: "🛠️" });

    const handleAddService = () => {
        setServices([...services, { ...form, id: Date.now() }]);
        setForm({ name: "", description: "", icon: "🛠️" });
        setIsOpen(false);
    };

    return (
        <div className="p-8">
            {/* Page Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Our Services</h1>
                <p className="text-gray-600">
                    Everything you need to manage your LPG business efficiently
                    and effectively.
                </p>
            </div>

            {/* Add Service Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="mb-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <Plus size={18} /> Add Service
            </button>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
                    >
                        <div className="mb-3 text-3xl">{service.icon}</div>
                        <h3 className="text-lg font-semibold">
                            {service.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Popup Form */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold">
                            Add New Service
                        </h2>

                        <input
                            type="text"
                            placeholder="Service Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="mb-3 w-full rounded-lg border px-3 py-2"
                        />

                        <textarea
                            placeholder="Service Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="mb-3 w-full rounded-lg border px-3 py-2"
                        />

                        <input
                            type="text"
                            placeholder="Icon (emoji or symbol)"
                            value={form.icon}
                            onChange={(e) =>
                                setForm({ ...form, icon: e.target.value })
                            }
                            className="mb-3 w-full rounded-lg border px-3 py-2"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddService}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServicePage;
