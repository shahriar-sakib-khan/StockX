import { NavLink, useNavigate } from "react-router-dom";
import { Button, FormInputField } from "../../../components";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/authServices";
import useInput from "../../../hooks/useInput";

export default function SignupForm() {
  const navigate = useNavigate();

  const [firstname, resetFirstname, firstnameObj] = useInput("firstname", "");
  const [lastname, resetLastname, lastnameObj] = useInput("lastname", "");

  const [username, resetUsername, usernameObj] = useInput("username", "");
  const [email, resetEmail, emailObj] = useInput("email", "");

  const [address, resetAddress, addressObj] = useInput("address", "");

  const [password, resetPassword, passwordObj] = useInput("password", "");
  const [confirmPassword, resetConfirmPassword, confirmPasswordObj] = useInput(
    "confirmPassword",
    "",
  );

  const resetValues = () => {
    resetFirstname();
    resetLastname();
    resetEmail();
    resetUsername();
    resetAddress();
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
      firstname,
      lastname,
      username,
      email,
      password,
      location: address,
    });
  };

  return (
    <section className="flex flex-col gap-2 rounded-lg border-1 border-gray-300 p-4">
      <div className="flex gap-2">
        <FormInputField
          id="firstname"
          type="text"
          placeholder="Enter first name"
          label="First Name"
          {...firstnameObj}
          className="w-40"
        />
        <FormInputField
          id="lastname"
          type="text"
          placeholder="Enter last name"
          label="Last Name"
          {...lastnameObj}
          className="w-40"
        />
      </div>
      <FormInputField
        id="username"
        type="text"
        placeholder="Username"
        label="Username"
        {...usernameObj}
      />
      <FormInputField
        id="email"
        type="email"
        placeholder="Enter email"
        label="Email"
        {...emailObj}
      />
      <FormInputField
        id="address"
        type="text"
        placeholder="Enter your address"
        label="Address"
        {...addressObj}
      />
      <FormInputField
        id="password"
        type="password"
        placeholder="Enter password"
        label="Password"
        {...passwordObj}
      />
      <FormInputField
        id="confirmPassword"
        type="password"
        placeholder="Confirm password"
        label="Confirm Password"
        {...confirmPasswordObj}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      {isError && (
        <span className="text-md text-center text-red-400">
          {error?.message || "Account creation failed"}
        </span>
      )}
      <Button
        label="Sign up"
        className="mt-2"
        onClick={handleSubmit}
        isLoading={isPending}
        disabled={!email || password.length < 3 || password !== confirmPassword}
      />
      <div className="mt-1 flex gap-2 self-center text-sm">
        <span>Already have an account? </span>
        <NavLink
          to="/login"
          className="font-semibold text-blue-500 hover:underline"
        >
          Log in
        </NavLink>
      </div>
    </section>
  );
}
