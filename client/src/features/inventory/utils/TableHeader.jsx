// Reusable TableHeader component
export const TableHeader = ({ headers }) => (
    <tr>
        {headers.map((h) => (
            <th key={h} className="p-4 text-gray-500">
                {h}
            </th>
        ))}
    </tr>
);
