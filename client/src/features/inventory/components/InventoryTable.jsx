import { TableHeader } from "../utils/TableHeader";

export default function InventoryTable({ headers, children }) {
    return (
        <table className="w-full border-collapse overflow-hidden rounded-md border bg-white tracking-wider shadow-sm">
            <thead className="bg-gray-200/75 text-left text-sm font-semibold text-gray-600">
                <TableHeader headers={headers} />
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
}
