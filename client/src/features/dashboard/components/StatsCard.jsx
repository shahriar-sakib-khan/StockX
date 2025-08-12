export default function StatCard({
  title,
  value,
  bgColor = "bg-white",
  titleColor,
  valueColor,
  signColor,
  shadow,
}) {
  return (
    <div
      className={`pointer-events-none flex flex-col rounded-2xl p-4 ${bgColor} ${shadow}`}
    >
      <span className={`text-lg ${titleColor}`}>{title}</span>
      <span className="text-nowrap">
        <span className={`text-2xl font-semibold ${valueColor}`}>
          {value.toLocaleString()}
        </span>{" "}
        <span className={`text-sm ${signColor || valueColor}`}>Taka</span>
      </span>
    </div>
  );
}
