import { useMutation } from "@tanstack/react-query";
import { FiLogOut as LogoutIcon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import pfp from "../../assets/images/user_icon.jpeg";
import { logout } from "../../features/authentication/services/authServices";
import useAuth from "../../hooks/useAuth";
import { pagesConfig } from "../../pages/utils/pagesConfig";
import queryClient from "../../services/queryClient";
import { useUIStore } from "../../stores/useUIStore";
import MenuContainer from "./MenuContainer";

export default function UserMenu() {
  const navigate = useNavigate();
  const isUserMenuOpen = useUIStore((state) => state.isUserMenuOpen);
  const setMenuState = useUIStore((state) => state.setMenuState);
  const toggleMenu = useUIStore((state) => state.toggleMenu);

  const { data } = useAuth();
  const { email, firstName, lastName } = data?.user || {};

  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName
        ? firstName
        : lastName
          ? `Dear ${lastName}`
          : "Dear visitor";

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });

  const closeMenu = () => setMenuState("isUserMenuOpen", false);

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

  const ProfileIcon = pagesConfig["/profile"]?.icon;
  const SettingsIcon = pagesConfig["/settings"]?.icon;

  return (
    <MenuContainer
      isOpen={isUserMenuOpen}
      onClose={closeMenu}
      menuPosition="right-2 mt-2"
      trigger={
        <button
          onClick={() => toggleMenu("isUserMenuOpen")}
          className="mx-2 ml-4 flex text-gray-300 transition-opacity duration-100 hover:opacity-80"
        >
          <ProfileIcon className="text-xl" />
        </button>
      }
    >
      <section className="flex min-w-45 gap-2 border-b border-gray-200 p-2 pb-2">
        <div className="size-10">
          <img src={pfp} alt="Logo" className="rounded-full" />
        </div>
        <div className="flex flex-col gap-0">
          <span className="text-base font-semibold text-gray-700">
            {fullName}
          </span>
          <span className="text-xs text-gray-600">{email || "Friend"}</span>
        </div>
      </section>

      <section className="flex flex-col p-2 text-gray-600">
        <MenuButton
          icon={ProfileIcon}
          label="Profile"
          onClick={() => {
            navigate("/profile");
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
        <MenuButton
          icon={LogoutIcon}
          label={"Log out"}
          onClick={() => {
            signOut();
            closeMenu();
          }}
        />
      </section>
    </MenuContainer>
  );
}
