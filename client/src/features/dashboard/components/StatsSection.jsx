import { StatsCard } from "../..";
import { heading } from "../utils/Heading";
import { Section } from "../utils/Section";

const stats = [
  {
    title: "Sales",
    value: 10000,
    bgColor: "bg-green-200",
    titleColor: "text-green-500",
    valueColor: "text-green-700",
    shadow: "shadow-sm shadow-green-500/40",
  },
  {
    title: "Due",
    value: 2500,
    bgColor: "bg-amber-200/70",
    titleColor: "text-amber-500",
    valueColor: "text-amber-700",
    shadow: "shadow-sm shadow-amber-500/40",
  },
  {
    title: "Expenses",
    value: 4000,
    bgColor: "bg-red-200",
    titleColor: "text-red-400",
    valueColor: "text-red-700",
    shadow: "shadow-sm shadow-red-500/40",
  },
];

export default function StatsSection() {
  return (
    <Section>
      {heading("Stats")}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>
    </Section>
  );
}
