import { NavLink } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-2xl">Login Page</div>
      <NavLink to="/signup" className="text-lg hover:underline">
        Sign up
      </NavLink>
    </div>
  );
}
