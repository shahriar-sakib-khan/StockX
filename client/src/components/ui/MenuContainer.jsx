import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import clsx from "clsx";

export default function MenuContainer({
  trigger,
  children,
  isOpen,
  onClose,
  backdrop = true,
  backdropColor = "",
  menuPosition = "left-1 mt-1",
  className = "",
}) {
  const menuRef = useRef(null);

  // close on outside click
  useClickOutside(
    menuRef, // pass ref
    () => {
      if (isOpen) onClose?.();
    }, // pass handler
    !backdrop && !!isOpen, // pass permission
  );

  return (
    <div ref={menuRef} className={`relative`}>
      {/* Menu Trigger */}
      {trigger}

      {/* Backdrop */}
      {backdrop && isOpen && (
        <div
          onClick={onClose}
          className={`fixed inset-0 z-[90] ${backdropColor}`}
          aria-hidden="true"
        />
      )}

      {/* Menu Content */}
      <div
        className={clsx(
          "absolute z-[100] min-w-40 rounded-md bg-white text-nowrap shadow-lg ring-1 ring-gray-300 transition-all duration-150 ease-out",
          !className?.match(/left-|right-/) && menuPosition,
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
