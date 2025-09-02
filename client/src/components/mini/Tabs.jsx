import { useState } from "react";

export default function Tabs({ tabs, defaultActive, children }) {
    const [activeTab, setActiveTab] = useState(defaultActive || tabs[0].key);

    return (
        <div className="w-full">
            {/* Tab List */}
            <div className="mb-2 grid grid-cols-3 rounded-lg border border-gray-300 bg-white p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-md px-2 py-1 text-base font-semibold transition-all duration-75 ${
                            activeTab === tab.key
                                ? "bg-gray-200 text-gray-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <>{children({ activeTab })}</>
        </div>
    );
}
