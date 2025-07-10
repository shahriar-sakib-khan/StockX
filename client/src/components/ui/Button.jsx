export default function Button({
  label = 'Button',
  type = 'button', // button - reset - submit
  className = '',
  isLoading = false,
  disabled = false,
  onClick = () => {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        'text-white font-semibold py-0.5 bg-blue-400 hover:bg-blue-500 rounded-md cursor-pointer transition-all duration-200',
        'disabled:bg-gray-300',
        className,
      ].join(' ')}
    >
      <span
        className={[isLoading ? 'animate-pulse font-extrabold' : ''].join(' ')}
      >
        {isLoading ? '. . .' : label}
      </span>
    </button>
  );
}
