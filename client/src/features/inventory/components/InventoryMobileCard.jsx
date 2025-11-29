import { useState } from "react";
import clsx from "clsx";
import { FaCartPlus, FaCashRegister, FaPen, FaWrench, FaExclamationTriangle } from "react-icons/fa";
import {
    TransactionModal,
    DefectedTransactionModal,
    EditPriceModal
} from "../utils";

export default function InventoryMobileCard({ product, type, selectedSize, selectedRegulatorType }) {
    // Modal States
    const [modalType, setModalType] = useState(null);
    const [isDefectedModalOpen, setIsDefectedModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

    // Data
    const fullCount = product?.fullCount ?? 0;
    const emptyCount = product?.emptyCount ?? 0;
    const defectedCount = product?.defectedCount ?? 0;
    const stockCount = product?.stockCount ?? 0;

    // Status Indicator Color
    let statusColor = "bg-red-500";
    if (fullCount > 20) statusColor = "bg-emerald-500";
    else if (fullCount > 0) statusColor = "bg-amber-500";

    return (
        <>
            <div className="relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-all active:border-indigo-300">

                {/* 1. Image & Status Dot */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gray-100 p-1">
                    <img
                        src={product.cylinderImage || `/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                        alt={product.brandName}
                        className="h-full w-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* Status Dot */}
                    <span className={clsx("absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm", statusColor)} />
                </div>

                {/* 2. Main Info (Middle) */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    {/* Name */}
                    <h3 className="truncate text-sm font-bold text-gray-800">
                        {product.brandName || product.name}
                    </h3>

                    {/* Meta Row: Price & Defect Action */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPriceModalOpen(true)}
                            className="flex items-center gap-1 rounded bg-gray-50 px-1.5 py-0.5 text-xs font-semibold text-gray-700 active:text-indigo-600 active:bg-gray-200"
                        >
                            ৳ {product.price} <FaPen size={8} className="text-gray-400" />
                        </button>

                        {/* Defected Management Button */}
                        <button
                            onClick={() => setIsDefectedModalOpen(true)}
                            className="flex items-center gap-1 rounded bg-orange-50 px-1.5 py-0.5 text-xs font-semibold text-orange-700 active:bg-orange-100"
                        >
                            <FaWrench size={9} /> Defect
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-2 text-[11px] leading-none">
                        {type === "cylinders" ? (
                            <>
                                <span className="rounded bg-emerald-50 px-1.5 py-1 font-medium text-emerald-800 border border-emerald-100">
                                    <b>{fullCount}</b> Full
                                </span>
                                <span className="rounded bg-gray-50 px-1.5 py-1 font-medium text-gray-600 border border-gray-100">
                                    <b>{emptyCount}</b> Empty
                                </span>
                                <span className={`rounded px-1.5 py-1 font-medium border ${defectedCount > 0 ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                                    {defectedCount > 0 && <FaExclamationTriangle className="inline mr-1 text-[9px]"/>}
                                    <b>{defectedCount}</b> Def
                                </span>
                            </>
                        ) : (
                            <span className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-700">
                                <b>{stockCount}</b> in Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* 3. Actions (Right Side - Vertical Stack) */}
                <div className="flex flex-col gap-2 border-l border-gray-100 pl-2">
                    <button
                        onClick={() => setModalType("buy")}
                        className="flex h-9 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 transition-colors active:bg-emerald-100 active:text-emerald-700"
                    >
                        <FaCartPlus size={16} />
                    </button>
                    <button
                        onClick={() => setModalType("sell")}
                        className="flex h-9 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 transition-colors active:bg-indigo-100 active:text-indigo-700"
                    >
                        <FaCashRegister size={16} />
                    </button>
                </div>
            </div>

            {/* --- Modals --- */}
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
}
