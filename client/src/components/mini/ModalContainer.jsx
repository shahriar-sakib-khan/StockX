// src/components/ModalContainer.jsx
import { useRef, useEffect } from "react";
import useClickOutside from "@/hooks/useClickOutside"; // adjust path if your hook location differs

export default function ModalContainer({ isOpen, onClose, children }) {
    const modalRef = useRef(null);

    // close when clicking outside
    useClickOutside(
        modalRef,
        () => {
            if (isOpen) onClose?.();
        },
        !!isOpen,
    );

    // prevent body scroll while modal is open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Modal content */}
            <div
                ref={modalRef}
                className="relative z-10 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                    aria-label="Close"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}
