import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import routes from "./routes"; // ini sudah array
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ProjectProvider } from "./context/ProjectContext";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return null; // atau <LoadingSpinner />
  }

  // Tidak perlu panggil routes() karena sudah array
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
    <AuthProvider>
      <TaskProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
