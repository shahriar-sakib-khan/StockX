import { OptionsSection, StatsSection } from "../features";
import { heading } from "../features/dashboard/utils/Heading";
import { Section } from "../features/dashboard/utils/Section";
import { useUIStore } from "../stores/useUIStore";

export default function Dashboard() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div className="grid h-[var(--height-with-nav-titlebar)] grid-cols-[auto_1fr] bg-amber-50">
      <main
        className={`overflow-auto bg-gray-50 transition-all ${isSidebarOpen ? "w-[var(--width-with-sidebar-lg-rightbar)]" : "w-[var(--width-with-sidebar-sm-rightbar)]"}`}
      >
        <StatsSection />
        <OptionsSection />

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
      </main>
      <aside className="flex w-[var(--rightbar-width)] flex-col border-l border-gray-300 bg-white">
        <Section>
          <div className="flex flex-col bg-gray-100 py-3">
            {heading("Cashbox")}
            <span className="w-full text-right text-nowrap">
              <span className={`text-3xl font-semibold text-gray-600`}>
                {"15,000".toLocaleString()}
              </span>{" "}
              <span className={`text-sm`}>Tk</span>
            </span>
          </div>
        </Section>
        <Section>
          <div className="h-30 bg-gray-100"></div>
        </Section>
      </aside>
    </div>
  );
}
