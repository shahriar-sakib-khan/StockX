// src/components/ConfirmDialog.jsx
export default function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    {title}
                </h3>
                <p className="mb-5 text-gray-600">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
