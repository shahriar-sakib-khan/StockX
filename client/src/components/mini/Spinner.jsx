import clsx from "clsx";
import { useRef, useState, useEffect } from "react";

export default function Spinner({
    size,
    border = "border-4",
    color = "border-t-gray-400",
    trackColor = "border-gray-300",
    className = "",
    ariaLabel = "Loading...",
}) {
    const ref = useRef(null);
    const [Size, setSize] = useState(size);

    useEffect(() => {
        const updateSize = () => {
            if (ref.current) {
                const { width, height } = ref.current.getBoundingClientRect();
                setSize(Math.min(width, height)); // pick smaller side
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div
            ref={ref}
            role="status"
            aria-label={ariaLabel}
            className={clsx("flex items-center justify-center", className)}
        >
            <div
                className={`animate-spin rounded-full ${border} ${trackColor} ${color}`}
                style={{
                    width: Size,
                    height: Size,
                }}
            />
        </div>
    );
}
