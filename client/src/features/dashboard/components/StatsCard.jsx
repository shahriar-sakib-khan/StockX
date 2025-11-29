export default function StatsCard({ Icon, title, value, colorClass, borderClass }) {
    return (
        // Added h-full to stretch vertically
        <div className={`flex h-full flex-col justify-center rounded-xl border bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 ${borderClass}`}>
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
                    {Icon}
                </div>
                <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
            <div className="mt-3">
                <span className="text-2xl font-bold text-gray-800">
                    ৳ {value.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
