import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import { useAuthStore } from "../stores/useAuthStore";

import { inviteStaff } from "@/features/authentication/services/authServices";
import { StaffCard } from "@/features";

export default function StaffPage() {
    const currentStore = useAuthStore((state) => state.currentStore);

    const [staffList, setStaffList] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [lifespan, setLifespan] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const roleOptions = ["admin", "manager", "staff"];
    const lifespanOptions = ["1h", "6h", "12h", "1d", "3d", "7d"];

    const onAddClick = () => {
        setEmail("");
        setRole("");
        setLifespan("");
        setErrorMsg("");
        setIsModalOpen(true);
    };

    const onDelete = (id) => {
        setStaffList((prev) => prev.filter((staff) => staff.id !== id));
    };

    const onSendInvite = async () => {
        if (!email || !role || !lifespan) {
            setErrorMsg("Please fill in all fields");
            return;
        }
        if (!currentStore?.id) {
            setErrorMsg("No store selected");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            await inviteStaff(currentStore.id, { email, role, lifespan });
            alert("Invite sent successfully!");
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err?.response?.data?.errors?.[0]?.message ||
                    err?.response?.data?.message ||
                    "Failed to send invite",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            {/* header */}
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">
                    Staff List
                </h2>
                <button
                    onClick={onAddClick}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Staff
                    <span className="text-xl">+</span>
                </button>
            </div>

            {/* original StaffCard list */}
            <div className="mb-10 flex flex-wrap gap-5">
                {staffList.map((staff) => (
                    <StaffCard
                        key={staff.id}
                        staffMember={staff}
                        onDelete={() => onDelete(staff.id)}
                    />
                ))}
            </div>

            {/* invite modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold">
                            Invite Staff
                        </h3>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-3 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />

                        {/* Role dropdown */}
                        <div className="relative mb-3">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full appearance-none rounded border border-gray-300 p-2 pr-8 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                <option value="">Select Role</option>
                                {roleOptions.map((r) => (
                                    <option key={r} value={r}>
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <MdArrowDropDown className="pointer-events-none absolute top-2.5 right-2 text-xl text-gray-500" />
                        </div>

                        {/* Lifespan dropdown */}
                        <div className="relative mb-3">
                            <select
                                value={lifespan}
                                onChange={(e) => setLifespan(e.target.value)}
                                className="w-full appearance-none rounded border border-gray-300 p-2 pr-8 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                <option value="">Select Lifespan</option>
                                {lifespanOptions.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                            <MdArrowDropDown className="pointer-events-none absolute top-2.5 right-2 text-xl text-gray-500" />
                        </div>

                        {errorMsg && (
                            <p className="mb-2 text-red-500">{errorMsg}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded border border-gray-300 px-4 py-2"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSendInvite}
                                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
