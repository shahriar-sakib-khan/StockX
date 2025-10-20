// src/features/cylinders/components/TableRow.jsx
import { useState } from "react";
import clsx from "clsx";

import { FaCartPlus as BuyIcon } from "react-icons/fa";
import { FaCashRegister as SellIcon } from "react-icons/fa";
import TransactionModal from "./TransactionModal";

const TableRow = ({ index, product, type, selectedSize, selectedType }) => {
    const [modalType, setModalType] = useState(null);

    const fullCount = product?.fullCount ?? 0;
    const emptyCount = product?.emptyCount ?? 0;
    const problemCount = product?.problemCount ?? 0;
    const stockCount = product?.stockCount ?? 0;

    let status = "Out of Stock";
    if (fullCount > 20) status = "In Stock";
    else if (fullCount > 0) status = "Low Stock";

    const statusColors = {
        "In Stock": "bg-emerald-500 text-white",
        "Low Stock": "bg-orange-400/80 text-white",
        "Out of Stock": "bg-red-500/80 text-white",
    };

    return (
        <>
            <tr className="border-b border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                <td data-cell="#" className="p-4">
                    {index + 1}
                </td>
                <td
                    data-cell="Brand"
                    className="products-center flex flex-nowrap gap-2 p-4"
                >
                    <img
                        src={`/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                        alt={product.brandName || product.name}
                        className="h-6 w-6"
                    />
                    {product.name === "Double Burner Stove" && (
                        <img
                            src={`/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                            alt={product.brandName || product.name}
                            className="h-6 w-6"
                        />
                    )}
                    {product.name || product.brandName}
                </td>
                <td data-cell="Status" className="min-w-35 p-4">
                    <span
                        className={clsx(
                            "rounded-full px-3 py-1 text-xs",
                            statusColors[status],
                        )}
                    >
                        {status}
                    </span>
                </td>
                <td data-cell="Price" className="p-4">
                    {product.price}
                </td>

                {type === "cylinders" && (
                    <>
                        <td data-cell="Full" className="p-4">
                            {fullCount}
                        </td>
                        <td data-cell="Empty" className="p-4">
                            {emptyCount}
                        </td>
                    </>
                )}

                {(type === "stoves" || type === "regulators") && (
                    <td data-cell="In Stock" className="p-4">
                        {stockCount}
                    </td>
                )}

                <td data-cell="Problem" className="p-4">
                    {problemCount}
                </td>

                {/* Actions */}
                <td data-cell="Action" className="flex gap-4">
                    <button
                        onClick={() => setModalType("buy")}
                        className="rounded-sm p-1 hover:bg-green-100"
                    >
                        <BuyIcon className="size-5 text-green-500" />
                    </button>
                    <button
                        onClick={() => setModalType("sell")}
                        className="rounded-sm p-1 hover:bg-blue-100"
                    >
                        <SellIcon className="size-5 text-blue-500" />
                    </button>
                </td>
            </tr>

            {modalType && (
                <TransactionModal
                    type={type}
                    isBuyModal={modalType === "buy"}
                    isOpen={!!modalType}
                    onClose={() => setModalType(null)}
                    product={product}
                    selectedSize={selectedSize}
                    selectedType={selectedType}
                />
            )}
        </>
    );
};

export default TableRow;
