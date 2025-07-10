export default function FormInputField({
  id = '',
  label,
  type = 'text', // text - email - password
  placeholder,
  value,
  ref,
  autocomplete = 'off',
  onChange,
  onKeyDown,
  className = '',
}) {
  return (
    <div className={['flex flex-col gap-1 min-w-60', className].join(' ')}>
      {label && (
        <label htmlFor={id} className="text-md text-gray-700 pl-0.5">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="bg-gray-100 transition-outline border-0 px-[0.5em] py-[0.05em] text-gray-700 duration-[50ms] placeholder:text-gray-500 focus:outline-2 focus:outline-gray-300"
      />
    </div>
  );
}
