import { useState } from "react";

export default function Tabs({ tabs, defaultActive, children }) {
    const [activeTab, setActiveTab] = useState(defaultActive || tabs[0].key);

    return (
        <div className="flex h-full flex-col">
            {/* Tab Header */}
            <div className="border-b border-gray-200 bg-gray-50/50 px-4 pt-3">
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition-all ${
                                activeTab === tab.key
                                    ? "border-emerald-500 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {children({ activeTab })}
            </div>
        </div>
    );
}
