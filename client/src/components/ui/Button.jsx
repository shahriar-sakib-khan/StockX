export default function Button({
  label = "Button",
  type = "button", // button - reset - submit
  className = "",
  onClick = () => {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "text-white font-semibold py-0.5 bg-blue-400 hover:bg-blue-500 rounded-md cursor-pointer transition-all duration-200",
        className,
      ].join(" ")}
    >
      {label}
    </button>
  );
}
