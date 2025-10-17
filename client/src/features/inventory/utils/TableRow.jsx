import clsx from "clsx";
import { FaRegEdit as EditIcon } from "react-icons/fa";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export const TableRow = ({
    index,
    product,
    type,
    selectedSize,
    selectedType,
    onEdit,
    onDelete,
}) => {
    const fullCount = product ? product.fullCount : 0;
    const emptyCount = product ? product.emptyCount : 0;
    const problemCount = product ? product.problemCount : 0;
    const stockCount = product ? product.stockCount : 0;

    let status = "Out of Stock";
    if (fullCount > 20) status = "In Stock";
    else if (fullCount > 0) status = "Low Stock";

    const statusColors = {
        "In Stock": "bg-emerald-500 text-white",
        "Low Stock": "bg-orange-400/80 text-white",
        "Out of Stock": "bg-red-500/80 text-white",
    };

    return (
        <tr className="border-b border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
            <td data-cell={"#"} className="p-4">
                {index + 1}
            </td>
            <td
                data-cell={"Brand"}
                className="products-center flex flex-nowrap gap-2 p-4"
            >
                <img
                    src={`/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                    alt={
                        product.brandName ? product.brandName : product.itemName
                    }
                    className="h-6 w-6"
                />
                {product.brandName}
            </td>
            <td data-cell={"Status"} className="min-w-35 p-4">
                <span
                    className={clsx(
                        "rounded-full px-3 py-1 text-xs",
                        statusColors[status],
                    )}
                >
                    {status}
                </span>
            </td>
            <td data-cell={"Price"} className="p-4">
                {product.price}
            </td>

            {/* Cylinder exclusive columns */}
            {type === "cylinders" && (
                <td data-cell={"Full"} className="p-4">
                    {fullCount}
                </td>
            )}
            {type === "cylinders" && (
                <td data-cell={"Empty"} className="p-4">
                    {emptyCount}
                </td>
            )}

            {/* Stove and Regulator exclusive columns */}
            {(type === "stoves" || type === "regulators") && (
                <td data-cell={"In Stock"} className="p-4">
                    {stockCount}
                </td>
            )}

            <td data-cell={"Problem"} className="p-4">
                {problemCount}
            </td>

            {/* Actions column */}
            <td data-cell={"Action"} className="flex gap-4">
                <button
                    onClick={() => onEdit(product)}
                    className="rounded-sm p-1 hover:bg-gray-200/70"
                >
                    <EditIcon className="size-5 text-gray-500" />
                </button>
                <button
                    onClick={() => onDelete(product.id)}
                    className="rounded-sm p-1 hover:bg-red-100"
                >
                    <DeleteIcon className="size-5 text-red-400" />
                </button>
            </td>
        </tr>
    );
};
