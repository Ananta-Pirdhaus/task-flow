import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  element: JSX.Element;
  isRole?: string; // Bisa role_name atau role_id
  requireLogin?: boolean; // Jika true, wajib login
}

const PrivateRoute = ({
  element,
  isRole,
  requireLogin = true,
}: PrivateRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null; // tunggu state auth siap

  const publicPaths = ["/login", "/register"];

  // Auto redirect untuk halaman public jika sudah login
  if (isAuthenticated && publicPaths.includes(window.location.pathname)) {
    if (user?.role_name === "Admin")
      return <Navigate to="/admin/analytics" replace />;
    if (user?.role_name === "Project Lead")
      return <Navigate to="/project-leader/dashboard" replace />;
    return <Navigate to="/" replace />; // Employee / default
  }

  // Jika halaman ini require login tapi user belum login
  if (requireLogin && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // cek role jika di-set
  const hasRequiredRole = (() => {
    if (!isRole) return true; // tidak ada role, semua boleh
    if (!user) return false;

    const roleId =
      typeof user.role_id === "number" ? user.role_id : Number(user.role_id);
    return user.role_name === isRole || roleId === Number(isRole);
  })();

  return hasRequiredRole ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
