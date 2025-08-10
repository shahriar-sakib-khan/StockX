import { NavLink } from "react-router-dom";
import { SignupForm } from "../../features";

export default function SignupPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mb-4 text-3xl font-bold text-gray-700">
        Create New Account
      </div>
      <SignupForm />
      <NavLink to="/" className="mt-4 text-sm text-gray-600">
        Back to home
      </NavLink>
    </div>
  );
}
