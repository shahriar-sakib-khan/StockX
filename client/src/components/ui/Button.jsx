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
        "primary-button py-1",
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
