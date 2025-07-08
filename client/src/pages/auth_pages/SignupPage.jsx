import { NavLink } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-2xl">Signup Page</div>
      <NavLink to="/login" className="text-lg hover:underline">
        Log in
      </NavLink>
    </div>
  );
}
