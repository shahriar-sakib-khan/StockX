export default function Divider({ text = "Or", className = "" }) {
    const gap = text === "" ? "gap-0" : "gap-2";
    return (
        <div className={`flex w-full items-center ${gap} ${className}`}>
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-xs text-gray-400">{text}</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    );
}
