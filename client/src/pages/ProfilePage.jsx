import { useState } from "react";
import {
    FaUser,
    FaLock,
    FaCamera,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBuilding
} from "react-icons/fa";
import { useAuthStore } from "@/stores/useAuthStore"; // Hook up real data here later

export default function ProfilePage() {
    // Mock Data (Replace with useAuth() data later)
    const mockUser = {
        name: "Rahim Ahmed",
        role: "Store Manager",
        email: "rahim@stockx.com",
        phone: "+880 1711-456789",
        location: "Dhanmondi, Dhaka",
        store: "Dhanmondi Outlet",
        joinDate: "October 2023",
        avatar: null // or URL
    };

    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="flex h-full flex-col gap-6 bg-gray-50 p-4 pb-24 lg:p-8">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-sm text-gray-500">Manage your personal information and security settings.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* --- LEFT COLUMN: Identity Card & Nav --- */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    {/* Identity Card */}
                    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="relative mb-4">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-4xl font-bold text-indigo-600 ring-4 ring-white shadow-md overflow-hidden">
                                {mockUser.avatar ? (
                                    <img src={mockUser.avatar} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    mockUser.name.charAt(0)
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 rounded-full bg-gray-800 p-2 text-white shadow-sm hover:bg-gray-700 transition-colors">
                                <FaCamera size={14} />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">{mockUser.name}</h2>
                        <span className="mt-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            {mockUser.role}
                        </span>

                        <div className="mt-6 w-full space-y-3 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FaBuilding className="text-gray-400" />
                                <span>{mockUser.store}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <span>{mockUser.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="text-xs text-gray-400">Joined:</span>
                                <span>{mockUser.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu (Desktop) */}
                    <div className="hidden flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:flex">
                        <NavButton
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                            icon={FaUser}
                            label="Overview"
                        />
                        <NavButton
                            active={activeTab === "edit"}
                            onClick={() => setActiveTab("edit")}
                            icon={FaPen}
                            label="Edit Profile"
                        />
                        <NavButton
                            active={activeTab === "security"}
                            onClick={() => setActiveTab("security")}
                            icon={FaLock}
                            label="Security"
                        />
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Content Area --- */}
                <div className="lg:col-span-2">
                    {/* Mobile Tabs */}
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden no-scrollbar">
                        {["overview", "edit", "security"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize whitespace-nowrap transition-colors ${
                                    activeTab === tab
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-600 border border-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        {activeTab === "overview" && <ProfileOverview user={mockUser} />}
                        {activeTab === "edit" && <EditProfileForm user={mockUser} />}
                        {activeTab === "security" && <SecurityForm />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

// 1. Navigation Button
function NavButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 border-l-4 px-5 py-4 text-sm font-medium transition-all ${
                active
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
        >
            <Icon className={active ? "text-indigo-600" : "text-gray-400"} />
            {label}
        </button>
    );
}

// 2. Profile Overview
function ProfileOverview({ user }) {
    const InfoRow = ({ label, value, icon: Icon }) => (
        <div className="flex items-center justify-between border-b border-gray-50 py-4 last:border-0">
            <div className="flex items-center gap-3 text-gray-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="text-sm" />
                </div>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
        </div>
    );

    return (
        <div className="space-y-2">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Profile Details</h3>
            <InfoRow label="Full Name" value={user.name} icon={FaUser} />
            <InfoRow label="Email Address" value={user.email} icon={FaEnvelope} />
            <InfoRow label="Phone Number" value={user.phone} icon={FaPhone} />
            <InfoRow label="Location" value={user.location} icon={FaMapMarkerAlt} />
            <InfoRow label="Assigned Store" value={user.store} icon={FaBuilding} />
        </div>
    );
}

// 3. Edit Profile Form
import { FaPen } from "react-icons/fa"; // Importing locally for this block
function EditProfileForm({ user }) {
    return (
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <h3 className="mb-4 text-lg font-bold text-gray-800">Edit Profile</h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputGroup label="Full Name" defaultValue={user.name} />
                <InputGroup label="Phone Number" defaultValue={user.phone} />
                <InputGroup label="Location" defaultValue={user.location} />
                <InputGroup label="Email" defaultValue={user.email} disabled />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Save Changes
                </button>
            </div>
        </form>
    );
}

// 4. Security Form
function SecurityForm() {
    return (
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <h3 className="mb-4 text-lg font-bold text-gray-800">Change Password</h3>

            <InputGroup label="Current Password" type="password" placeholder="••••••••" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputGroup label="New Password" type="password" placeholder="••••••••" />
                <InputGroup label="Confirm Password" type="password" placeholder="••••••••" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Update Password
                </button>
            </div>
        </form>
    );
}

// Helper Input
function InputGroup({ label, type = "text", ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">{label}</label>
            <input
                type={type}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                {...props}
            />
        </div>
    );
}
