import { createPortal } from "react-dom";
import clsx from "clsx";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-3xl",
        full: "max-w-[95vw] h-[90vh]",
    };

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal content */}
            <div
                className={clsx(
                    "relative z-10 w-full rounded-xl bg-white shadow-lg transition-all duration-200 ease-out",
                    sizeClasses[size],
                    "flex flex-col overflow-hidden",
                )}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-700">
                            {title}
                        </h3>
                    )}
                    <button
                        onClick={onClose}
                        className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div
                    className={clsx(
                        "flex-1 overflow-y-auto px-4 py-3",
                        size === "full" && "sm:px-6 sm:py-4",
                    )}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-4 py-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
