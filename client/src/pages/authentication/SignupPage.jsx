import { NavLink } from "react-router-dom";
import { SignupForm } from "../../features";

export default function SignupPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mb-4 text-2xl font-semibold text-gray-700">
        Create New Account
      </div>
      <SignupForm />
      <NavLink to="/" className="mt-4 text-sm text-gray-600">
        Back to home
      </NavLink>
    </div>
  );
}
