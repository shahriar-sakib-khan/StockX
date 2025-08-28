function SelectionCard({ id, name, logo, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`fake-shadow card-shadow flex cursor-pointer flex-col items-center justify-center rounded border border-gray-300 bg-white p-[0.625em] text-base transition-transform duration-150 ease-in hover:-translate-y-[3px] ${isSelected ? "card-selected-shadow" : ""} `}
    >
      <img
        src={logo}
        alt={name}
        className="pointer-events-none h-auto w-[7.1875em] object-contain select-none"
      />
      <p className="mt-[0.625em] text-center text-base whitespace-nowrap">
        {name}
      </p>
    </div>
  );
}

export default SelectionCard;
