import { ConfirmDialog, Spinner } from "@/components";
import ShopInfoModal from "@/features/shop/components/ShopleInfoModal";
import {
    useAllShops,
    useCreateShop,
    useDeleteShop,
    useUpdateShop,
} from "@/features/shop/hooks/shopHooks";
import { useState } from "react";
import { ShopCard } from "../features";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ShopsPage() {
    const workspaceId = useAuthStore((state) => state.currentWorkspace).id;
    const divisionId = useAuthStore((state) => state.currentDivision).id;
    
    // Fetch: all shops
    const {
        data: shops = [],
        isLoading,
        isError,
        error,
    } = useAllShops(workspaceId, divisionId);

    // useEffect(() => {
    //     console.log(shops);
    // }, [shops]);

    // Shop Mutations: CRUD
    const { mutate: createShop, isLoading: isCreating } = useCreateShop(
        workspaceId,
        divisionId,
    );

    const { mutate: updateShop, isLoading: isUpdating } = useUpdateShop(
        workspaceId,
        divisionId,
    );

    const { mutate: deleteShop } = useDeleteShop(workspaceId, divisionId);

    // Shop States: CRUD
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contactName: "",
        phone: "",
        address: "",
        // image: "",
        // due: "",
    });
    const [editingShop, setEditingShop] = useState(null);
    const [deletingShopId, setDeletingShopId] = useState(null);

    // Shop Handlers: CRUD
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingShop(null);
        setFormData({ name: "", contactName: "", phone: "", address: "" });
        setIsInfoModalOpen(true);
    };

    const openEditModal = (shop) => {
        setEditingShop(shop);
        setFormData({
            name: shop.name,
            contactName: shop.contactName,
            phone: shop.phone,
            address: shop.address,
        });
        setIsInfoModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingShop) {
            // Update shop
            updateShop(
                {
                    shopId: editingShop.id,
                    name: formData.name,
                    contactName: formData.contactName,
                    phone: formData.phone,
                    address: formData.address,
                },
                {
                    onSuccess: () => {
                        setIsInfoModalOpen(false);
                        setEditingShop(null);
                    },
                    onError: (err) =>
                        console.error("Error updating shop:", err),
                },
            );
        } else {
            // Add new shop
            createShop(
                {
                    name: formData.name,
                    contactName: formData.contactName,
                    phone: formData.phone,
                    address: formData.address,
                },
                {
                    onSuccess: () => {
                        // console.log("new shop created successfully", formData);
                        setFormData({
                            name: "",
                            contactName: "",
                            phone: "",
                            address: "",
                        });
                        setIsInfoModalOpen(false);
                    },
                    onError: (err) =>
                        console.error("Error creating shop:", err),
                },
            );
        }
    };

    const handleConfirmDelete = () => {
        if (deletingShopId) {
            deleteShop(deletingShopId, {
                onError: (err) => console.error("Error deleting shop:", err),
            });
        }
        setDeletingShopId(null); // close dialog
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">Shops</h2>
                <button
                    onClick={openAddModal}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Shop <span className="text-xl">+</span>
                </button>
            </div>

            {isLoading ? (
                <Spinner size={32} />
            ) : isError ? (
                <p className="text-red-500">Error: {error.message}</p>
            ) : (
                <div className="mb-10 flex flex-wrap gap-5">
                    {shops.map((shop) => (
                        <ShopCard
                            key={shop.id}
                            shopInfo={{
                                id: shop.id,
                                name: shop.name,
                                contactName: shop.contactName,
                                phone: shop.phone,
                                address: shop.address,
                            }}
                            onDelete={() => setDeletingShopId(shop.id)}
                            onUpdate={() =>
                                openEditModal({
                                    id: shop.id,
                                    name: shop.name,
                                    contactName: shop.contactName,
                                    phone: shop.phone,
                                    address: shop.address,
                                })
                            }
                            // onShowHistory={() => openHistoryModal(shop.id)}
                        />
                    ))}
                </div>
            )}

            {/* <div className="flex flex-wrap gap-5 px-4">
                {shops.map((shop) => (
                    <ShopCard
                        key={shop.id}
                        shopInfo={shop}
                        onDelete={() => onDelete(shop.id)}
                    />
                ))}
            </div> */}

            {/* Modal */}
            {isInfoModalOpen && (
                <ShopInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                    editingShop={editingShop}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                />
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDialog
                isOpen={!!deletingShopId}
                title="Confirm Delete"
                message="Are you sure you want to delete this shop? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingShopId(null)}
            />
        </div>
    );
}
