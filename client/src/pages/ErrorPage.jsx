import { NavLink } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="text-2xl font-semibold">Oops</div>
            <div className="text-2xl">Something unexpected happened</div>

            <NavLink to="/" className="mt-8 text-gray-500 underline">
                Go Home
            </NavLink>
        </div>
    );
}
