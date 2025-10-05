import clsx from "clsx";
import { FaRegEdit as EditIcon } from "react-icons/fa";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export const TableRow = ({
    brand,
    index,
    selectedSize,
    selectedType,
    headers,
    type,
    onEdit,
    onDelete,
}) => {
    let items = [];
    if (type === "cylinders") items = brand.cylinders || [];
    if (type === "stoves") items = brand.stoves || [];
    if (type === "regulators") items = brand.regulators || [];

    const selectedItem =
        items.find(
            (i) => String(i.size) === String(selectedSize) && i.type === selectedType,
        ) ||
        items.find((i) => String(i.size) === String(selectedSize)) ||
        items[0];

    const quantity = selectedItem ? selectedItem.quantity : 0;

    let status = "Out of Stock";
    if (quantity > 20) status = "In Stock";
    else if (quantity > 0) status = "Low Stock";

    const statusColors = {
        "In Stock": "bg-emerald-500 text-white",
        "Low Stock": "bg-orange-400/80 text-white",
        "Out of Stock": "bg-red-500/80 text-white",
    };

    return (
        <tr className="border-b border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
            <td data-cell={headers[0]} className="p-4">
                {index + 1}
            </td>
            <td
                data-cell={headers[1]}
                className="flex flex-nowrap items-center gap-2 p-4"
            >
                <img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className="h-6 w-6"
                />
                {brand.name}
            </td>
            <td data-cell={headers[2]} className="min-w-35 p-4">
                <span
                    className={clsx(
                        "rounded-full px-3 py-1 text-xs",
                        statusColors[status],
                    )}
                >
                    {status}
                </span>
            </td>
            <td data-cell={headers[3]} className="p-4">
                {quantity}
            </td>
            <td data-cell={headers[4]} className="p-4">
                {brand.stockCount}
            </td>
            {/* Action column */}
            <td data-cell={headers[5]} className="flex gap-4">
                <button
                    onClick={() => onEdit(brand)}
                    className="rounded-sm p-1 hover:bg-gray-200/70"
                >
                    <EditIcon className="size-5 text-gray-500" />
                </button>
                <button
                    onClick={() => onDelete(brand.id)}
                    className="rounded-sm p-1 hover:bg-red-100"
                >
                    <DeleteIcon className="size-5 text-red-400" />
                </button>
            </td>
        </tr>
    );
};
