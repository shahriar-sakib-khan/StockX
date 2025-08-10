import { NavLink } from "react-router-dom";
// import logo from "../assets/images/logo.jpg";
import hero_img from "../assets/images/hero.png";
import Logo from "../components/ui/Logo";

const Hero = () => {
  return <div className="relative h-dvh overflow-x-hidden"></div>;
};

export default function LandingPage() {
  return (
    <div>
      <header className="wrapper-l flex h-[calc(var(--navbar-height)*1.5)] items-center text-base">
        <Logo className="text-3xl font-bold" />
        <div className="ml-auto flex gap-2 border-r-1 border-gray-400 px-2">
          <NavLink
            to="login"
            className="rounded px-4 py-1 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
          >
            Pricing
          </NavLink>
          <NavLink
            to="login"
            className="rounded px-4 py-1 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
          >
            Support
          </NavLink>
        </div>
        <div className="flex gap-2 px-2">
          <NavLink
            to="login"
            className="rounded px-4 py-1 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
          >
            Log in
          </NavLink>
          <NavLink
            to="signup"
            className="bg-blue-500 px-4 py-1.25 font-semibold text-white transition-all duration-200 hover:bg-blue-600"
          >
            Sign up
          </NavLink>
        </div>
      </header>
      <main className="wrapper-l grid min-h-[calc(100dvh-var(--navbar-height)*1.5)] grid-cols-2 items-center">
        <div className="flex flex-col items-start justify-center gap-4">
          <h1 className="mb-4 text-5xl font-semibold text-gray-700">
            Manage your shop with ease
          </h1>
          <p className="mb-4 w-[85%] text-xl text-gray-500">
            StockX is everything you need to manage your shop. Your inventory,
            transaction, employees, earning records etc. Everything organized
            for your convenience
          </p>
          <div className="flex items-center justify-between gap-4 text-lg">
            <NavLink
              to="signup"
              className="bg-blue-500 px-6 py-1 font-semibold text-white transition-all duration-200 hover:bg-blue-400"
            >
              Get started
            </NavLink>
          </div>
        </div>
        <div>
          <img src={hero_img} alt="Logo" />
        </div>
      </main>
      <div className="flex h-[100dvh] items-center justify-center bg-blue-300"></div>
      <footer className="h-[30svh] bg-gray-700"></footer>
    </div>
  );
}
