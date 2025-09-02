export default function StatCard({
    Icon,
    title,
    value,
    // bgColor = "bg-white",
    // titleColor,
    // valueColor,
    // signColor,
    // shadow,
}) {
    return (
        <div
            className={`pointer-events-none flex flex-col rounded-2xl bg-white px-[min(10%,2rem)] py-2`}
        >
            <span className={`flex items-center gap-2 text-lg text-gray-400`}>
                {Icon}
                {title}
            </span>
            <span className="mt-1 text-nowrap">
                <span className={`text-3xl font-semibold text-gray-600`}>
                    {value.toLocaleString()}
                </span>{" "}
                <span className={`text-sm`}>Tk</span>
            </span>
        </div>
    );
}
