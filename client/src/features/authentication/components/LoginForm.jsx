import { Button, FormInputField } from "../../../components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authServices";
import useInput from "../../../hooks/useInput";
import { useAuthStore } from "../../../stores/useAuthStore-deprecated";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [loginIdentifier, resetLoginIdentifier, loginIdentifierObj] = useInput(
    "loginIdentifier",
    "",
  ); // email or username
  const [password, resetPassword, passwordObj] = useInput("loginPassword", "");

  const resetValues = () => {
    resetLoginIdentifier();
    resetPassword();
  };

  const {
    mutate: signIn,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      // Initialize auth to fetch the current user and update Zustand state
      await initializeAuth();

      // Redirect to the original page or fallback
      const redirectUrl = location.state?.redirectUrl || "/dashboard";
      navigate(redirectUrl, { replace: true });

      // Reset form inputs
      resetValues();
    },
  });

  const handleSubmit = () => {
    signIn({ loginIdentifier, password });
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border-0 border-gray-300 bg-white p-8 shadow-lg">
      <div className="w-full rounded border-1 border-gray-200 py-2 text-center">
        {/* <span className="mr-2 rounded bg-gray-300 px-2"></span> */}
        <span>Continue with Google</span>
      </div>
      <FormInputField
        id="email"
        type="email"
        label="Email or Username"
        placeholder="Enter email or username"
        {...loginIdentifierObj}
        className="min-w-[30ch]"
      />
      <FormInputField
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        {...passwordObj}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      {isError && (
        <span className="text-md text-center text-red-400">
          {error?.message || "Invalid email or password"}
        </span>
      )}
      <Button
        label="Log in"
        className="mt-2"
        // disabled={!loginIdentifier || password.length < 3}
        isLoading={isPending}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      />
      <div className="mt-1 flex gap-2 self-center text-sm">
        <span>Don't have an account? </span>
        <NavLink
          to="/signup"
          className="font-semibold text-blue-500 hover:underline"
        >
          Sign up
        </NavLink>
      </div>
    </section>
  );
}
