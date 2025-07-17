import { createBrowserRouter } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  SignupPage,
  ErrorPage,
  Dashboard,
  SettingsPage,
} from "../pages";
import Layout from "../components/layouts/Layout";
import { AppContainer } from "../components";
import ProfilePage from "../pages/ProfilePage";

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
