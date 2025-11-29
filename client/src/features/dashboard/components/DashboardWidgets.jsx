import React from "react";
import { FaHammer } from "react-icons/fa";

// Reusable Card Wrapper
export const DashboardCard = ({ title, icon: Icon, children, className = "" }) => {
    return (
        <section className={`flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
            <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2 text-gray-800">
                    {Icon && <Icon className="text-indigo-500" />}
                    <h3 className="font-semibold">{title}</h3>
                </div>
            </div>
            <div className="flex-1 p-5">
                {children}
            </div>
        </section>
    );
};

// Reusable Empty State
export const ComingSoonState = ({ message, subtext }) => {
    return (
        <div className="flex h-40 flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-gray-100 p-3 text-gray-400">
                <FaHammer className="text-xl" />
            </div>
            <p className="font-medium text-gray-900">{message}</p>
            {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
    );
};
