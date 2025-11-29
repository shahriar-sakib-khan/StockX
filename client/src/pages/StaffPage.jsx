import { useState, useEffect } from "react";
import { FaUserPlus, FaEnvelope, FaTrash } from "react-icons/fa";

import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { inviteStaff } from "@/features/authentication/services/authServices";
import { StaffCard } from "@/features";

export default function StaffPage() {
    const currentStore = useAuthStore((state) => state.currentStore);

    // --- Mock Data for Demo ---
    const DEMO_STAFF = [
        {
            id: "1",
            name: "Rahim Uddin",
            role: "Manager",
            image: null,
            salary: "20,000",
            paid: "15,000",
            remaining: "5,000",
            salaryStatus: "Partial",
            lastPaidDate: "12 Oct, 2023",
        },
        {
            id: "2",
            name: "Karim Mia",
            role: "Driver",
            image: null,
            salary: "12,000",
            paid: "12,000",
            remaining: "0",
            salaryStatus: "Paid",
            lastPaidDate: "01 Oct, 2023",
        },
        {
            id: "3",
            name: "Salam Khan",
            role: "Helper",
            image: null,
            salary: "8,000",
            paid: "0",
            remaining: "8,000",
            salaryStatus: "Unpaid",
            lastPaidDate: "Never",
        },
    ];

    // Initialize with demo data if no API yet
    const [staffList, setStaffList] = useState(DEMO_STAFF);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("staff");
    const [lifespan, setLifespan] = useState("7d");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const roleOptions = ["admin", "manager", "staff"];
    const lifespanOptions = ["1h", "6h", "12h", "1d", "3d", "7d"];

    const onAddClick = () => {
        setEmail("");
        setRole("staff");
        setLifespan("7d");
        setErrorMsg("");
        setIsModalOpen(true);
    };

    const onDelete = (id) => {
        if (confirm("Are you sure you want to remove this staff member?")) {
            setStaffList((prev) => prev.filter((staff) => staff.id !== id));
        }
    };

    const onSendInvite = async (e) => {
        e.preventDefault();
        if (!email || !role || !lifespan) {
            setErrorMsg("Please fill in all fields");
            return;
        }
        if (!currentStore?.id) {
            // For demo purposes, we can skip this check or show mock success
            // setErrorMsg("No store selected");
            // return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            if (currentStore?.id) {
                await inviteStaff(currentStore.id, { email, role, lifespan });
            } else {
                // Mock success for demo
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Mock invite sent to", email);
            }

            setIsModalOpen(false);
            alert(`Invite sent to ${email}`);
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err?.response?.data?.errors?.[0]?.message ||
                err?.response?.data?.message ||
                "Failed to send invite"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col gap-6 bg-gray-50 p-4 pb-24 lg:p-6 lg:pb-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                    <p className="text-sm text-gray-500">Invite and manage store employees.</p>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 sm:w-auto"
                >
                    <FaUserPlus /> Invite Staff
                </button>
            </div>

            {/* Staff Grid */}
            {staffList.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
                    <FaUserPlus className="mb-4 text-4xl text-gray-300" />
                    <p>No staff members yet. Invite someone to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {staffList.map((staff) => (
                        <StaffCard
                            key={staff.id}
                            staffMember={staff}
                            onDelete={() => onDelete(staff.id)}
                        />
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Invite New Staff"
                size="md"
            >
                <form onSubmit={onSendInvite} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                {roleOptions.map((r) => (
                                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Invite Valid For</label>
                            <select
                                value={lifespan}
                                onChange={(e) => setLifespan(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                {lifespanOptions.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {errorMsg && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{errorMsg}</p>}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
                        >
                            {isLoading ? "Sending..." : "Send Invite"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
