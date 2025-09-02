import { NavLink } from "react-router-dom";
import { LoginForm } from "../../features";

export default function LoginPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
            <div className="mb-4 text-3xl font-bold text-gray-700">
                Welcome back!
            </div>
            <LoginForm />
            <NavLink to="/" className="mt-4 text-sm text-gray-600">
                Back to home
            </NavLink>
        </div>
    );
}
