import StatsCard from "./StatsCard";
import { BiCoinStack as SalesIcon } from "react-icons/bi";
import { TbCalendarDue as DueIcon } from "react-icons/tb";
import { TbReportMoney as ExpensesIcon } from "react-icons/tb";

const stats = [
    {
        Icon: <SalesIcon className="text-xl" />,
        title: "Total Sales",
        value: 10000,
        colorClass: "bg-emerald-100 text-emerald-600",
        borderClass: "border-emerald-100"
    },
    {
        Icon: <DueIcon className="text-xl" />,
        title: "Total Dues",
        value: 2500,
        colorClass: "bg-orange-100 text-orange-600",
        borderClass: "border-orange-100"
    },
    {
        Icon: <ExpensesIcon className="text-xl" />,
        title: "Expenses",
        value: 4000,
        colorClass: "bg-rose-100 text-rose-600",
        borderClass: "border-rose-100"
    },
];

export default function StatsSection() {
    return (
        // Mobile: Horizontal Scroll (Swimlane) for better touch UX
        // Desktop: 3-Column Grid to match the Wallet card height
        <div className="flex h-full w-full gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 lg:gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="min-w-[160px] flex-1 shrink-0 h-full">
                    <StatsCard {...stat} />
                </div>
            ))}
        </div>
    );
}
