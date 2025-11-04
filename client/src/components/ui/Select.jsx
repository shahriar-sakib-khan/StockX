import { useState } from "react";

export function Select({ children, onValueChange, defaultValue }) {
    const [value, setValue] = useState(defaultValue || "");

    const handleChange = (e) => {
        setValue(e.target.value);
        onValueChange?.(e.target.value);
    };

    return (
        <select
            value={value}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
            {children}
        </select>
    );
}

export function SelectItem({ value, children }) {
    return <option value={value}>{children}</option>;
}

export function SelectTrigger({ children }) {
    return children;
}

export function SelectValue({ placeholder }) {
    return <option value="">{placeholder}</option>;
}

export function SelectContent({ children }) {
    return children;
}
