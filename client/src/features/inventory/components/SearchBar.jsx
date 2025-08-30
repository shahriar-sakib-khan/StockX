import { IoIosSearch } from "react-icons/io";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <form
      action="search"
      className={`relative flex items-center ${className}`}
      onSubmit={(e) => e.preventDefault()} // prevent page reload
    >
      <IoIosSearch className="absolute left-2.5 text-lg text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded bg-gray-50 py-2 pr-3 pl-8 text-sm text-gray-700 shadow-sm outline outline-gray-300 focus:bg-white focus:outline-3"
      />
    </form>
  );
}
