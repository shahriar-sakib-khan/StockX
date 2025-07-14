import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function LandingPage() {
  return (
    <div className="wrapper flex h-screen items-center">
      <div className="flex flex-col items-start justify-center gap-4">
        <h1 className="text-3xl font-semibold text-pink-500">
          Project Starter
        </h1>
        <p className="w-[85%] text-xl text-gray-500">
          This is a react vite project starter that has some initial stuff set
          up to avoid doing everything from scratch every time you start a new
          vite project. This project uses tailIwind for styling, react query and
          axios for data fetching. The login and signup pages are now
          functional.
        </p>
        <div className="flex items-center justify-between gap-4 text-lg">
          <NavLink
            to="login"
            className="font-semibold text-blue-500 hover:underline"
          >
            Login
          </NavLink>
          <NavLink
            to="signup"
            className="rounded-md bg-blue-500 px-4 py-1 font-semibold text-white transition-all duration-200 hover:bg-blue-400"
          >
            Signup
          </NavLink>
        </div>
      </div>
      <div>
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
}
