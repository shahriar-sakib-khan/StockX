import Image from "../../../assets/images/user_icon.jpeg";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function VehicleCard({ vehicleInfo, onDelete }) {
    return (
        <div className="flex flex-col rounded-md bg-white text-nowrap text-gray-600 shadow-lg ring-1 ring-gray-200">
            {/* Top section */}
            <section className="flex items-center gap-4 px-4 py-4">
                <div className="size-20">
                    <img src={Image} alt="Logo" className="rounded-full" />
                </div>
                <div className="flex min-w-[10ch] flex-col">
                    <span className="text-base font-normal">
                        {vehicleInfo?.name || "Unnamed"}
                    </span>
                    <span className="text-sm font-normal text-gray-400">
                        {vehicleInfo?.role || "Friend"}
                    </span>
                </div>
                <div className="h-full">
                    <button
                        onClick={onDelete}
                        className="group ml-auto flex size-9 items-center justify-center rounded-full transition-all duration-100 hover:bg-red-50"
                    >
                        <DeleteIcon className="size-5 text-red-400/80 transition-all duration-100 group-hover:text-red-500/80" />
                    </button>
                </div>
            </section>

            {/* Salary info section */}
            <section className="flex flex-col gap-2 px-6 py-2">
                <span className="flex items-center justify-between">
                    Salary{" "}
                    <span className="font-semibold">
                        {vehicleInfo?.salary || "15,000/-"}
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    Paid{" "}
                    <span className="font-semibold text-emerald-500">
                        {vehicleInfo?.paid || "10,000/-"}
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    Remaining{" "}
                    <span className="font-semibold text-red-500">
                        {vehicleInfo?.remaining || "5,000/-"}
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    Status
                    <span className="mr-3 rounded bg-emerald-500 px-2 py-0.5 text-xs text-white">
                        {vehicleInfo?.salaryStatus || "Paid"}
                    </span>
                </span>
            </section>

            {/* Buttons Section */}
            <section className="mt-4 mb-4 flex items-center justify-center gap-3 px-4">
                <button className="primary-button px-3 py-1">Pay</button>
                <button className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300/70">
                    History
                </button>
            </section>
        </div>
    );
}
