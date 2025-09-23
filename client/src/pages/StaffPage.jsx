import { useState } from "react";
import { StaffCard } from "../features";
import { useAuthStore } from "../stores/useAuthStore";
import { inviteStaff } from "../features/authentication/services/authServices";

export default function StaffPage() {
    const currentStore = useAuthStore((state) => state.currentStore);

    // keep your initial staff cards
    const [staffList, setStaffList] = useState([
        {
            id: Date.now(),
            name: "Salif bro",
            role: "Friend",
            salary: "18,000/-",
            paid: "15,000/-",
            remaining: "3,000/-",
            salaryStatus: "Paid",
            lastPaidDate: "12 August, 2025",
        },
        {
            id: Date.now() + 1,
            name: "Sakib bro",
            role: "Friend",
            salary: "18,000/-",
            paid: "15,000/-",
            remaining: "3,000/-",
            salaryStatus: "Paid",
            lastPaidDate: "12 August, 2025",
        },
    ]);

    // modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    // const [lifespan, setLifespan] = useState("");
    const lifespan = '1d';
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const onAddClick = () => {
        setEmail("");
        setRole("");
        // setLifespan("");
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
                "Failed to send invite"
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
                    Staff Salary
                </h2>
                <button
                    onClick={onAddClick}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Staff
                    <span className="text-xl">+</span>
                </button>
            </div>

            {/* original StaffCard list preserved */}
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            Invite Staff
                        </h3>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-3 rounded border border-gray-300 p-2"
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full mb-3 rounded border border-gray-300 p-2"
                        />
                        {/* <input
                            type="text"
                            placeholder="Lifespan (e.g. 1d)"
                            value={lifespan}
                            onChange={(e) => setLifespan(e.target.value)}
                            className="w-full mb-3 rounded border border-gray-300 p-2"
                        /> */}
                        {errorMsg && (
                            <p className="text-red-500 mb-2">{errorMsg}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded border border-gray-300"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSendInvite}
                                className="px-4 py-2 rounded bg-blue-500 text-white"
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
