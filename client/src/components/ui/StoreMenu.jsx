// src/components/sidebar/StoreMenu.jsx
import { useNavigate } from "react-router-dom";
import { MdExpandMore as ExpandIcon } from "react-icons/md";
import { IoAdd as AddIcon } from "react-icons/io5";
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { pagesConfig } from "../../pages/utils/pagesConfig";
import MenuContainer from "./MenuContainer";
import { useEffect } from "react";

export default function StoreMenu() {
    const navigate = useNavigate();

    // ui store
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const isStoreMenuOpen = useUIStore((state) => state.isStoreMenuOpen);
    const toggleMenu = useUIStore((state) => state.toggleMenu);
    const setMenuState = useUIStore((state) => state.setMenuState);

    // auth store
    const currentStore = useAuthStore((state) => state.currentStore);
    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);
    const allStores = useAuthStore((state) => state.allStores) || [];

    const MembersIcon = pagesConfig["/members"]?.icon;
    const SettingsIcon = pagesConfig["/settings"]?.icon;

    const closeMenu = () => setMenuState("isStoreMenuOpen", false);

    const MenuButton = ({ icon: Icon, label, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center rounded-sm px-2 py-1 text-start hover:bg-gray-100"
        >
            {Icon && <Icon className="mr-2 text-lg" />}
            {label}
        </button>
    );

    return (
        <MenuContainer
            isOpen={isStoreMenuOpen}
            onClose={closeMenu}
            trigger={
                <button
                    onClick={() => toggleMenu("isStoreMenuOpen")}
                    className={`relative flex items-center justify-start overflow-hidden rounded py-1 text-left text-nowrap transition-all hover:bg-gray-200 ${
                        isSidebarOpen ? "grow-1" : "w-0"
                    }`}
                >
                    <span className="mr-2 rounded bg-gray-300 p-2"></span>
                    <h2 className="inline font-semibold">
                        {currentStore?.name || "Select Store"}
                    </h2>
                    <ExpandIcon
                        className={`rotate-0 text-xl transition-all ${
                            isStoreMenuOpen && "rotate-180"
                        }`}
                    />
                </button>
            }
        >
            {/* Current Store Info */}
            {currentStore && (
                <section className="flex min-w-50 gap-2 border-b border-gray-300 p-2">
                    <span className="rounded bg-gray-300 p-5"></span>
                    <div className="flex flex-col gap-0">
                        <span className="text-base font-semibold text-gray-700">
                            {currentStore.name}
                        </span>
                        <span className="text-xs text-gray-600">
                            {currentStore.location}
                        </span>
                    </div>
                </section>
            )}

            {/* Members & Settings */}
            <section className="flex flex-col p-2 text-gray-600">
                <MenuButton
                    icon={MembersIcon}
                    label="Members"
                    onClick={() => {
                        navigate("/members");
                        closeMenu();
                    }}
                />
                <MenuButton
                    icon={SettingsIcon}
                    label="Settings"
                    onClick={() => {
                        navigate("/settings");
                        closeMenu();
                    }}
                />
            </section>

            {/* List of all stores */}
            {allStores.length > 0 && (
                <section className="flex flex-col border-t border-gray-200 p-2 text-gray-600">
                    <span className="mb-1 text-xs text-gray-500">Stores</span>
                    <div className="flex flex-col gap-1">
                        {allStores.map((store) => (
                            <button
                                key={store.id}
                                className={`rounded-sm px-2 py-1 text-start hover:bg-gray-100 ${
                                    currentStore?.id === store.id
                                        ? "bg-gray-200 font-semibold"
                                        : ""
                                }`}
                                onClick={() => {
                                    setCurrentStore(store);
                                    closeMenu();
                                }}
                            >
                                {store.name}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Create Store */}
            <section className="flex flex-col border-t border-gray-300 p-2 text-gray-600">
                <button
                    onClick={() => navigate("/addStore", { replace: true })}
                    className="flex items-center rounded-sm px-2 py-1 text-start hover:bg-gray-100"
                >
                    <AddIcon className="mr-2 size-7 rounded bg-gray-100 p-1 text-lg" />
                    Add Store
                </button>
            </section>
        </MenuContainer>
    );
}
