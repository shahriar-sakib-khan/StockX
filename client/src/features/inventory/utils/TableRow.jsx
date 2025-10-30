import { useState } from "react";
import clsx from "clsx";

import { FaCartPlus as BuyIcon } from "react-icons/fa";
import { FaCashRegister as SellIcon } from "react-icons/fa";
import { FaPencilAlt as EditIcon } from "react-icons/fa";
import { FaWrench as DefectedIcon } from "react-icons/fa";

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
                {/* ---------- Index ---------- */}
                <td data-cell="#" className="p-4">
                    {index + 1}
                </td>

                {/* ---------- Brand ---------- */}
                <td
                    data-cell="Brand"
                    className="flex items-center gap-2 p-4 whitespace-nowrap"
                >
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        <img
                            src={
                                product.cylinderImage ||
                                `/src/assets/images/${type.replace(/s$/, "")}Model.png`
                            }
                            alt={product.brandName || product.name}
                            className="h-6 w-6 object-contain"
                            loading="lazy"
                        />
                    </div>
                    <span className="max-w-[120px] truncate">
                        {product.brandName || product.name}
                    </span>
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

                {/* ---------- Price ---------- */}
                <td data-cell="Price" className="flex items-center gap-2 p-4">
                    <span>{product.price}</span>
                    <button
                        onClick={() => setIsPriceModalOpen(true)}
                        className="rounded-sm p-1 hover:bg-blue-100"
                    >
                        <EditIcon className="size-4 text-blue-500" />
                    </button>
                </td>

                {/* ---------- Counts ---------- */}
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

                {/* ---------- Defected ---------- */}
                <td
                    data-cell="Defected"
                    className="flex items-center gap-2 p-4 whitespace-nowrap"
                >
                    <span>{defectedCount}</span>
                    <button
                        onClick={() => setIsDefectedModalOpen(true)}
                        className="rounded-sm p-1 hover:bg-yellow-100"
                    >
                        <DefectedIcon className="size-4 text-yellow-500" />
                    </button>
                </td>

                {/** Extra td here to maintain the table structure */}
                <td data-cell="Action" className="flex gap-4"></td>

                {/* ---------- Actions ---------- */}
                <td
                    data-cell="Action"
                    className="rounded-sm p-1 hover:bg-yellow-100"
                >
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

            {/* ---------- Modals ---------- */}
            {modalType && (
                <TransactionModal
                    type={type}
                    isBuyModal={modalType === "buy"}
                    isOpen={!!modalType}
                    onClose={() => setModalType(null)}
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
