import { useNavigate } from "react-router-dom";
import { MdExpandMore as ExpandIcon } from "react-icons/md";
import { IoAdd as AddIcon } from "react-icons/io5";
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore"; // ✅ import auth store
import { pagesConfig } from "../../pages/utils/pagesConfig";
import MenuContainer from "./MenuContainer";
import { logOnce } from "../../pages/utils/logOnce";
import { useEffect } from "react";


export default function DivisionMenu() {
    const navigate = useNavigate();

    // ui store
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const isDivisionMenuOpen = useUIStore((state) => state.isDivisionMenuOpen);
    const toggleMenu = useUIStore((state) => state.toggleMenu);
    const setMenuState = useUIStore((state) => state.setMenuState);

    // auth store
    const currentDivision = useAuthStore((state) => state.currentDivision);
    const setCurrentDivision = useAuthStore((state) => state.setDivision);
    const divisions = useAuthStore((state) => state.currentDivisions) || []; // ✅ all divisions of workspace
    // Logging safely in useEffect to avoid double logs in React 18 Strict Mode
    useEffect(() => {
        logOnce("Current divisions are: ",divisions)
    }, [divisions]);

    const MembersIcon = pagesConfig["/members"]?.icon;
    const SettingsIcon = pagesConfig["/settings"]?.icon;

    const closeMenu = () => setMenuState("isDivisionMenuOpen", false);

    const MenuButton = ({ icon: Icon, label, onClick }) => {
        return (
            <button
                onClick={onClick}
                className="flex items-center rounded-sm px-2 py-1 text-start hover:bg-gray-100"
            >
                {Icon && <Icon className="mr-2 text-lg" />}
                {label}
            </button>
        );
    };

    return (
        <MenuContainer
            isOpen={isDivisionMenuOpen}
            onClose={closeMenu}
            trigger={
                <button
                    onClick={() => toggleMenu("isDivisionMenuOpen")}
                    className={`relative flex items-center justify-start overflow-hidden rounded py-1 text-left text-nowrap transition-all hover:bg-gray-200 ${
                        isSidebarOpen ? "grow-1" : "w-0"
                    }`}
                >
                    <span className="mr-2 rounded bg-gray-300 p-2"></span>
                    <h2 className="inline font-semibold">
                        {currentDivision?.name || "Select Division"}
                    </h2>
                    <ExpandIcon
                        className={`rotate-0 text-xl transition-all ${
                            isDivisionMenuOpen && "rotate-180"
                        }`}
                    />
                </button>
            }
        >
            {/* Current Division Info */}
            {currentDivision && (
                <section className="flex min-w-50 gap-2 border-b border-gray-300 p-2">
                    <span className="rounded bg-gray-300 p-5"></span>
                    <div className="flex flex-col gap-0">
                        <span className="text-base font-semibold text-gray-700">
                            {currentDivision.name}
                        </span>
                        <span className="text-xs text-gray-600">
                            {currentDivision.description}
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

            {/* List of all divisions */}
            {divisions.length > 0 && (
                <section className="flex flex-col border-t border-gray-200 p-2 text-gray-600">
                    <span className="mb-1 text-xs text-gray-500">
                        Divisions
                    </span>
                    <div className="flex flex-col gap-1">
                        {divisions.map((division) => (
                            <button
                                key={division.id}
                                className={`rounded-sm px-2 py-1 text-start hover:bg-gray-100 ${
                                    currentDivision?.id === division.id
                                        ? "bg-gray-200 font-semibold"
                                        : ""
                                }`}
                                onClick={() => {
                                    setCurrentDivision(division); // ✅ update authStore
                                    closeMenu();
                                }}
                            >
                                {division.name}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Create Division */}
            <section className="flex flex-col border-t border-gray-300 p-2 text-gray-600">
                <button onClick={(e) => {navigate("/createDivision", {replace:true})}} className="flex items-center rounded-sm px-2 py-1 text-start hover:bg-gray-100">
                    <AddIcon className="mr-2 size-7 rounded bg-gray-100 p-1 text-lg" />
                    Create Division
                </button>
            </section>
        </MenuContainer>
    );
}
