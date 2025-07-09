import { NavLink } from "react-router-dom";
import { Button, FormInput } from "../../../components";

export default function SignupForm() {
  return (
    <form className="flex flex-col gap-2 border-1 border-gray-300 rounded-lg p-4">
      <FormInput id="name" type="text" placeholder="Name" label="Name" />
      <FormInput
        id="email"
        type="email"
        placeholder="Enter email"
        label="Email"
      />
      <FormInput
        id="password"
        type="password"
        placeholder="Enter password"
        label="Password"
      />
      <FormInput
        id="confirm-password"
        type="password"
        placeholder="Confirm password"
        label="Password"
      />
      <Button type="submit" label="Sign up" className="mt-2" />
      <div className="flex gap-2 text-sm mt-1 self-center">
        <span>Already have an account?</span>
        <NavLink to="/login" className="text-blue-500 hover:underline">
          Log in
        </NavLink>
      </div>
    </form>
  );
}
