import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import clsx from "clsx";

export default function MenuContainer({
    trigger,
    children,
    isOpen,
    onClose,
    backdrop = true,
    backdropColor = "bg-transparent", // Allows passing 'bg-black/20' if you want a dim effect
    menuPosition = "left-0 mt-2",     // Default alignment
    className = "",
}) {
    const menuRef = useRef(null);

    // Close on outside click (Active only if backdrop is FALSE, otherwise backdrop handles it)
    useClickOutside(
        menuRef,
        () => {
            if (isOpen) onClose?.();
        },
        !backdrop && isOpen // Only listen if backdrop is off and menu is open
    );

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            {/* 1. Menu Trigger */}
            <div className="flex items-center">
                {trigger}
            </div>

            {/* 2. Backdrop (Fixed Overlay) */}
            {/* Z-Index 60 ensures it sits above Sidebar (z-50) and Navbar (z-30) */}
            {backdrop && isOpen && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className={clsx(
                        "fixed inset-0 z-[60] cursor-default",
                        backdropColor
                    )}
                    aria-hidden="true"
                />
            )}

            {/* 3. Menu Content */}
            {/* Z-Index 70 ensures content sits on top of the backdrop */}
            <div
                className={clsx(
                    "absolute z-[70] min-w-[10rem] origin-top rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition-all duration-200 ease-out",
                    menuPosition,
                    className,
                    isOpen
                        ? "transform scale-100 opacity-100 visible"
                        : "transform scale-95 opacity-0 invisible pointer-events-none"
                )}
                role="menu"
                aria-orientation="vertical"
                tabIndex="-1"
            >
                {/* Scrollable container for very long menus */}
                <div className="max-h-[80vh] overflow-y-auto rounded-md py-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
