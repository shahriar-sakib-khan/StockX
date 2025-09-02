import { MdNotificationsNone as NotificationIcon } from "react-icons/md";
import UserMenu from "../ui/UserMenu";
import Logo from "../ui/Logo";
import clsx from "clsx";

export default function Navbar({
    userMenu = false,
    className = "",
    wrapper = "",
    dark = false,
}) {
    return (
        <header
            className={clsx(
                "flex h-[var(--navbar-height)] items-center",
                className,
                dark && "bg-gray-700",
            )}
        >
            <div
                className={clsx(
                    wrapper === "narrow"
                        ? "wrapper-l"
                        : wrapper === "wide"
                          ? "wrapper"
                          : "wrapper-p",
                )}
            >
                <div className="flex w-full items-center">
                    <Logo
                        className={clsx(
                            "mr-auto text-xl",
                            dark ? "text-gray-300" : "text-gray-700",
                        )}
                    />
                    <button className="transition-opacity duration-100 hover:opacity-80">
                        <NotificationIcon className="text-xl text-gray-300" />
                    </button>
                    {userMenu && <UserMenu className="ml-0" dark={dark} />}
                </div>
            </div>
        </header>
    );
}
