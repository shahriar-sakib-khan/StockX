import { useState } from "react";
import { StaffCard } from "../features";

export default function StaffPage() {
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
            id: Date.now(),
            name: "Sakib bro",
            role: "Friend",
            salary: "18,000/-",
            paid: "15,000/-",
            remaining: "3,000/-",
            salaryStatus: "Paid",
            lastPaidDate: "12 August, 2025",
        },
    ]);

    const onAdd = () => {
        const newStaff = {
            id: Date.now(),
            name: "New Staff",
            role: "Friend",
            salary: "18,000/-",
            paid: "15,000/-",
            remaining: "3,000/-",
            salaryStatus: "Paid",
            lastPaidDate: "12 August, 2025",
        };
        setStaffList((prev) => [...prev, newStaff]);
    };

    const onDelete = (id) => {
        setStaffList((prev) => prev.filter((staff) => staff.id !== id));
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">
                    Staff Salary
                </h2>
                <button
                    onClick={onAdd}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Staff
                    <span className="text-xl">+</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-5">
                {staffList.map((staff) => {
                    return (
                        <StaffCard
                            key={staff.id}
                            staffMember={staff}
                            onDelete={() => onDelete(staff.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
