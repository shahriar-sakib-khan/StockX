import { Navigate } from "react-router-dom";

export const redirectToLogin = (currentPath) => {
  const redirectUrl =
    currentPath && currentPath !== "/" ? currentPath : "/dashboard";

  return <Navigate to="/login" replace state={{ redirectUrl }} />;
};
