import { useState } from "react";
import {
    FaSearch,
    FaFilter,
    FaFileDownload,
    FaArrowDown,
    FaArrowUp,
    FaGasPump,
    FaTruck,
    FaExchangeAlt
} from "react-icons/fa";
import { MdAttachMoney, MdStore } from "react-icons/md";

// --- MOCK DATA (Business Context) ---
const MOCK_HISTORY = [
    {
        id: "TXN-1024",
        date: "2023-10-25",
        time: "10:30 AM",
        type: "sale",
        category: "Cylinder Sale",
        party: "Rahim Store (Dhanmondi)",
        details: "50x 12L Bashundhara (Full)",
        amount: 65000,
        status: "completed",
        paymentMethod: "Cash"
    },
    {
        id: "TXN-1023",
        date: "2023-10-24",
        time: "04:15 PM",
        type: "expense",
        category: "Stock Purchase",
        party: "Jamuna Depot",
        details: "100x 12L Refills",
        amount: 110000,
        status: "completed",
        paymentMethod: "Bank Transfer"
    },
    {
        id: "TXN-1022",
        date: "2023-10-24",
        time: "02:00 PM",
        type: "expense",
        category: "Vehicle Fuel",
        party: "Truck (DM-KA-11)",
        details: "Diesel - 40 Liters",
        amount: 4500,
        status: "completed",
        paymentMethod: "Cash"
    },
    {
        id: "TXN-1021",
        date: "2023-10-23",
        time: "11:00 AM",
        type: "income",
        category: "Due Collection",
        party: "Bhai Bhai Enterprise",
        details: "Partial payment of Oct dues",
        amount: 20000,
        status: "completed",
        paymentMethod: "Mobile Banking"
    },
    {
        id: "TXN-1020",
        date: "2023-10-23",
        time: "09:00 AM",
        type: "expense",
        category: "Maintenance",
        party: "Workshop",
        details: "Pickup (Small) Tyre Change",
        amount: 8000,
        status: "pending",
        paymentMethod: "Due"
    },
    {
        id: "TXN-1019",
        date: "2023-10-22",
        time: "05:45 PM",
        type: "sale",
        category: "Stove Sale",
        party: "New Market Gas",
        details: "5x Double Burner Stoves",
        amount: 12500,
        status: "completed",
        paymentMethod: "Cash"
    }
];

export default function HistoryPage() {
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Helper to get Icon based on category
    const getIcon = (category) => {
        if (category.includes("Sale") || category.includes("Collection")) return <MdStore />;
        if (category.includes("Stock")) return <FaExchangeAlt />;
        if (category.includes("Fuel") || category.includes("Vehicle")) return <FaGasPump />;
        if (category.includes("Transport")) return <FaTruck />;
        return <MdAttachMoney />;
    };

    // Helper for Amount Styling
    const getAmountStyle = (type) => {
        if (type === "income" || type === "sale") return "text-emerald-600";
        if (type === "expense") return "text-red-600";
        return "text-gray-700";
    };

    return (
        <div className="flex h-full flex-col gap-6 bg-gray-50 p-4 pb-24 lg:p-6 lg:pb-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                    <p className="text-sm text-gray-500">Track all financial movements and stock transfers.</p>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto">
                    <FaFileDownload /> Export Report
                </button>
            </div>

            {/* --- STATS OVERVIEW --- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Total Income (Oct)</p>
                    <div className="mt-1 flex items-center gap-2">
                        <FaArrowUp className="text-sm text-emerald-500" />
                        <h2 className="text-2xl font-bold text-emerald-700">৳ 450,200</h2>
                    </div>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Total Expenses (Oct)</p>
                    <div className="mt-1 flex items-center gap-2">
                        <FaArrowDown className="text-sm text-red-500" />
                        <h2 className="text-2xl font-bold text-red-700">৳ 185,000</h2>
                    </div>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Net Balance</p>
                    <h2 className="mt-1 text-2xl font-bold text-blue-700">৳ 265,200</h2>
                </div>
            </div>

            {/* --- FILTERS --- */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, Shop Name, or Ref..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {["all", "sale", "expense", "stock"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-all ${
                                filterType === type
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50 md:hidden">
                    <FaFilter /> Filter
                </button>
            </div>

            {/* --- DATA LIST (Responsive) --- */}
            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* 1. DESKTOP TABLE (Hidden on Mobile) */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Party/Ref</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Payment</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {MOCK_HISTORY.map((txn, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900">{txn.id}</span>
                                            <span className="text-xs text-gray-500">{txn.date} • {txn.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {getIcon(txn.category)} {txn.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{txn.party}</span>
                                            <span className="text-xs text-gray-500">{txn.details}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {txn.paymentMethod}
                                    </td>
                                    <td className={`px-6 py-4 text-right text-sm font-bold ${getAmountStyle(txn.type)}`}>
                                        {txn.type === 'expense' ? '-' : '+'} ৳{txn.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                            txn.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 2. MOBILE CARDS (Visible on Mobile) */}
                <div className="flex flex-col divide-y divide-gray-100 md:hidden">
                    {MOCK_HISTORY.map((txn, i) => (
                        <div key={i} className="flex flex-col gap-2 p-4 hover:bg-gray-50 active:bg-gray-100">
                            {/* Top Row: Icon + Title + Amount */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                        {getIcon(txn.category)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{txn.party}</h4>
                                        <span className="text-xs text-gray-500">{txn.id} • {txn.date}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`block text-sm font-bold ${getAmountStyle(txn.type)}`}>
                                        {txn.type === 'expense' ? '-' : '+'} ৳{txn.amount.toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase ${
                                        txn.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {txn.status}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Row: Details & Payment */}
                            <div className="ml-13 mt-1 flex flex-col gap-1">
                                <p className="text-xs text-gray-700 bg-gray-50 p-1.5 rounded border border-gray-100">
                                    {txn.category}: {txn.details}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    Paid via {txn.paymentMethod}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- PAGINATION --- */}
            <div className="flex items-center justify-between px-2">
                <span className="text-xs text-gray-500">Showing 1-6 of 240 transactions</span>
                <div className="flex gap-2">
                    <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 disabled:opacity-50">Prev</button>
                    <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
}
