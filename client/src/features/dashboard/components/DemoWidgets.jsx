import React from "react";

// 1. Sales Chart Demo
export const DemoSalesChart = () => {
    // Height percentages for the bars
    const data = [40, 70, 45, 90, 60, 80, 50];
    const days = ["M", "T", "W", "T", "F", "S", "S"];

    return (
        <div className="flex h-full w-full flex-col justify-end gap-2 pt-4">
            {/* Graph Area */}
            <div className="flex h-full items-end justify-between gap-3 px-2">
                {data.map((h, i) => (
                    <div key={i} className="group relative flex h-full w-full flex-col justify-end items-center gap-2">
                        {/* Tooltip */}
                        <div className="absolute -top-8 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10 whitespace-nowrap">
                            ৳ {h * 100}
                        </div>
                        {/* Bar */}
                        <div
                            className={`w-full rounded-t-md transition-all duration-500 hover:bg-indigo-400 ${
                                i === 3 ? "bg-indigo-600" : "bg-indigo-100"
                            }`}
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>
            {/* Labels */}
            <div className="flex justify-between border-t border-gray-100 pt-3 text-xs text-gray-400 font-bold">
                {days.map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}
            </div>
        </div>
    );
};

// 2. Recent Activity List Demo
export const DemoActivityList = () => {
    const activities = [
        { text: "New stock added: 50 Cylinders", time: "2m ago", type: "stock" },
        { text: "Sale #1024: Bashundhara (12kg)", time: "15m ago", type: "sale" },
        { text: "Driver Rashid completed delivery", time: "1h ago", type: "driver" },
        { text: "Monthly rent paid", time: "5h ago", type: "expense" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm ${
                        act.type === 'sale' ? 'bg-green-500' :
                        act.type === 'stock' ? 'bg-blue-500' :
                        act.type === 'expense' ? 'bg-red-500' : 'bg-orange-500'
                    }`}></div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">{act.text}</p>
                        <p className="text-xs text-gray-400">{act.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 3. Vehicle Status Demo
export const DemoVehicleList = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-600 shadow-sm border border-gray-100">DM</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Truck (DM-KA-11)</p>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span> On Route
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-semibold text-gray-600">80% Fuel</span>
                </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-400">PU</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500">Pickup (Small)</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                             <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span> Idle
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-semibold text-gray-400">Parked</span>
                </div>
            </div>
        </div>
    );
};

// 4. Customer Shops Demo (Renamed context in UI)
export const DemoShopList = () => {
    const shops = [
        { name: "Rahim Store", location: "Dhanmondi", status: "Active", lastOrder: "2h ago" },
        { name: "Bhai Bhai Enterprise", location: "Mirpur 10", status: "Active", lastOrder: "1d ago" },
        { name: "Mayer Doa Store", location: "Gulshan 1", status: "Pending", lastOrder: "5d ago" },
        { name: "New Market Gas", location: "Azimpur", status: "Active", lastOrder: "3d ago" },
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
            {shops.map((shop, i) => (
                <div key={i} className="min-w-[200px] shrink-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {shop.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            shop.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {shop.status}
                        </span>
                    </div>
                    <h4 className="truncate font-bold text-gray-800 text-sm">{shop.name}</h4>
                    <p className="text-xs text-gray-500">{shop.location}</p>
                    <div className="mt-3 border-t border-gray-50 pt-2 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400">Last Order</span>
                        <span className="text-xs font-medium text-gray-600">{shop.lastOrder}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
