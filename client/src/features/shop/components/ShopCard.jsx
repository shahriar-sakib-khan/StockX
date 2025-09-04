import DefaultImage from "@/assets/images/shop_icon.png";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function ShopCard({ shopInfo, onDelete }) {
    return (
        <div className="flex w-65 flex-col rounded-md bg-white text-nowrap text-gray-600 shadow-lg ring-1 ring-gray-200">
            {/* Top section (shop image + delete) */}
            <section className="relative flex items-center justify-center bg-gray-100/90 py-2">
                <img
                    src={shopInfo?.image || DefaultImage}
                    alt={shopInfo?.name || "Shop"}
                    className="h-40 rounded-t-md object-cover"
                />
                <button
                    onClick={onDelete}
                    className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-white/70 shadow hover:bg-red-50"
                >
                    <DeleteIcon className="size-5 text-red-500/80" />
                </button>
            </section>

            {/* Shop info section */}
            <section className="flex flex-col gap-1 px-6 py-4">
                <span className="text-lg font-semibold text-gray-700">
                    {shopInfo?.name || "Unnamed Shop"}
                </span>
                {shopInfo?.contactName && (
                    <span className="text-sm text-gray-500">
                        Name: {shopInfo.contactName}
                    </span>
                )}
                {shopInfo?.phone && (
                    <span className="text-sm text-gray-500">
                        Phone: {shopInfo.phone}
                    </span>
                )}
                {shopInfo?.address && (
                    <span className="text-sm text-gray-500">
                        Address: {shopInfo.address}
                    </span>
                )}
                {shopInfo?.due && (
                    <span
                        className={`text-sm ${shopInfo.due !== "0" ? "text-red-600" : "text-green-600"}`}
                    >
                        Due: {shopInfo.due}/-
                    </span>
                )}
            </section>

            {/* Buttons Section */}
            <section className="mt-2 mb-4 flex items-center justify-center gap-3 px-4">
                <button className="primary-button px-4 py-1">Stats</button>
                <button className="rounded bg-gray-200 px-4 py-1 hover:bg-gray-300/70">
                    History
                </button>
            </section>
        </div>
    );
}
