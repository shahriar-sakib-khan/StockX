import clsx from "clsx";

export const TableRow = ({
  brand,
  index,
  selectedSize,
  selectedType,
  headers,
  onEdit,
  onDelete,
}) => {
  const cylinder = brand.cylinders.find(
    (c) => c.size === Number(selectedSize) && c.type === selectedType,
  );

  const quantity = cylinder ? cylinder.quantity : 0;

  let status = "Out of Stock";
  if (quantity > 20) status = "In Stock";
  else if (quantity > 0) status = "Low Stock";

  const statusColors = {
    "In Stock": "bg-green-500 text-white",
    "Low Stock": "bg-yellow-500 text-white",
    "Out of Stock": "bg-red-500 text-white",
  };

  return (
    <tr className="border-b border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
      <td data-cell={headers[0]} className="p-4">
        {index + 1}
      </td>
      <td data-cell={headers[1]} className="flex items-center gap-2 p-4">
        <img src={brand.imageUrl} alt={brand.name} className="h-6 w-6" />
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
      <td data-cell={headers[5]} className="flex gap-2 p-4">
        <button
          onClick={() => onEdit(brand)}
          className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(brand.id)}
          className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
