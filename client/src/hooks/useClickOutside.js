import { useEffect } from "react";

const useClickOutside = (ref, handler, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;

        const listener = (e) => {
            if (!ref?.current || ref?.current.contains(e.target)) return;
            handler?.(e);
        };
        document.addEventListener("mousedown", listener); // mouse click
        document.addEventListener("touchstart", listener); // touch

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler, enabled]);
};

export default useClickOutside;
