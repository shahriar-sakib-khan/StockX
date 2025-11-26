export default function CylinderItemCard({ item = {}, variant = "offer" }) {
    // variant controls color: offer = greenish, take = reddish
    const base = "w-28 rounded-md border p-2 text-xs flex-shrink-0";
    const variantClass =
        variant === "offer"
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200";

    return (
        <div className={`${base} ${variantClass}`}>
            <div className="mb-2 flex h-12 w-full items-center justify-center overflow-hidden rounded bg-gray-200">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.brand}
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="text-xs text-gray-500">No image</div>
                )}
            </div>

            <div className="truncate text-xs font-semibold text-gray-800">
                {item.brand}
            </div>
            <div className="text-xs text-gray-600">{item.size} kg</div>
            <div className="text-xs text-gray-600">
                Reg: {item.regulatorType}
            </div>
            <div className="mt-1 text-xs font-medium text-gray-800">
                Qty: {item.quantity}
            </div>
        </div>
    );
}
