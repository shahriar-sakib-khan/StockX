import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export default function LandingPage() {
  return (
    <div className="wrapper flex items-center h-screen">
      <div className="flex flex-col items-start justify-center gap-4">
        <h1 className="text-3xl font-semibold text-pink-500">
          Project Starter
        </h1>
        <p className="text-xl w-[85%] text-gray-500">
          This is a react vite project starter that has some initial stuff set
          up to avoid doing everything from scratch every time you start a new
          vite project. This project uses tailIwind for styling, react query and
          axios for data fetching, The login page is functional.
        </p>
        <div className="flex justify-between text-lg gap-4 items-center">
          <NavLink
            to="login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </NavLink>
          <NavLink
            to="signup"
            className="text-white font-semibold bg-blue-500 hover:bg-blue-400 px-4 py-1 rounded-md transition-all duration-200"
          >
            Signup
          </NavLink>
        </div>
      </div>
      <div className="">
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
}
