import { ModalContainer } from "@/components";

export default function ShopInfoModal({
    isOpen,
    onClose,
    editingShop,
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
                    {editingShop ? "Edit Shop" : "Add New Shop"}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="shopName"
                            className="text-sm font-medium text-gray-600"
                        >
                            Shop Name
                        </label>
                        <input
                            id="shopName"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            placeholder="Shop Name"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="ownerName"
                            className="text-sm font-medium text-gray-600"
                        >
                            Owner Name
                        </label>
                        <input
                            id="ownerName"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder="Owner Name"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="phoneNumber"
                            className="text-sm font-medium text-gray-600"
                        >
                            Phone Number
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="location"
                            className="text-sm font-medium text-gray-600"
                        >
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* <div className="flex items-center gap-3">
                        <label
                            htmlFor="image"
                            className="text-sm font-medium text-gray-600"
                        >
                            Image URL
                        </label>
                        <input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Image URL (optional)"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div> */}

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
                            {editingShop
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
