import { StatsSection } from "../features";
import { heading } from "../features/dashboard/utils/Heading";
import { Section } from "../features/dashboard/utils/Section";

export default function Dashboard() {
  return (
    <div className="h-[var(--height-with-nav-titlebar)] overflow-auto bg-gray-100">
      <StatsSection />
      <Section>
        {heading("Options")}
        <div className="grid h-60 grid-cols-3 gap-4">
          <div className="bg-green-100"></div>
          <div className="bg-green-200"></div>
          <div className="bg-green-100"></div>
          <div className="bg-green-200"></div>
          <div className="bg-green-100"></div>
          <div className="bg-green-200"></div>
        </div>
      </Section>
      <Section>
        {heading("Graph")}
        <div className="h-40 bg-blue-100"></div>
      </Section>
      <Section>
        {heading("Recents")}
        <div className="flex flex-col gap-4">
          <div className="h-5 bg-red-100"></div>
          <div className="h-5 bg-red-100"></div>
          <div className="h-5 bg-red-100"></div>
          <div className="h-5 bg-red-100"></div>
        </div>
      </Section>
      <Section>
        {heading("Inventory Overview")}
        <div className="grid h-30 grid-cols-6 gap-2">
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
          <div className="bg-blue-200"></div>
        </div>
      </Section>
      <Section>
        {heading("Customer Shops")}
        <div className="grid grid-cols-[1rem_1fr_1rem] gap-2">
          <button className="flex self-center px-0.5 font-bold">{`<`}</button>
          <div className="grid h-30 grid-cols-4 gap-2">
            <div className="h-30 bg-purple-200"></div>
            <div className="h-30 bg-purple-200"></div>
            <div className="h-30 bg-purple-200"></div>
            <div className="h-30 bg-purple-200"></div>
          </div>
          <button className="flex self-center px-0.5 font-bold">{`>`}</button>
        </div>
        <button className="mt-2 w-full bg-green-100 text-center text-green-700">
          View all
        </button>
      </Section>
      <Section>
        {heading("Vehicles")}
        <div className="grid grid-cols-[1rem_1fr_1rem] gap-2">
          <button className="flex self-center px-0.5 font-bold">{`<`}</button>
          <div className="grid h-30 grid-cols-4 gap-2">
            <div className="h-30 bg-red-200"></div>
            <div className="h-30 bg-red-200"></div>
            <div className="h-30 bg-red-200"></div>
            <div className="h-30 bg-red-200"></div>
          </div>
          <button className="flex self-center px-0.5 font-bold">{`>`}</button>
        </div>
        <button className="mt-2 w-full bg-green-100 text-center text-green-700">
          View all
        </button>
      </Section>
    </div>
  );
}
