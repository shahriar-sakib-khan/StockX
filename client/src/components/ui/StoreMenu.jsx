import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { MdExpandMore as ExpandIcon } from "react-icons/md";
import { IoAdd as AddIcon } from "react-icons/io5";
import { FaStore, FaCheck } from "react-icons/fa";

// Stores & Config
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { pagesConfig } from "../../pages/utils/pagesConfig";
import MenuContainer from "../mini/MenuContainer";

export default function StoreMenu() {
    const navigate = useNavigate();

    // UI Store
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const isStoreMenuOpen = useUIStore((state) => state.isStoreMenuOpen);
    const toggleMenu = useUIStore((state) => state.toggleMenu);
    const setMenuState = useUIStore((state) => state.setMenuState);

    // Auth Store
    const currentStore = useAuthStore((state) => state.currentStore);
    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);
    const allStores = useAuthStore((state) => state.allStores) || [];

    // Icon Config
    const MembersIcon = pagesConfig["/members"]?.icon;
    const SettingsIcon = pagesConfig["/settings"]?.icon;

    const closeMenu = () => setMenuState("isStoreMenuOpen", false);

    // Helper for Menu Items
    const MenuButton = ({ icon: Icon, label, onClick, active = false }) => (
        <button
            onClick={onClick}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                active
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon className={`text-lg ${active ? "text-indigo-600" : "text-gray-500"}`} />}
                <span>{label}</span>
            </div>
            {active && <FaCheck className="text-indigo-600 text-xs" />}
        </button>
    );

    // Helper for Avatar (Consistent look in Trigger & Menu)
    const StoreAvatar = ({ name, size = "md" }) => {
        const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-9 w-9 text-sm";
        return (
            <div className={`${sizeClasses} flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-sm`}>
                {name ? name.substring(0, 1).toUpperCase() : <FaStore />}
            </div>
        );
    };

    return (
        <MenuContainer
            isOpen={isStoreMenuOpen}
            onClose={closeMenu}
            menuPosition="left-0 top-12 w-64" // Fixed width for dropdown
            trigger={
                <button
                    onClick={() => toggleMenu("isStoreMenuOpen")}
                    className={`group relative flex w-full items-center rounded-lg border border-transparent p-1.5 transition-all hover:bg-gray-100 ${
                        isSidebarOpen ? "justify-start" : "justify-center"
                    }`}
                    title={currentStore?.name || "Select Store"}
                >
                    {/* Avatar - Always Visible */}
                    <StoreAvatar name={currentStore?.name} />

                    {/* Text Info - Hidden when Sidebar Collapsed */}
                    <div
                        className={`flex flex-col text-left transition-all duration-300 ${
                            isSidebarOpen
                                ? "ml-3 w-auto opacity-100"
                                : "w-0 overflow-hidden opacity-0"
                        }`}
                    >
                        <span className="truncate text-sm font-semibold text-gray-800">
                            {currentStore?.name || "Select Store"}
                        </span>
                        <span className="truncate text-xs text-gray-500">
                            {currentStore?.location || "No location set"}
                        </span>
                    </div>

                    {/* Dropdown Chevron */}
                    {isSidebarOpen && (
                        <ExpandIcon
                            className={`ml-auto text-xl text-gray-400 transition-transform duration-200 ${
                                isStoreMenuOpen ? "rotate-180" : "rotate-0"
                            }`}
                        />
                    )}
                </button>
            }
        >
            {/* --- Menu Content --- */}

            {/* Header: Current Store Context */}
            {currentStore && (
                <div className="border-b border-gray-100 bg-gray-50/50 p-3">
                    <div className="flex items-center gap-3">
                        <StoreAvatar name={currentStore.name} size="sm" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-bold text-gray-900">
                                {currentStore.name}
                            </span>
                            <span className="truncate text-xs text-gray-500">
                                {currentStore.location}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Store Navigation (Members/Settings) */}
            <div className="p-2">
                <MenuButton
                    icon={MembersIcon}
                    label="Manage Members"
                    onClick={() => {
                        navigate("/members");
                        closeMenu();
                    }}
                />
                <MenuButton
                    icon={SettingsIcon}
                    label="Store Settings"
                    onClick={() => {
                        navigate("/settings");
                        closeMenu();
                    }}
                />
            </div>

            {/* Switch Store List */}
            {allStores.length > 0 && (
                <div className="border-t border-gray-100 p-2">
                    <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Switch Store
                    </div>
                    <div className="flex max-h-48 flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {allStores.map((store) => (
                            <MenuButton
                                key={store.id}
                                label={store.name}
                                // Use a simple dot for the icon in list
                                icon={() => (
                                    <div className={`h-2 w-2 rounded-full ${currentStore?.id === store.id ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                                )}
                                active={currentStore?.id === store.id}
                                onClick={() => {
                                    setCurrentStore(store);
                                    closeMenu();
                                    navigate("/dashboard"); // Redirect to dashboard on switch
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Create New Store Action */}
            <div className="border-t border-gray-100 p-2">
                <button
                    onClick={() => navigate("/addStore", { replace: true })}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200 text-gray-600">
                        <AddIcon className="text-sm" />
                    </div>
                    <span>Create or Join Store</span>
                </button>
            </div>
        </MenuContainer>
    );
}
