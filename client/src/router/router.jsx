import { createBrowserRouter } from "react-router-dom";

import { AppContainer, Layout } from "../components";

import {
    LandingPage,
    LoginPage,
    SignupPage,
    ErrorPage,
    // system
    ServicesPage,
    PricingPage,
    SupportPage,
    // general
    SettingsPage,
    ProfilePage,
    InvitationsPage,
    ShowAllStores,
    // sidebar
    Dashboard,
    InventoryPage,
    VehiclesPage,
    ShopsPage,
    StaffPage,
    HistoryPage,
    CommunityPage,
    // sub pages
    ExchangePage,
    AddStore,
    BrandSelectionPage,
} from "../pages";

import { MyPostsPage, CreateSwapPostPage } from "@/features/community/pages";

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
                path: "community",
                element: (
                    <AppContainer>
                        <CommunityPage />
                    </AppContainer>
                ),
            },
            {
                path: "community/create",
                element: (
                    <AppContainer>
                        <CreateSwapPostPage />
                    </AppContainer>
                ),
            },
            {
                path: "community/my-posts",
                element: (
                    <AppContainer>
                        <MyPostsPage />
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
                path: "settings",
                element: (
                    <AppContainer>
                        <SettingsPage />
                    </AppContainer>
                ),
            },
            {
                path: "exchange/:shopId",
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
