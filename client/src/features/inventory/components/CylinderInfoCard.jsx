import { useEffect, useState } from "react";

export default function CylinderInfoCard({ stock, isOpen }) {
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setRender(true); // mount immediately on open
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) setRender(false); // unmount after animation
  };

  if (!render) return null;

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`pointer-events-none h-68 min-w-0 items-center overflow-hidden rounded-xl border border-white bg-gray-300 p-4 pt-10 text-lg shadow-[4px_4px_8px_hsla(0,0%,0%,0.1)] transition-all duration-300 ${
        isOpen ? "w-70" : "w-0"
      }`}
    >
      {isOpen && (
        <>
          <h3 className="mb-2 font-semibold text-nowrap text-gray-800">
            Stock Information
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-left">Type</th>
                <th className="py-1 text-left">Size</th>
                <th className="py-1 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item, idx) => (
                <tr key={idx} className="border-b text-sm last:border-0">
                  <td className="py-1">{item.type}</td>
                  <td className="py-1">{item.size}</td>
                  <td className="py-1 text-right">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
