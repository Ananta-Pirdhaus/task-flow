// src/components/TaskDetails.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Untuk mengambil ID dari URL

// Definisikan interface Task sementara
interface Task {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
}

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>(); // Mengambil ID dari URL
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    // Dummy data for task details
    const dummyTask: Task = {
      id: parseInt(taskId || "0"), // Using the taskId from URL for the task ID
      title: "Design Website",
      description: "Create wireframes for the new website",
      status: "In Progress",
    };

    setTask(dummyTask); // Directly setting the dummy task data
  }, [taskId]);

  const handleStatusChange = (status: string) => {
    if (task) {
      setTask({
        ...task,
        status: status as "Pending" | "In Progress" | "Completed",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {task ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold">{task.title}</h1>
          <p className="text-lg text-gray-700 mt-2">{task.description}</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Current Status: {task.status}
            </p>
            <div className="mt-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Update Status:
              </label>
              <select
                id="status"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div>No task details available</div>
      )}
    </div>
  );
};

export default TaskDetails;
