// work in progress (just barebones version for now)

export default function Modal({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal content */}
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg transition-all duration-200 ease-out">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    {title && (
                        <h3 className="text-xl font-semibold text-gray-700">
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
                <div className="mb-4">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="mt-4 flex justify-end gap-3">{footer}</div>
                )}
            </div>
        </div>
    );
}
