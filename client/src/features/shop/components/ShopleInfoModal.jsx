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
                    {/* Shop Name */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-600"
                        >
                            Shop Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Shop Name"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Contact Name */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="contactName"
                            className="text-sm font-medium text-gray-600"
                        >
                            Contact Name
                        </label>
                        <input
                            id="contactName"
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            placeholder="Contact Name"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-600"
                        >
                            Phone
                        </label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="address"
                            className="text-sm font-medium text-gray-600"
                        >
                            Address
                        </label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    {/* Due Amount */}
                    {/* <div className="flex items-center gap-3">
                        <label
                            htmlFor="due"
                            className=" text-sm font-medium text-gray-600"
                        >
                            Due Amount
                        </label>
                        <input
                            id="due"
                            type="text"
                            name="due"
                            value={formData.due}
                            onChange={handleChange}
                            placeholder="Due Amount"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div> */}

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
