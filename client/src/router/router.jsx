import { createBrowserRouter } from "react-router-dom";
import {
    LandingPage,
    LoginPage,
    SignupPage,
    ErrorPage,
    Dashboard,
    SettingsPage,
    InventoryPage,
    VehiclesPage,
    ProfilePage,
    HistoryPage,
    MembersPage,
    SupportPage,
    PricingPage,
    ServicesPage,
    ShowAllStores,
    AddStore,
    InvitationsPage,
    BrandSelectionPage,
    ShopsPage,
} from "../pages";
import Layout from "../components/layouts/Layout";
import { AppContainer } from "../components";
import StaffPage from "../pages/StaffPage";

import { default as ExchangePage } from "../features/exchange/ExchangePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "support", element: <SupportPage /> },
            { path: "pricing", element: <PricingPage /> },
            { path: "services", element: <ServicesPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "stores", element: <ShowAllStores /> },
            { path: "addStore", element: <AddStore /> },
            { path: "invitations", element: <InvitationsPage /> },
            { path: "selectBrands", element: <BrandSelectionPage /> },
            {
                path: "dashboard",
                element: (
                    <AppContainer>
                        <Dashboard />
                    </AppContainer>
                ),
            },
            {
                path: "inventory",
                element: (
                    <AppContainer>
                        <InventoryPage />
                    </AppContainer>
                ),
            },
            {
                path: "staff",
                element: (
                    <AppContainer>
                        <StaffPage />
                    </AppContainer>
                ),
            },
            {
                path: "shops",
                element: (
                    <AppContainer>
                        <ShopsPage />
                    </AppContainer>
                ),
            },
            {
                path: "vehicles",
                element: (
                    <AppContainer>
                        <VehiclesPage />
                    </AppContainer>
                ),
            },
            {
                path: "history",
                element: (
                    <AppContainer>
                        <HistoryPage />
                    </AppContainer>
                ),
            },
            {
                path: "profile",
                element: (
                    <AppContainer>
                        <ProfilePage />
                    </AppContainer>
                ),
            },
            {
                path: "members",
                element: (
                    <AppContainer>
                        <MembersPage />
                    </AppContainer>
                ),
            },
            {
                path: "settings",
                element: (
                    <AppContainer>
                        <SettingsPage />
                    </AppContainer>
                ),
            },
            {
                path: "exchange",
                element: (
                    <AppContainer>
                        <ExchangePage />
                    </AppContainer>
                ),
            },
        ],
    },
]);

export default router;
