import DefaultImage from "@/assets/images/shop_icon.png";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function ShopCard({
    shopInfo,
    onUpdate,
    onDelete,
    onShowHistory,
    onRecordTransaction,
    onExchangeCylinder,
}) {
    return (
        <div className="flex w-70 flex-col overflow-hidden rounded-md bg-white text-nowrap text-gray-600 shadow-lg ring-1 ring-gray-200">
            {/* ---------- Image Section ---------- */}
            <section className="relative flex items-center justify-center bg-gray-100/90">
                <img
                    src={shopInfo?.image || DefaultImage}
                    alt={shopInfo?.shopName || "Shop"}
                    className="h-40 rounded-t-md object-cover"
                />
                <button
                    onClick={onDelete}
                    className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-white/70 shadow hover:bg-red-50"
                >
                    <DeleteIcon className="size-5 text-red-500/80" />
                </button>
            </section>

            {/* ---------- Info Section ---------- */}
            <section className="flex flex-col gap-1 px-6 py-4">
                <span className="text-lg font-semibold text-gray-700">
                    {shopInfo?.shopName || "Unknown Shop"}
                </span>
                <span className="text-sm text-gray-500">
                    Owner: {shopInfo?.ownerName || "Unknown Owner"}
                </span>
                <span className="text-sm text-gray-500">
                    Phone: {shopInfo?.phoneNumber || "N/A"}
                </span>
                <span className="truncate text-sm text-gray-500">
                    {shopInfo?.location || "No location provided"}
                </span>

                {/* ---------- Total Due Display ---------- */}
                <span className="mt-2 text-sm font-semibold text-red-500">
                    Total Due: {shopInfo?.totalDue ?? 0} ৳
                </span>
            </section>

            {/* ---------- Action Buttons ---------- */}
            <section className="mt-2 mb-4 flex items-center justify-center gap-3 px-4">
                <button
                    onClick={onRecordTransaction}
                    className="primary-button px-4 py-1"
                >
                    Clear Due
                </button>
                <button
                    onClick={onShowHistory}
                    className="rounded bg-gray-200 px-4 py-1 hover:bg-gray-300/70"
                >
                    History
                </button>
            </section>

            {/* ---------- Footer Buttons ---------- */}
            <button
                onClick={onUpdate}
                className="bg-gray-200 px-4 py-1 font-semibold text-gray-400 transition-all duration-100 hover:bg-gray-300/70"
            >
                Update
            </button>

            <button
                onClick={onExchangeCylinder}
                className="bg-gray-100 px-4 py-1 font-semibold text-gray-600 transition-all duration-100 hover:bg-gray-200/70"
            >
                Exchange
            </button>
        </div>
    );
}
