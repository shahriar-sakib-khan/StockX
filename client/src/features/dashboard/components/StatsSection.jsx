import StatsCard from "./StatsCard";
import { Heading } from "../utils/Heading";
import { Section } from "../utils/Section";
import { BiCoinStack as SalesIcon } from "react-icons/bi";
import { TbCalendarDue as DueIcon } from "react-icons/tb";
import { TbReportMoney as ExpensesIcon } from "react-icons/tb";

const stats = [
    {
        Icon: (
            <SalesIcon className="size-8 rounded bg-emerald-100 p-1 text-emerald-600" />
        ),
        title: "Sales",
        value: 10000,
        bgColor: "bg-green-200",
        titleColor: "text-green-500",
        valueColor: "text-green-600",
        shadow: "shadow-sm shadow-green-500/40",
    },
    {
        Icon: (
            <DueIcon className="size-8 rounded bg-orange-100 p-1 text-orange-600" />
        ),
        title: "Dues",
        value: 2500,
        bgColor: "bg-amber-200/70",
        titleColor: "text-amber-500",
        valueColor: "text-amber-600",
        shadow: "shadow-sm shadow-amber-500/40",
    },
    {
        Icon: (
            <ExpensesIcon className="size-8 rounded bg-rose-100 p-1 text-rose-600" />
        ),
        title: "Expenses",
        value: 4000,
        bgColor: "bg-red-200",
        titleColor: "text-red-400",
        valueColor: "text-red-600",
        shadow: "shadow-sm shadow-red-500/40",
    },
];

export default function StatsSection() {
    return (
        <Section>
            <div className="rounded-md border border-gray-200 bg-white p-2 pt-4">
                {/* {heading("Sales Overview")} */}
                <Heading>Sales Overview</Heading>
                <div className="grid grid-cols-3">
                    {stats.map((stat, i) => (
                        <StatsCard key={i} {...stat} />
                    ))}
                </div>
            </div>
        </Section>
    );
}
