import DefaultImage from "@/assets/images/user_icon.jpeg";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function StaffCard({ staffMember, onDelete }) {
    return (
        <div className="flex flex-col rounded-md bg-white text-nowrap text-gray-600 shadow-lg ring-1 ring-gray-200">
            {/* Top section */}
            <section className="flex items-center gap-4 bg-gray-100/90 px-4 py-4">
                <div className="size-20">
                    <img
                        src={staffMember?.image || DefaultImage}
                        alt="Logo"
                        className="rounded-full"
                    />
                </div>
                <div className="flex min-w-[10ch] flex-col">
                    <span className="text-base font-normal">
                        {staffMember?.name || "Unnamed"}
                    </span>
                    <span className="text-sm font-normal text-gray-400">
                        {staffMember?.role || "Friend"}
                    </span>
                </div>
                <div className="h-full">
                    <button
                        onClick={onDelete}
                        className="group ml-auto flex size-9 items-center justify-center rounded-full bg-white/70 shadow transition-all duration-100 hover:bg-red-50"
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
                        {staffMember?.salary || "15,000/-"}
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    Paid{" "}
                    <span className="font-semibold text-emerald-500">
                        {staffMember?.paid || "0/-"}
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    Remaining{" "}
                    <span className="font-semibold text-red-500">
                        {staffMember?.remaining || "15,000/-"}
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    Status
                    <span className="mr-3 rounded bg-emerald-500 px-2 py-0.5 text-xs text-white">
                        {staffMember?.salaryStatus || "Unpaid"}
                    </span>
                </span>
                <span className="flex items-center justify-between gap-2">
                    Last Paid:
                    <span className="font-semibold">
                        {staffMember?.lastPaidDate || "Never Paid"}
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
