// src/components/ProjectLeaderDashboard.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Untuk navigasi antar halaman

// Definisikan interface Task sementara
interface Task {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
}

const ProjectLeaderDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Simulasi pengambilan data tugas dari API atau database
    const fetchTasks = async () => {
      const data: Task[] = [
        {
          id: 1,
          title: "Design Website",
          description: "Create wireframes for the new website",
          status: "In Progress",
        },
        {
          id: 2,
          title: "Develop Backend",
          description: "Implement the REST API for the project",
          status: "Pending",
        },
        {
          id: 3,
          title: "Testing",
          description: "Test the product features and fix bugs",
          status: "Completed",
        },
      ];
      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Project Leader Dashboard
      </h1>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center">No tasks available</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-medium">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
              <Link
                to={`/task/${task.id}`}
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectLeaderDashboard;
