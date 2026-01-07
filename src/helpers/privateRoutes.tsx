import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
  isAuthenticated: boolean;
  isRole?: string; // role_name or role_id that is required
}

const PrivateRoute = ({
  element,
  isAuthenticated,
  isRole,
}: PrivateRouteProps) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Set isAuthenticated to true if user data exists in localStorage
  isAuthenticated = user !== null;

  // Check if role exists and matches the required role (either role_name or role_id)
  const hasRequiredRole = isRole
    ? user?.role_name === isRole || user?.role_id === parseInt(isRole)
    : true;

  return isAuthenticated && hasRequiredRole ? (
    element
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
