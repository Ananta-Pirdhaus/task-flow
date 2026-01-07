/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Columns, TaskT } from "../../types";

const getInitialColumns = (): Columns => {
  const storedData = localStorage.getItem("taskBoard");
  return storedData ? JSON.parse(storedData) : {};
};

const NotificationBoard: React.FC = () => {
  const [columns, setColumns] = useState<Columns>(getInitialColumns());
  const [highPriorityTasks, setHighPriorityTasks] = useState<TaskT[]>([]);

  useEffect(() => {
    const tasksWithHighPriority: TaskT[] = [];
    Object.values(columns).forEach((column) => {
      column.items.forEach((task: TaskT) => {
        if (task.priority === "high") {
          tasksWithHighPriority.push(task);
        }
      });
    });
    setHighPriorityTasks(tasksWithHighPriority);
  }, [columns]);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Notifikasi Penting</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {highPriorityTasks.length > 0 ? (
          highPriorityTasks.map((task: TaskT) => (
            <div
              key={task.id}
              className="bg-gray-50 border-orange-300 border-2 rounded-lg p-4 shadow-md"
            >
              <h2 className="font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <span className="text-red-900">{`${task.startDate} - ${task.endDate}`}</span>
              <div className="flex mt-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-block mr-1 px-2 py-1 text-xs font-semibold rounded-full`}
                    style={{
                      backgroundColor: tag.bg,
                      color: tag.text,
                    }}
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Tidak ada notifikasi penting saat ini.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationBoard;
