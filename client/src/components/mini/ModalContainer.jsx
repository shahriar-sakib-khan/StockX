import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import clsx from "clsx";

export default function ModalContainer({
    isOpen,
    onClose,
    children,
    backdrop = true,
    backdropColor = "bg-black/30",
    className = "",
}) {
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useClickOutside(
        // pass reference
        modalRef,
        // pass click handler
        () => {
            if (isOpen) onClose?.();
        },
        // pass permission to use handler
        !!isOpen,
    );

    return (
        <>
            {/* Backdrop */}
            {backdrop && (
                <div
                    onClick={onClose}
                    className={clsx(
                        "fixed inset-0 z-[90] transition-opacity duration-300 ease-in-out",
                        backdropColor,
                        isOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0",
                    )}
                    aria-hidden="true"
                />
            )}

            {/* Modal content */}
            <div
                ref={modalRef}
                className={clsx(
                    "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ease-in-out",
                    isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                    className,
                )}
            >
                {children}
            </div>
        </>
    );
}
