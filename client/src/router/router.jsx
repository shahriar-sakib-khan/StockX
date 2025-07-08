import { createBrowserRouter } from "react-router-dom";
import { LandingPage, LoginPage, SignupPage, ErrorPage } from "../pages";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
]);

export default router;
