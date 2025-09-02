import { NavLink } from "react-router-dom";
import hero_img from "../../assets/images/hero.webp";
import Logo from "../../components/ui/Logo";
import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect } from "react";
import { FaArrowRight as RightArrowIcon } from "react-icons/fa6";

const Header = () => {
    return (
        <header className="wrapper-l flex h-[calc(var(--navbar-height)*1.5)] items-center text-base">
            <Logo className="text-2xl font-bold" />
            <div className="mr-2 ml-auto flex gap-2 border-gray-200 text-sm">
                <NavLink
                    to="pricing"
                    className="rounded px-4 py-2 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
                >
                    Pricing
                </NavLink>
                <NavLink
                    to="services"
                    className="rounded px-4 py-2 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
                >
                    Services
                </NavLink>
                <NavLink
                    to="support"
                    className="rounded px-4 py-2 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
                >
                    Support
                </NavLink>
            </div>
            <span className="h-6 w-0.5 bg-gray-300/70"></span>
            <div className="mx-2 flex gap-2 text-sm">
                <NavLink
                    to="login"
                    className="rounded px-4 py-2 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100"
                >
                    Log in
                </NavLink>
                <NavLink
                    to="signup"
                    className="rounded-md bg-blue-400 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-400/90"
                >
                    Sign up
                </NavLink>
            </div>
        </header>
    );
};

const Hero = () => {
    return (
        <section
            role="region"
            className="wrapper-l grid min-h-[calc(100dvh-var(--navbar-height)*1.5)] grid-cols-2 items-center"
        >
            <div className="flex flex-col items-start justify-center gap-4">
                <h1 className="mb-4 text-4xl font-semibold text-gray-700">
                    Manage your shop with ease
                </h1>
                <p className="mb-4 w-[85%] text-lg text-gray-500">
                    StockX is everything you need to manage your shop. Your
                    inventory, transaction, employees, earning records etc.
                    Everything organized for your convenience
                </p>
                <div className="flex items-center justify-between gap-4 text-base">
                    <NavLink
                        to="signup"
                        className="flex items-center gap-3 rounded-md bg-blue-400 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-400/90"
                    >
                        <span>Get started </span>
                        <RightArrowIcon className="text-xl" />
                    </NavLink>
                </div>
            </div>
            <div>
                <img src={hero_img} alt="Logo" />
            </div>
        </section>
    );
};

export default function LandingPage() {
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        clearUser();
    }, [clearUser]);

    return (
        <div>
            <Header />
            <main>
                <Hero />
                <section
                    role="region"
                    className="flex h-[100dvh] items-center justify-center bg-blue-300"
                ></section>
            </main>
            <footer className="h-[30svh] bg-gray-700"></footer>
        </div>
    );
}
