import { ModalContainer } from "@/components";

export default function VehicleInfoModal({
    isOpen,
    onClose,
    editingVehicle,
    formData,
    handleChange,
    handleSubmit,
    isCreating,
    isUpdating,
}) {
    return (
        <ModalContainer
            backdropColor="bg-black/50"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-600">
                    {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="brand"
                            className="text-sm font-medium text-gray-600"
                        >
                            Brand
                        </label>
                        <input
                            id="brand"
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Brand"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Model */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="model"
                            className="text-sm font-medium text-gray-600"
                        >
                            Model
                        </label>
                        <input
                            id="model"
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="Model"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Registration No */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="regNo"
                            className="text-sm font-medium text-gray-600"
                        >
                            Registration No
                        </label>
                        <input
                            id="regNo"
                            type="text"
                            name="regNo"
                            value={formData.regNo}
                            onChange={handleChange}
                            placeholder="Registration No"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            {editingVehicle
                                ? isUpdating
                                    ? "Updating..."
                                    : "Update"
                                : isCreating
                                  ? "Adding..."
                                  : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}
