import React from "react";

const FormInputField = React.forwardRef(function FormInputField(
  {
    id = "",
    label,
    type = "text", // text - email - password
    placeholder,
    value,
    autoComplete = "off", // on - off
    onChange,
    onKeyDown,
    className = "",
  },
  ref,
) {
  return (
    <div className={["flex w-full flex-col gap-1"].join(" ")}>
      {label && (
        <label htmlFor={id} className="text-md pl-0.5 text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={[
          className,
          "transition-outline border-0 bg-gray-50 px-[0.5em] py-[0.05em] text-gray-700 outline-1 outline-gray-300 placeholder:text-gray-500 focus:bg-white focus:outline-1 focus:outline-blue-300",
        ].join(" ")}
      />
    </div>
  );
});

export default FormInputField;
