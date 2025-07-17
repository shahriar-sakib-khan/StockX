import Logo from "../ui/Logo";
import UserMenu from "../ui/UserMenu";

export default function Navbar({ userMenu = false }) {
  return (
    <header className="flex h-[var(--navbar-height)] items-center bg-gray-200">
      <div className="wrapper">
        <div className="flex w-full items-center">
          <Logo className="mr-auto" />
          {userMenu && <UserMenu className="ml-auto" />}
        </div>
      </div>
    </header>
  );
}
