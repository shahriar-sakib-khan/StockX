import React from "react";
import {
    FaBoxOpen,
    FaUsers,
    FaFileAlt,
    FaCreditCard,
    FaChartBar,
    FaClock,
    FaChartPie,
    FaTruck,
    FaDollarSign,
    FaSearch,
    FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ServicesPage() {
    const navigate = useNavigate();

    const services = [
        {
            title: "Inventory Tracking",
            description:
                "Real-time tracking of cylinder and gas inventory levels with automated alerts.",
            points: [
                "Real-time monitoring",
                "Stock level alerts",
                "Automated reordering",
            ],
            icon: <FaBoxOpen className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Core",
            badgeColor: "bg-indigo-900",
        },
        {
            title: "Customer Management",
            description:
                "Comprehensive customer database with contact information and purchase history.",
            points: [
                "Customer profiles",
                "Purchase history",
                "Delivery preferences",
            ],
            icon: <FaUsers className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Core",
            badgeColor: "bg-indigo-900",
        },
        {
            title: "Order Management",
            description:
                "Streamlined order processing interface with delivery scheduling capabilities.",
            points: [
                "Order processing",
                "Delivery scheduling",
                "Status tracking",
            ],
            icon: <FaFileAlt className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Core",
            badgeColor: "bg-indigo-900",
        },
        {
            title: "Automated Billing",
            description:
                "Automated billing and invoicing system with payment tracking.",
            points: [
                "Auto-generated invoices",
                "Payment tracking",
                "Receipt management",
            ],
            icon: <FaCreditCard className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Financial",
            badgeColor: "bg-green-600",
        },
        {
            title: "Reporting & Analytics",
            description:
                "Comprehensive reporting on operations, delivery performance, and inventory.",
            points: [
                "Operational reports",
                "Performance metrics",
                "Custom dashboards",
            ],
            icon: <FaChartBar className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Analytics",
            badgeColor: "bg-sky-500",
        },
        {
            title: "Smart ETA",
            description:
                "AI-powered tool that provides accurate ETAs for all LPG deliveries.",
            points: [
                "AI predictions",
                "Real-time updates",
                "Route optimization",
            ],
            icon: <FaClock className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "AI-Powered",
            badgeColor: "bg-orange-500",
        },
        {
            title: "Daily Sales Management",
            description:
                "Monitor and record day-to-day sales activities with performance insights.",
            points: ["Sales tracking", "Performance metrics", "Daily reports"],
            icon: <FaChartPie className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Sales",
            badgeColor: "bg-yellow-500",
        },
        {
            title: "Driver Management",
            description:
                "Track driver sales, performance, and delivery efficiency.",
            points: [
                "Driver profiles",
                "Sales tracking",
                "Performance analytics",
            ],
            icon: <FaTruck className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Operations",
            badgeColor: "bg-indigo-900",
        },
        {
            title: "Financial Management",
            description:
                "Handle staff salary, vehicle costs, and comprehensive financial tracking.",
            points: [
                "Payroll management",
                "Cost tracking",
                "Financial reports",
            ],
            icon: <FaDollarSign className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Financial",
            badgeColor: "bg-green-600",
        },
        {
            title: "Online Delivery",
            description:
                "Manage online orders and deliveries with customer notifications.",
            points: ["Online orders", "Delivery tracking", "Customer updates"],
            icon: <FaBoxOpen className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Digital",
            badgeColor: "bg-blue-500",
        },
        {
            title: "LPG Community",
            description:
                "Manage customer relationships and community engagement activities.",
            points: [
                "Community management",
                "Customer engagement",
                "Feedback system",
            ],
            icon: <FaUsers className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Community",
            badgeColor: "bg-green-500",
        },
        {
            title: "Navigation & Search",
            description:
                "Quickly find records, features, and information across the platform.",
            points: ["Global search", "Quick navigation", "Smart filtering"],
            icon: <FaSearch className="h-6 w-6 text-white md:h-8 md:w-8" />,
            badge: "Utility",
            badgeColor: "bg-orange-500",
        },
    ];

    return (
        // Changed py-20 to py-12 md:py-20 for better mobile vertical spacing
        <section className="relative min-h-screen bg-gray-50 py-12 md:py-20">
            {/* Go Back Button:
               - Added z-50 to ensure it floats above content
               - Adjusted padding for better touch targets on mobile
            */}
            <button
                onClick={() => navigate("/")}
                className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-indigo-900 px-3 py-2 text-sm text-white shadow-md transition hover:bg-indigo-700 md:px-4 md:text-base"
                aria-label="Go back to home"
            >
                <FaArrowLeft /> <span className="hidden sm:inline">Go Back</span>
            </button>

            {/* Main Container */}
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                {/* Header Section */}
                <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                    Our Services
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-base text-gray-600 md:text-lg">
                    Stock-X provides a comprehensive suite of tools to manage
                    your LPG delivery business efficiently. From inventory
                    tracking to customer management, we've got you covered.
                </p>

                {/* Grid Layout:
                    - grid-cols-1 (Mobile)
                    - md:grid-cols-2 (Tablet)
                    - lg:grid-cols-3 (Desktop)
                */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            // Added 'h-full flex flex-col' to ensure all cards in a row match height
                            className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100"
                        >
                            {/* Icon & Header */}
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center justify-center rounded-lg bg-indigo-900 p-3 transition group-hover:bg-indigo-800">
                                    {service.icon}
                                </div>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${service.badgeColor}`}
                                >
                                    {service.badge}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col text-left">
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    {service.title}
                                </h3>
                                <p className="mb-4 text-sm text-gray-600 md:text-base">
                                    {service.description}
                                </p>

                                {/* Points List - Pushed to bottom using mt-auto if needed, but here flows naturally */}
                                <ul className="mt-auto list-inside list-disc space-y-1 text-sm text-gray-500">
                                    {service.points.map((point) => (
                                        <li key={point} className="flex items-start gap-2">
                                            {/* Custom bullet using span for better control */}
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"></span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
