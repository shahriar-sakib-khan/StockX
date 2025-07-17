// import { useRef } from 'react';
import { Button, FormInputField } from "../../../components";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authServices";
// import { useEffect } from 'react';
import useInput from "../../../hooks/useInput";

export default function LoginForm() {
  const navigate = useNavigate();
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
    onSuccess: () => {
      navigate("/dashboard", {
        replace: true,
      });
      resetValues();
    },
  });

  const handleSubmit = () => {
    signIn({ loginIdentifier, password });
  };

  return (
    <section className="flex flex-col gap-2 rounded-lg border-1 border-gray-300 p-4">
      <FormInputField
        id="email"
        type="email"
        label="Email or Username"
        placeholder="Enter email or username"
        {...loginIdentifierObj}
      />
      <FormInputField
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        {...passwordObj}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="mt-2"
      />
      {isError && (
        <span className="text-md text-center text-red-400">
          {error?.message || "Invalid email or password"}
        </span>
      )}
      <Button
        label="Log in"
        className="mt-2"
        disabled={!loginIdentifier || password.length < 3}
        isLoading={isPending}
        onClick={handleSubmit}
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
