import { Button, FormInput } from "../../../components";
import { NavLink } from "react-router-dom";

export default function LoginForm() {
  return (
    <form className="flex flex-col gap-2 border-1 border-gray-300 rounded-lg p-4">
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
        className="mt-2"
      />
      <Button type="submit" label="Log in" className="mt-2" />
      <div className="flex gap-2 text-sm mt-1 self-center">
        <span>Don't have an account?</span>
        <NavLink to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </NavLink>
      </div>
    </form>
  );
}
