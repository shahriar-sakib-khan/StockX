import { MdNotificationsNone as NotificationIcon } from "react-icons/md";
import clsx from "clsx";

import UserMenu from "../ui/UserMenu";
import Logo from "../ui/Logo";
import { StoreMenu } from "@/components";

export default function Navbar({
    userMenu = false,
    className = "",
    dark = false,
}) {
    return (
        <header
            className={clsx(
                "sticky top-0 z-30 flex h-[var(--navbar-height)] w-full items-center border-b border-gray-200 px-4 shadow-sm transition-colors",
                className,
                dark ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            )}
        >
            <div className="flex w-full items-center justify-between">
                {/* Left Side: Store Menu (Mobile) / Logo (Desktop) */}
                <div className="flex items-center gap-3">
                    {/* Desktop Logo */}
                    <div className="hidden lg:block">
                        <Logo
                            className={clsx(
                                "text-xl font-bold",
                                dark ? "text-gray-100" : "text-gray-800"
                            )}
                        />
                    </div>

                    {/* Mobile: Store Menu (Replaces Logo/Sidebar header) */}
                    <div className="block lg:hidden w-48">
                         <StoreMenu />
                    </div>
                </div>

                {/* Right Side: Notifications & User */}
                <div className="flex items-center gap-2">
                    <button className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                        <NotificationIcon className={clsx("text-2xl", dark ? "text-gray-300" : "text-gray-600")} />
                    </button>
                    {userMenu && <UserMenu />}
                </div>
            </div>
        </header>
    );
}
