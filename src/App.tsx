import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import routes from "./routes";
import { useAuth } from "@/context/AuthContext";
import AppProviders from "@/context/AppProviders";

function AppContent() {
  const { loading } = useAuth();

  if (loading) return null;

  const routing = useRoutes(routes);

  return (
    <>
      {routing}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
