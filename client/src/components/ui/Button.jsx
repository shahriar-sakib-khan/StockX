export default function Button({
  label = "Button",
  type = "button", // button - reset - submit
  className = "",
  isLoading = false,
  disabled = false,
  onClick = () => {},
  children,
}) {
  return (
    <button
      type={type}
      onClick={disabled || isLoading ? () => {} : onClick}
      disabled={disabled || isLoading}
      className={[
        "cursor-pointer rounded-md bg-blue-400 py-0.5 font-semibold text-white transition-all duration-200 hover:bg-blue-500",
        "disabled:bg-gray-300",
        className,
      ].join(" ")}
    >
      <span
        className={[isLoading ? "animate-pulse font-extrabold" : ""].join(" ")}
      >
        {isLoading ? ". . ." : children || label}
      </span>
    </button>
  );
}
