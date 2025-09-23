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
import { useNavigate } from "react-router-dom"; // ✅ For navigation

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
            icon: <FaBoxOpen className="h-8 w-8 text-white" />,
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
            icon: <FaUsers className="h-8 w-8 text-white" />,
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
            icon: <FaFileAlt className="h-8 w-8 text-white" />,
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
            icon: <FaCreditCard className="h-8 w-8 text-white" />,
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
            icon: <FaChartBar className="h-8 w-8 text-white" />,
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
            icon: <FaClock className="h-8 w-8 text-white" />,
            badge: "AI-Powered",
            badgeColor: "bg-orange-500",
        },
        {
            title: "Daily Sales Management",
            description:
                "Monitor and record day-to-day sales activities with performance insights.",
            points: ["Sales tracking", "Performance metrics", "Daily reports"],
            icon: <FaChartPie className="h-8 w-8 text-white" />,
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
            icon: <FaTruck className="h-8 w-8 text-white" />,
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
            icon: <FaDollarSign className="h-8 w-8 text-white" />,
            badge: "Financial",
            badgeColor: "bg-green-600",
        },
        {
            title: "Online Delivery",
            description:
                "Manage online orders and deliveries with customer notifications.",
            points: ["Online orders", "Delivery tracking", "Customer updates"],
            icon: <FaBoxOpen className="h-8 w-8 text-white" />,
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
            icon: <FaUsers className="h-8 w-8 text-white" />,
            badge: "Community",
            badgeColor: "bg-green-500",
        },
        {
            title: "Navigation & Search",
            description:
                "Quickly find records, features, and information across the platform.",
            points: ["Global search", "Quick navigation", "Smart filtering"],
            icon: <FaSearch className="h-8 w-8 text-white" />,
            badge: "Utility",
            badgeColor: "bg-orange-500",
        },
    ];

    return (
        <section className="relative bg-gray-50 py-20">
            {/* ✅ Sticky Go Back Button */}
            <button
                onClick={() => navigate("/")} // ✅ absolute path to landing page
                className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-indigo-900 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
            >
                <FaArrowLeft /> Go Back
            </button>

            <div className="mx-auto max-w-6xl px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                    Our Services
                </h2>
                <p className="mx-auto mb-12 max-w-3xl text-gray-600">
                    Stock-X provides a comprehensive suite of tools to manage
                    your LPG delivery business efficiently. From inventory
                    tracking to customer management, we've got you covered.
                </p>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="group rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            {/* Icon */}
                            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-indigo-900 p-3 transition group-hover:bg-indigo-700">
                                {service.icon}
                            </div>

                            {/* Title + Badge */}
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {service.title}
                                </h3>
                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${service.badgeColor}`}
                                >
                                    {service.badge}
                                </span>
                            </div>

                            <p className="mb-4 text-gray-600">
                                {service.description}
                            </p>

                            <ul className="list-inside list-disc space-y-1 text-left">
                                {service.points.map((point) => (
                                    <li key={point} className="text-orange-500">
                                        <span className="text-gray-700">
                                            {point}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
