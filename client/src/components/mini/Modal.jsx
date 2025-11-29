import { createPortal } from "react-dom";
import { useEffect } from "react";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] h-[90vh]",
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div
                className={clsx(
                    "relative z-[110] flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all",
                    sizeClasses[size]
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    {title && (
                        <h3 className="text-lg font-bold text-gray-800">
                            {title}
                        </h3>
                    )}
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
