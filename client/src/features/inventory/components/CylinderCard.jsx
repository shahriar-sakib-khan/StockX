export default function CylinderCard({ brand, onToggle, isOpen }) {
  return (
    <card className="card-shadow relative z-[1] flex h-68 w-52 flex-col items-center overflow-hidden rounded-xl border border-gray-300 bg-white pt-10 text-lg shadow-[4px_4px_8px_hsla(0,0%,0%,0.1)] transition-transform duration-200">
      {/* hover:-translate-y-[1px] */}
      <span className="absolute top-0 left-0 rounded-tl-xl bg-gray-100 px-2 py-1 text-lg text-gray-600">
        Stock: {brand.stockCount}
      </span>
      <img
        src={brand.imageUrl}
        alt={`${brand.name} cylinder`}
        className="h-40 w-auto object-contain"
      />
      <h3 className="mt-2 px-4 text-base font-semibold">{brand.name}</h3>
      <button
        onClick={onToggle}
        className="mt-1 w-full grow-1 bg-gray-200 text-base font-normal"
      >
        {isOpen ? "Hide Details" : "View Details"}
      </button>
    </card>
  );
}
