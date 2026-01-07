import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import routes from "./routes";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // atau <LoadingSpinner />
  }

  const routing = useRoutes(routes(isAuthenticated));

  return (
    <>
      {routing}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
