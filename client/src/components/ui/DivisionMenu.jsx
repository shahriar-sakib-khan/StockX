import { useNavigate } from "react-router-dom";
import { MdExpandMore as ExpandIcon } from "react-icons/md";
import { IoAdd as AddIcon } from "react-icons/io5";
import { useUIStore } from "../../stores/useUIStore";
import { pagesConfig } from "../../pages/utils/pagesConfig";
import MenuContainer from "./MenuContainer";

export default function DivisionMenu() {
    const navigate = useNavigate();
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const isDivisionMenuOpen = useUIStore((state) => state.isDivisionMenuOpen);
    const toggleMenu = useUIStore((state) => state.toggleMenu);
    const setMenuState = useUIStore((state) => state.setMenuState);

    const currentDivision = "My Division";
    const currentDivisionMoto = "Hi there";

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
                    <h2 className="inline font-semibold">{currentDivision}</h2>
                    <ExpandIcon
                        className={`rotate-0 text-xl transition-all ${isDivisionMenuOpen && "rotate-180"}`}
                    />
                </button>
            }
        >
            <section className="flex min-w-50 gap-2 border-b border-gray-300 p-2">
                <span className="rounded bg-gray-300 p-5"></span>
                <div className="flex flex-col gap-0">
                    <span className="text-base font-semibold text-gray-700">
                        {currentDivision}
                    </span>
                    <span className="text-xs text-gray-600">
                        {currentDivisionMoto}
                    </span>
                </div>
            </section>
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
            <section className="flex flex-col border-t border-gray-300 p-2 text-gray-600">
                <button className="flex items-center rounded-sm px-2 py-1 text-start hover:bg-gray-100">
                    <AddIcon className="mr-2 size-7 rounded bg-gray-100 p-1 text-lg" />{" "}
                    Create Division
                </button>
            </section>
        </MenuContainer>
    );
}
