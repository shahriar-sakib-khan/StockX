import { NavLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Landing Page</h1>
      <div className="flex justify-between text-lg gap-4">
        <NavLink to="login" className="hover:underline">
          Login
        </NavLink>
        <NavLink to="signup" className="hover:underline">
          Signup
        </NavLink>
      </div>
    </div>
  );
}
