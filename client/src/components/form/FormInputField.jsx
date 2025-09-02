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
        <div className="flex w-full flex-col gap-1">
            {label && (
                <label
                    htmlFor={id}
                    className="pl-0.5 text-xs font-semibold text-gray-700"
                >
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
                    "rounded border-0 px-3 py-1.5 text-gray-700 outline-1 outline-gray-300 transition-all duration-150 placeholder:text-gray-400 hover:outline-gray-400 focus:bg-white focus:outline-1 focus:outline-blue-300",
                ].join(" ")}
            />
        </div>
    );
});

export default FormInputField;
