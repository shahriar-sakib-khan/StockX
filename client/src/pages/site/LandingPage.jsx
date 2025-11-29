import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRight as RightArrowIcon, FaBars, FaXmark } from "react-icons/fa6"; // Added FaBars/FaXmark for mobile menu
import hero_img from "../../assets/images/hero.webp";
import Logo from "../../components/ui/Logo";
import { useAuthStore } from "../../stores/useAuthStore";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Common style for nav links to avoid repetition
    const linkClasses = "rounded px-4 py-2 font-semibold text-gray-700 transition-all duration-100 hover:bg-gray-100 block w-full md:w-auto text-center";

    return (
        <header className="relative w-full border-b border-transparent bg-white shadow-sm md:border-none md:shadow-none">
            <div className="wrapper-l flex h-[var(--navbar-height)] items-center justify-between py-4">
                {/* Logo */}
                <Logo className="text-2xl font-bold" />

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="block p-2 text-gray-600 transition md:hidden hover:text-gray-900"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
                </button>

                {/* Desktop Navigation & Actions */}
                {/* 'hidden md:flex' hides this on mobile, shows on medium screens+ */}
                <div className="hidden w-full items-center justify-end gap-2 md:flex">
                    <nav className="flex items-center gap-1 text-sm">
                        <NavLink to="pricing" className={linkClasses}>Pricing</NavLink>
                        <NavLink to="services" className={linkClasses}>Services</NavLink>
                        <NavLink to="support" className={linkClasses}>Support</NavLink>
                    </nav>

                    {/* Divider */}
                    <span className="mx-2 h-6 w-0.5 bg-gray-300/70"></span>

                    {/* Auth Buttons */}
                    <div className="flex gap-2 text-sm">
                        <NavLink to="login" className={linkClasses}>
                            Log in
                        </NavLink>
                        <NavLink
                            to="signup"
                            className="rounded-md bg-blue-400 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-400/90"
                        >
                            Sign up
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {/* Conditional rendering based on isMenuOpen state */}
            {isMenuOpen && (
                <div className="absolute left-0 top-full z-50 w-full flex-col border-t border-gray-100 bg-white p-4 shadow-lg md:hidden">
                    <nav className="flex flex-col gap-2">
                        <NavLink to="pricing" className={linkClasses} onClick={() => setIsMenuOpen(false)}>Pricing</NavLink>
                        <NavLink to="services" className={linkClasses} onClick={() => setIsMenuOpen(false)}>Services</NavLink>
                        <NavLink to="support" className={linkClasses} onClick={() => setIsMenuOpen(false)}>Support</NavLink>
                        <hr className="my-2 border-gray-200" />
                        <NavLink to="login" className={linkClasses} onClick={() => setIsMenuOpen(false)}>Log in</NavLink>
                        <NavLink
                            to="signup"
                            className="block w-full rounded-md bg-blue-400 px-4 py-3 text-center font-semibold text-white shadow-md hover:bg-blue-500"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign up
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Hero = () => {
    return (
        <section
            role="region"
            // Changed min-h calculation to be safer on mobile browsers (svh/dvh)
            // Grid: 1 column on mobile (stacked), 2 columns on Large screens
            className="wrapper-l grid min-h-[calc(100svh-var(--navbar-height))] grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:py-0"
        >
            {/* Text Content */}
            <div className="flex flex-col items-center justify-center gap-6 text-center lg:items-start lg:text-left">
                <h1 className="text-3xl font-semibold leading-tight text-gray-700 md:text-4xl lg:text-5xl">
                    Manage your shop with ease
                </h1>

                {/* Replaced w-[85%] with max-w to prevent squishing on mobile */}
                <p className="max-w-lg text-base text-gray-500 md:text-lg">
                    StockX is everything you need to manage your shop. Your
                    inventory, transaction, employees, earning records etc.
                    Everything organized for your convenience
                </p>

                <div className="flex items-center gap-4 text-base">
                    <NavLink
                        to="signup"
                        className="flex items-center gap-3 rounded-md bg-blue-400 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-400/90"
                    >
                        <span>Get started </span>
                        <RightArrowIcon className="text-xl" />
                    </NavLink>
                </div>
            </div>

            {/* Image Content */}
            {/* Added w-full and responsive sizing to ensure image scales down */}
            <div className="flex justify-center lg:justify-end">
                <img
                    src={hero_img}
                    alt="StockX Dashboard Preview"
                    className="h-auto w-full max-w-md object-contain lg:max-w-full"
                />
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
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Hero />
                {/* Example Feature Section Placeholder */}
                <section
                    role="region"
                    className="flex min-h-[50vh] items-center justify-center bg-blue-50/50 p-8"
                >
                    <p className="text-gray-400">Additional Features Section</p>
                </section>
            </main>
            <footer className="h-auto bg-gray-700 py-12 text-white">
                <div className="wrapper-l text-center md:text-left">
                    {/* Added content to footer so it's not just a blank box */}
                    <p>&copy; {new Date().getFullYear()} StockX. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
