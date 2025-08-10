import { createBrowserRouter } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  SignupPage,
  ErrorPage,
  Dashboard,
  SettingsPage,
  InventoryPage,
  ShopsPage,
  VehiclesPage,
  ProfilePage,
  HistoryPage,
} from "../pages";
import Layout from "../components/layouts/Layout";
import { AppContainer } from "../components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
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
        path: "settings",
        element: (
          <AppContainer>
            <SettingsPage />
          </AppContainer>
        ),
      },
    ],
  },
]);

export default router;
