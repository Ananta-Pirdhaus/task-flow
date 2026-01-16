import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { getRoleFromCookie } from "@/lib/getRoleFromCookie";

interface Props {
  children: React.ReactNode;
}

const AppProviders: React.FC<Props> = ({ children }) => {
  const role = getRoleFromCookie();

  /**
   * RULE:
   * - Admin        → Auth, Task, Project
   * - Project Lead → Auth, Project
   * - Employee     → Auth, Task
   */

  let content = children;

  if (role === "Admin") {
    content = (
      <TaskProvider>
        <ProjectProvider>{children}</ProjectProvider>
      </TaskProvider>
    );
  }

  if (role === "Project Lead") {
    content = (
      <TaskProvider>
        <ProjectProvider>{children}</ProjectProvider>
      </TaskProvider>
    );
  }

  if (role === "Employee") {
    content = <TaskProvider>{children}</TaskProvider>;
  }

  return <AuthProvider>{content}</AuthProvider>;
};

export default AppProviders;
