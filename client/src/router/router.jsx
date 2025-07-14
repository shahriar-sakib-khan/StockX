import { createBrowserRouter } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  SignupPage,
  ErrorPage,
  Dashboard,
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
        element: <AppContainer />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

export default router;
