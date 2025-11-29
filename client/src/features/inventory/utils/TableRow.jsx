import { useState } from "react";
import clsx from "clsx";
import { FaCartPlus, FaCashRegister, FaPen, FaWrench } from "react-icons/fa";

import {
    TransactionModal,
    DefectedTransactionModal,
    EditPriceModal,
} from "./index";

const TableRow = ({
    index,
    product,
    type,
    selectedSize,
    selectedRegulatorType,
}) => {
    const [modalType, setModalType] = useState(null);
    const [isDefectedModalOpen, setIsDefectedModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

    const fullCount = product?.fullCount ?? 0;
    const emptyCount = product?.emptyCount ?? 0;
    const defectedCount = product?.defectedCount ?? 0;
    const stockCount = product?.stockCount ?? 0;

    // Logic specifically preserved as requested
    let status = "Out of Stock";
    if (fullCount > 20) status = "In Stock";
    else if (fullCount > 0) status = "Low Stock";

    const statusColors = {
        "In Stock": "bg-emerald-100 text-emerald-700",
        "Low Stock": "bg-orange-100 text-orange-700",
        "Out of Stock": "bg-red-100 text-red-700",
    };

    return (
        <>
            <tr className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>

                {/* Brand */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-1">
                            <img
                                src={product.cylinderImage || `/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                                alt={product.brandName}
                                className="h-full w-full object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-[150px]">
                            {product.brandName || product.name || "Unknown"}
                        </span>
                    </div>
                </td>

                {/* ---------- Status ---------- */}
                <td data-cell="Status" className="min-w-35 p-4">
                    <span
                        className={clsx(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            statusColors[status],
                        )}
                    >
                        {status}
                    </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">৳{product.price}</span>
                        <button
                            onClick={() => setIsPriceModalOpen(true)}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                        >
                            <FaPen size={12} />
                        </button>
                    </div>
                </td>

                {/* Counts - Conditional columns based on type */}
                {type === "cylinders" && (
                    <>
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{fullCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{emptyCount}</td>
                    </>
                )}
                {(type === "stoves" || type === "regulators") && (
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{stockCount}</td>
                )}

                {/* Defected */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-red-500">{defectedCount}</span>
                        <button
                            onClick={() => setIsDefectedModalOpen(true)}
                            className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                            <FaWrench size={12} />
                        </button>
                    </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setModalType("buy")}
                            className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                            title="Buy Stock"
                        >
                            <FaCartPlus />
                        </button>
                        <button
                            onClick={() => setModalType("sell")}
                            className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-colors hover:bg-indigo-100"
                            title="Sell Stock"
                        >
                            <FaCashRegister />
                        </button>
                    </div>
                </td>
            </tr>

            {/* --- Modals Render --- */}
            {modalType && (
                <TransactionModal
                    isOpen={!!modalType}
                    onClose={() => setModalType(null)}
                    isBuyModal={modalType === "buy"}
                    type={type}
                    product={product}
                    selectedSize={selectedSize}
                    selectedRegulatorType={selectedRegulatorType}
                />
            )}

            {isDefectedModalOpen && (
                <DefectedTransactionModal
                    isOpen={isDefectedModalOpen}
                    onClose={() => setIsDefectedModalOpen(false)}
                    type={type}
                    product={product}
                    selectedSize={selectedSize}
                    selectedRegulatorType={selectedRegulatorType}
                />
            )}

            {isPriceModalOpen && (
                <EditPriceModal
                    isOpen={isPriceModalOpen}
                    onClose={() => setIsPriceModalOpen(false)}
                    product={product}
                    selectedSize={selectedSize}
                    selectedRegulatorType={selectedRegulatorType}
                />
            )}
        </>
    );
};

export default TableRow;
