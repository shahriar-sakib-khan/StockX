import DefaultImage from "@/assets/images/user_icon.jpeg";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function StaffCard({ 
    staffMember, 
    onDelete, 
    onUpdate, 
    onPaySalary, 
    onShowHistory 
}) {
    return (
        // Added 'h-full' so the card stretches to fill the grid cell height
        <div className="flex h-full w-70 flex-col overflow-hidden rounded-md bg-white text-nowrap text-gray-600 shadow-lg ring-1 ring-gray-200">
            
            {/* ---------- Image Section ---------- */}
            <section className="relative flex items-center justify-center bg-gray-100/90">
                <img
                    src={staffMember?.image || DefaultImage}
                    alt={staffMember?.name || "Staff"}
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
                    {staffMember?.name || "Pending Invite"}
                </span>
                
                <span className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                    {staffMember?.role || "Staff"}
                </span>
                
                <span className="text-sm text-gray-500">
                    Phone: {staffMember?.phone || "N/A"}
                </span>

                {/* Salary Details */}
                <div className="mt-2 flex flex-col text-sm">
                    <div className="flex justify-between">
                         <span className="text-gray-500">Salary:</span>
                         <span className="font-medium text-gray-700">৳{staffMember?.salary || 0}</span>
                    </div>
                    
                    {/* Only show Due if > 0 */}
                    {staffMember?.remaining !== "0" && (
                        <div className="flex justify-between font-semibold text-red-500">
                            <span>Due:</span>
                            <span>৳{staffMember?.remaining}</span>
                        </div>
                    )}

                     {/* Status Badge */}
                     <div className="mt-1 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-[2px] text-[10px] font-bold uppercase border
                            ${staffMember?.salaryStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                            ${staffMember?.salaryStatus === 'Partial' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                            ${staffMember?.salaryStatus === 'Unpaid' ? 'bg-red-50 text-red-600 border-red-100' : ''}
                        `}>
                            {staffMember?.salaryStatus || 'Unknown'}
                        </span>
                     </div>
                </div>
            </section>

            {/* ---------- Action Buttons ---------- */}
            <section className="mt-2 mb-4 flex items-center justify-center gap-3 px-4">
                {/* Fixed: Used 'primary-button' class to match Shop/Vehicle pages exactly */}
                <button
                    onClick={onPaySalary}
                    className="primary-button px-4 py-1"
                >
                    Pay Salary
                </button>
                <button
                    onClick={onShowHistory}
                    className="rounded bg-gray-200 px-4 py-1 hover:bg-gray-300/70"
                >
                    History
                </button>
            </section>

            {/* ---------- Footer Button ---------- */}
            {/* Added 'mt-auto' to push this button to the very bottom */}
            <button
                onClick={onUpdate}
                className="mt-auto bg-gray-200 px-4 py-1 font-semibold text-gray-400 transition-all duration-100 hover:bg-gray-300/70"
            >
                Update
            </button>
        </div>
    );
}