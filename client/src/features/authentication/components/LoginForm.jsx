import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle as GoogleIcon } from "react-icons/fc";

import useInput from "@/hooks/useInput";
import { login } from "../services/authServices";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button, Divider, FormInputField } from "@/components";

export default function LoginForm() {
    const navigate = useNavigate();
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    const [loginIdentifier, resetLoginIdentifier, loginIdentifierObj] = useInput("loginIdentifier", "");
    const [password, resetPassword, passwordObj] = useInput("loginPassword", "");

    const {
        mutate: signIn,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await initializeAuth();
            navigate("/stores", { replace: true });
            resetLoginIdentifier();
            resetPassword();
        },
    });

    const handleSubmit = () => {
        signIn({ loginIdentifier, password });
    };

    return (
        // Card Container:
        // - w-full max-w-md: Ensures it's responsive but doesn't get too wide on desktop
        // - p-6 sm:p-8: Smaller padding on mobile, larger on desktop
        <section className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">

            {/* Google Button */}
            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
            >
                <GoogleIcon className="text-xl" />
                <span>Continue with Google</span>
            </button>

            <Divider text="Or" />

            {/* Inputs Container */}
            <div className="flex flex-col gap-4">
                <FormInputField
                    id="email"
                    type="text"
                    label="Email or Username"
                    placeholder="Enter email or username"
                    {...loginIdentifierObj}
                    className="w-full" // Fluid width
                />

                <div>
                    <FormInputField
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                        {...passwordObj}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full"
                    />
                    {/* Forgot Password Link */}
                    <div className="mt-1 flex justify-end">
                        <NavLink
                            to="/forgot-password"
                            className="text-xs font-medium text-blue-600 hover:text-blue-500"
                        >
                            Forgot password?
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {isError && (
                <div className="rounded bg-red-50 p-3 text-center text-sm text-red-500">
                    {error?.message || error?.errors?.[0]?.message || "Invalid credentials"}
                </div>
            )}

            {/* Submit Button */}
            <Button
                label="Log in"
                isLoading={isPending}
                // Basic validation: disable if empty
                disabled={!loginIdentifier || !password}
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="w-full"
            />

            {/* Sign Up Footer */}
            <div className="flex justify-center gap-1.5 text-sm text-gray-600">
                <span>Don't have an account?</span>
                <NavLink
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                >
                    Sign up
                </NavLink>
            </div>
        </section>
    );
}
