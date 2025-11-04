export function Dialog({ open, onOpenChange, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-lg">
                {children}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    onClick={() => onOpenChange(false)}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export function DialogContent({ children, className = "" }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

export function DialogHeader({ children }) {
    return <div className="mb-4 border-b pb-3">{children}</div>;
}

export function DialogTitle({ children }) {
    return <h3 className="text-lg font-semibold">{children}</h3>;
}
