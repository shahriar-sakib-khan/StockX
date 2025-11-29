import { NavLink } from "react-router-dom";
import { LoginForm } from "../../features";
import Logo from "../../components/ui/Logo";

export default function LoginPage() {
    return (
        // Changed h-screen to min-h-screen to handle mobile keyboards better
        // Added px-4 so the card doesn't touch the edges on mobile
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 px-4 py-8">
            <div className="mb-6 text-center">
                {/* Optional: <Logo className="mx-auto mb-4 text-3xl" /> */}
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back!
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Please sign in to your account
                </p>
            </div>

            <LoginForm />

            <NavLink
                to="/"
                className="mt-6 text-sm font-medium text-gray-600 transition hover:text-gray-900 hover:underline"
            >
                ← Back to home
            </NavLink>
        </div>
    );
}
