import React from "react";
import { TaskData, Tag } from "../../types/task";
import { useTasks } from "../../context/TaskContext";
import TaskDetailModal from "../../components/Modals/TaskModal";

/* ========================= UTIL ========================= */
const calculateDuration = (
  startDate: string,
  endDate: string,
  startTime?: string,
  endTime?: string
): string => {
  const start = new Date(`${startDate}T${startTime || "00:00"}`);
  const end = new Date(`${endDate}T${endTime || "23:59"}`);

  if (startDate === endDate) {
    const diffHours =
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${Math.floor(diffHours)} jam`;
  }

  const diffDays = Math.ceil(
    Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) return `${diffDays} hari`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu`;
  return `${Math.floor(diffDays / 30)} bulan`;
};

/* ========================= COMPONENT ========================= */
const Project: React.FC = () => {
  const { columns, loading, setSelectedTask, setModalOpen, modalOpen } =
    useTasks();

  const allTasks: TaskData[] = [
    ...columns.backlog.items,
    ...columns.inprogress.items,
    ...columns.done.items,
  ];

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Daftar Task</h1>

      <table className="min-w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Nama",
              "Task Type",
              "Deskripsi",
              "Prioritas",
              "Range Task",
              "Tag",
              "Progress",
            ].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {allTasks.map((task, index) => (
            <tr
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                setModalOpen(true);
              }}
              className={`cursor-pointer hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="px-6 py-4">{task.title}</td>
              <td className="px-6 py-4 capitalize">{task.taskType}</td>
              <td className="px-6 py-4">{task.description}</td>
              <td className="px-6 py-4">{task.priority}</td>
              <td className="px-6 py-4">
                {calculateDuration(
                  task.startDate,
                  task.endDate,
                  task.startTime,
                  task.endTime
                )}
              </td>
              <td className="px-6 py-4 flex gap-2 flex-wrap">
                {task.tags.map((tag: Tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: tag.color,
                    }}
                  >
                    {tag.title}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4">{task.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW ONLY MODAL */}
      <TaskDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        setOpen={setModalOpen}
      />
    </div>
  );
};

export default Project;
