import { NavLink, useNavigate } from "react-router-dom";
import { Button, FormInputField } from "../../../components";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/authServices";
import useInput from "../../../hooks/useInput";

export default function SignupForm() {
  const navigate = useNavigate();

  // const [firstName, resetFirstName, firstNameObj] = useInput("firstName", "");
  // const [lastName, resetLastName, lastNameObj] = useInput("lastName", "");

  const [username, resetUsername, usernameObj] = useInput("username", "");
  const [email, resetEmail, emailObj] = useInput("email", "");

  // const [address, resetAddress, addressObj] = useInput("address", "");

  const [password, resetPassword, passwordObj] = useInput("password", "");
  const [confirmPassword, resetConfirmPassword, confirmPasswordObj] = useInput(
    "confirmPassword",
    "",
  );
  confirmPassword;

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
    <section className="flex flex-col gap-4 rounded-lg border-0 border-gray-300 bg-white p-8 shadow-lg">
      {/* <div className="flex gap-2">
        <FormInputField
          id="firstName"
          type="text"
          placeholder="Enter first name"
          label="First Name"
          {...firstNameObj}
          className="w-40"
        />
        <FormInputField
          id="lastName"
          type="text"
          placeholder="Enter last name"
          label="Last Name"
          {...lastNameObj}
          className="w-40"
        />
      </div> */}
      <FormInputField
        id="username"
        type="text"
        placeholder="Username"
        label="Username"
        {...usernameObj}
        className="min-w-[35ch]"
      />
      <FormInputField
        id="email"
        type="email"
        placeholder="Enter email"
        label="Email"
        {...emailObj}
      />
      {/* <FormInputField
        id="address"
        type="text"
        placeholder="Enter your address"
        label="Address"
        {...addressObj}
      /> */}
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
        // disabled={!email || password.length < 3 || password !== confirmPassword}
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
