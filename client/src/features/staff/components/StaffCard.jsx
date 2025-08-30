import Image from "../../../assets/images/user_icon.jpeg";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function StaffCard({ staffMember, onDelete }) {
  return (
    <div className="flex flex-col rounded-md bg-white text-nowrap shadow-lg ring-1 ring-gray-200">
      {/* Top section */}
      <section className="mt-1 flex min-w-50 items-center gap-4 px-4 py-2">
        <div className="size-10">
          <img src={Image} alt="Logo" className="rounded-full" />
        </div>
        <div className="flex flex-col gap-0">
          <span className="text-base font-normal text-gray-700">
            {staffMember?.name || "Unnamed"}
          </span>
          <span className="text-sm font-normal text-gray-400">
            {staffMember?.role || "Friend"}
          </span>
        </div>
        <button onClick={onDelete} className="ml-auto">
          <DeleteIcon className="size-5 text-red-400 hover:text-red-500" />
        </button>
      </section>

      {/* Salary info section */}
      <section className="mb-1 flex flex-col gap-1 px-3 py-2">
        <span className="flex items-center justify-between">
          Salary <span>{staffMember?.salary || "18,000"}/-</span>
        </span>
        <span className="flex items-center justify-between">
          Paid{" "}
          <span className="text-emerald-500">
            {staffMember?.paid || "15,000"}/-
          </span>
        </span>
        <span className="flex items-center justify-between">
          Remaining{" "}
          <span className="text-red-500">
            {staffMember?.remaining || "3,000"}/-
          </span>
        </span>
        <span className="flex items-center justify-between">
          Status
          <span className="mr-3 rounded bg-emerald-400 px-2 py-0.5 text-xs text-white">
            {staffMember?.salaryStatus || "Paid"}
          </span>
        </span>
      </section>

      {/* Buttons */}
      <section className="mx-4 mb-3 flex items-center justify-center gap-3">
        <button className="primary-button px-3 py-1">Pay</button>
        <button className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300/70">
          History
        </button>
      </section>
    </div>
  );
}
