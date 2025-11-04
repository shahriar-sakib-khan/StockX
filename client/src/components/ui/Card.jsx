export function Card({ children, className = "" }) {
    return (
        <div className={`rounded-2xl bg-white p-4 shadow ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }) {
    return (
        <div
            className={`mb-3 flex items-center justify-between border-b pb-2 ${className}`}
        >
            {children}
        </div>
    );
}

export function CardTitle({ children, className = "" }) {
    return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = "" }) {
    return <div className={`space-y-4 ${className}`}>{children}</div>;
}
