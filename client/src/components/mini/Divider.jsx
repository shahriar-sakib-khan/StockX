export default function Divider({ text = "Or", className = "" }) {
    if (!text) return <div className={`border-t border-gray-200 ${className}`} />;

    return (
        <div className={`relative flex items-center py-2 ${className}`}>
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 flex-shrink-0 text-xs font-medium uppercase text-gray-500">
                {text}
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>
    );
}
