export default function InventoryTable({ headers, children }) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {headers.map((h, i) => (
                        <th
                            key={i}
                            className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {children}
            </tbody>
        </table>
    );
}
