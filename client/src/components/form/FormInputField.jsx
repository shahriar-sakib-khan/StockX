import React from "react";

const FormInputField = React.forwardRef(function FormInputField(
    {
        id = "",
        label,
        type = "text",
        placeholder,
        value,
        autoComplete = "off",
        onChange,
        onKeyDown,
        className = "",
    },
    ref,
) {
    return (
        <div className="flex w-full flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700"
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
                    "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", // Modern Ring Focus
                    "disabled:bg-gray-50 disabled:text-gray-500",
                    "transition-all duration-200 sm:text-sm sm:leading-6",
                    className,
                ].join(" ")}
            />
        </div>
    );
});

export default FormInputField;
