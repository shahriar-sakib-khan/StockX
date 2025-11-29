import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { Button, FormInputField } from "@/components";
import { register } from "../services/authServices";
import useInput from "@/hooks/useInput";

export default function SignupForm() {
    const navigate = useNavigate();

    // const [firstName, resetFirstName, firstNameObj] = useInput("firstName", "");
    // const [lastName, resetLastName, lastNameObj] = useInput("lastName", "");

    const [username, resetUsername, usernameObj] = useInput("username", "");
    const [email, resetEmail, emailObj] = useInput("email", "");

    // const [address, resetAddress, addressObj] = useInput("address", "");

    const [password, resetPassword, passwordObj] = useInput("password", "");
    const [confirmPassword, resetConfirmPassword, confirmPasswordObj] = useInput("confirmPassword", "");

    const resetValues = () => {
        // resetFirstName();
        // resetLastName();
        resetEmail();
        resetUsername();
        // resetAddress();
        resetPassword();
        resetConfirmPassword();
    };

    const {
        mutate: createAccount,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/login", {
                replace: true,
            });
            resetValues();
        },
    });

    const handleSubmit = () => {
        createAccount({
            // firstName,
            // lastName,
            username,
            email,
            password,
            // address,
        });
    };

    return (
        // Card Container: Matches Login Form style
        <section className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">

            {/* Input Fields Container */}
            <div className="flex flex-col gap-4">
                {/* Note: If you uncomment firstName/lastName later, wrap them in a
                  <div className="grid grid-cols-2 gap-2"> for side-by-side layout
                */}

                <FormInputField
                    id="username"
                    type="text"
                    placeholder="Username"
                    label="Username"
                    {...usernameObj}
                    className="w-full" // Fluid width
                />

                <FormInputField
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    label="Email"
                    {...emailObj}
                    className="w-full"
                />

                <FormInputField
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    label="Password"
                    {...passwordObj}
                    className="w-full"
                />

                <FormInputField
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    label="Confirm Password"
                    {...confirmPasswordObj}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full"
                />
            </div>

            {/* Error Message */}
            {isError && (
                <div className="rounded bg-red-50 p-3 text-center text-sm text-red-500">
                    {error?.message || error?.errors?.[0]?.message || "Account creation failed"}
                </div>
            )}

            {/* Submit Button */}
            <Button
                label="Sign up"
                className="w-full"
                onClick={handleSubmit}
                isLoading={isPending}
                // Optional: Basic validation to prevent submission of empty forms
                // disabled={!username || !email || !password || password !== confirmPassword}
            />

            {/* Login Link Footer */}
            <div className="flex justify-center gap-1.5 text-sm text-gray-600">
                <span>Already have an account?</span>
                <NavLink
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                >
                    Log in
                </NavLink>
            </div>
        </section>
    );
}
