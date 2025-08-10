export default function Dashboard() {
  const heading = (headingText) => (
    <h2 className="mb-4 inline-block px-4 text-xl font-semibold text-gray-500">
      {headingText}
      {/* {headingText.toUpperCase()} */}
    </h2>
  );

  const Section = ({ children }) => {
    return <section className="flex flex-col p-4">{children}</section>;
  };

  const StatsSection = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col rounded-2xl bg-green-200 p-4">
          <span className="text-xl font-semibold text-green-700">Sales</span>
          <span className="text-nowrap">
            <span className="text-2xl text-green-600">10,000</span>{" "}
            <span className="text-sm text-green-700">Taka</span>
          </span>
        </div>
        <div className="bg-red-200"></div>
        <div className="bg-amber-200"></div>
      </div>
    );
  };

  return (
    <div className="h-[var(--height-with-nav)] overflow-auto bg-gray-100">
      <Section>
        {heading("Stats")}
        {StatsSection()}
      </Section>
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
      {/* <h1 className="text-3xl font-semibold text-gray-700">
        Hello {username || "there"}
      </h1>
      {username ? (
        <p className="text-xl text-gray-500">
          You are logged in as "{roles || "user"}"
        </p>
      ) : (
        <p className="text-xl text-gray-500">You are not logged in</p>
      )} */}
    </div>
  );
}
