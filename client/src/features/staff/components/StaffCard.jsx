import DefaultImage from "@/assets/images/user_icon.jpeg";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

export default function StaffCard({ staffMember, onDelete }) {
    // Helper to determine status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "paid": return "bg-emerald-100 text-emerald-700";
            case "partial": return "bg-amber-100 text-amber-700";
            case "unpaid": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">

            {/* --- Header Section (Profile) --- */}
            <div className="flex items-center gap-4 border-b border-gray-50 bg-gray-50/50 p-4">
                {/* Avatar */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                    {staffMember?.image ? (
                        <img
                            src={staffMember.image}
                            alt={staffMember.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                            <FaUserCircle className="h-10 w-10" />
                        </div>
                    )}
                </div>

                {/* Name & Role */}
                <div className="flex flex-col">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-1">
                        {staffMember?.name || "Pending Invite"}
                    </h3>
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {staffMember?.role || "Staff"}
                    </span>
                </div>

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    className="absolute right-3 top-3 rounded-full p-2 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    title="Remove Staff"
                >
                    <DeleteIcon size={18} />
                </button>
            </div>

            {/* --- Salary Info Section --- */}
            <div className="flex flex-col gap-2 p-4 text-sm">

                {/* Salary Row */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Salary</span>
                    <span className="font-semibold text-gray-900">৳ {staffMember?.salary || "0"}</span>
                </div>

                {/* Paid Row */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Paid</span>
                    <span className="font-semibold text-emerald-600">৳ {staffMember?.paid || "0"}</span>
                </div>

                {/* Remaining Row */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                    <span className="text-gray-500">Due</span>
                    <span className="font-bold text-red-500">৳ {staffMember?.remaining || "0"}</span>
                </div>

                {/* Status Badges */}
                <div className="mt-2 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusColor(staffMember?.salaryStatus)}`}>
                        {staffMember?.salaryStatus || "Unknown"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        Last Paid: {staffMember?.lastPaidDate || "N/A"}
                    </span>
                </div>
            </div>

            {/* --- Action Buttons --- */}
            <div className="mt-auto grid grid-cols-2 gap-px bg-gray-100 p-px">
                <button className="bg-white py-3 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50">
                    Pay Salary
                </button>
                <button className="bg-white py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                    History
                </button>
            </div>
        </div>
    );
}
