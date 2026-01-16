import { RouteObject, Navigate } from "react-router-dom";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Main from "../pages/Main";
import Project from "../pages/Project";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "@/helpers/privateRoutes";
import NotificationBoard from "../pages/Notifications";
import Newsletter from "../pages/Admin/Newsletter";
import Workflow from "../pages/Admin/WorkFlow";
import Analytics from "../pages/Admin/Analytics";
import ProjectLeaderDashboard from "../pages/ProjectLeader/ProjectLeaderDashboard";
import TaskDetails from "../pages/ProjectLeader/ProjectList";
import UserTaskPage from "../pages/ProjectLeader/UserTask";

const routes: RouteObject[] = [
  // Layout utama untuk semua user ("/" dianggap halaman setup)
  {
    path: "/",
    element: <PrivateRoute element={<Layout />} requireLogin={true} />,
    children: [
      { path: "", element: <Main /> },
      { path: "boards", element: <Boards /> },
      { path: "project", element: <Project /> },
      { path: "notifications", element: <NotificationBoard /> },
    ],
  },

  // Project Lead routes
  {
    path: "/project-leader",
    element: <PrivateRoute element={<Layout />} isRole="Project Lead" />,
    children: [
      { path: "dashboard", element: <ProjectLeaderDashboard /> },
      { path: "list-project", element: <TaskDetails /> },
      { path: "user-task", element: <UserTaskPage /> },
      { path: "boards", element: <Boards /> },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <PrivateRoute element={<Layout />} isRole="Admin" />,
    children: [
      { path: "newsletter", element: <Newsletter /> },
      { path: "workflow", element: <Workflow /> },
      { path: "analytics", element: <Analytics /> },
    ],
  },

  // Redirect alias
  {
    path: "/dashboard",
    element: <Navigate to="/project-leader/dashboard" replace />,
  },
  { path: "/analytics", element: <Navigate to="/admin/analytics" replace /> },

  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Redirect /main ke /
  { path: "/main", element: <Navigate to="/" replace /> },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;
