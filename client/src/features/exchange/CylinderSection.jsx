import { Button } from "@/components";

export default function CylinderSection({
    title,
    color,
    cylinders,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className={`rounded-2xl border border-${color}-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md`}
        >
            <h2 className={`mb-5 text-xl font-semibold text-${color}-600`}>
                {title}
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full border-collapse text-[15px] text-gray-700">
                    {/* ---------- Table Header ---------- */}
                    <thead
                        className={`bg-${color}-50 border-b-2 border-${color}-200 text-gray-700`}
                    >
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold tracking-wide uppercase">
                                Brand
                            </th>
                            <th className="px-3 py-3 text-left font-semibold tracking-wide uppercase">
                                Size
                            </th>
                            <th className="px-3 py-3 text-left font-semibold tracking-wide uppercase">
                                Type
                            </th>
                            <th className="px-3 py-3 text-left font-semibold tracking-wide uppercase">
                                Count
                            </th>
                            <th className="w-[130px] px-3 py-3 text-center font-semibold tracking-wide uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* ---------- Table Body ---------- */}
                    <tbody>
                        {cylinders.map((c, i) => (
                            <tr
                                key={c.id}
                                className={`${
                                    i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                                } hover:bg-${color}-50/30 transition-all`}
                            >
                                {/* Brand */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={c.brand.brandImage}
                                            alt={c.brand.name}
                                            className="h-8 w-8 rounded-md border border-gray-200 object-contain"
                                        />
                                        <span className="font-medium text-gray-800 capitalize">
                                            {c.brand.name}
                                        </span>
                                    </div>
                                </td>

                                {/* Other Columns */}
                                <td className="px-3 py-4">{c.size}</td>
                                <td className="px-3 py-4">{c.type}</td>
                                <td className="px-3 py-4">{c.count}</td>

                                {/* Actions */}
                                <td className="space-x-1 px-3 py-4 text-center whitespace-nowrap">
                                    <Button
                                        label="Edit"
                                        className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                                        onClick={() => onEdit(c)}
                                    />
                                    <Button
                                        label="×"
                                        className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                                        onClick={() => onDelete(c.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Button */}
            <button
                onClick={onAdd}
                className={`mt-5 flex w-full items-center justify-center rounded-xl border-2 border-dashed border-${color}-300 py-6 text-5xl font-thin text-${color}-400 hover:text-${color}-500 hover:border-${color}-400 transition-all`}
            >
                ＋
            </button>
        </div>
    );
}
