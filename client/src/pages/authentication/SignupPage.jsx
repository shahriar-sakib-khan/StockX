import { NavLink } from "react-router-dom";
import { SignupForm } from "../../features";

export default function SignupPage() {
    return (
        // Wrapper: min-h-screen (prevents cut-off), px-4 (mobile padding), center alignment
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 px-4 py-8">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Create New Account
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Join us to manage your shop efficiently
                </p>
            </div>

            <SignupForm />

            <NavLink
                to="/"
                className="mt-6 text-sm font-medium text-gray-600 transition hover:text-gray-900 hover:underline"
            >
                ← Back to home
            </NavLink>
        </div>
    );
}
