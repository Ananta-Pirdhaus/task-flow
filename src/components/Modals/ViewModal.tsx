import React from "react";
import { format, differenceInDays } from "date-fns"; // date-fns for date manipulation

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    description: string;
    priority: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    image?: string;
    alt?: string;
    tags?: Array<{ title: string; bg: string; text: string }>;
    progress?: number;
  } | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  if (!task) return null;

  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);
  const daysDifference = differenceInDays(endDate, startDate) + 1; // +1 to include the start date in the range

  const isSameDay = task.startDate === task.endDate;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
        <p className="text-gray-700 mb-4">{task.description}</p>

        <div className="space-y-2">
          <div>
            <strong>Priority:</strong> {task.priority}
          </div>
          <div>
            <strong>Date Range:</strong> {format(startDate, "yyyy-MM-dd")} -{" "}
            {format(endDate, "yyyy-MM-dd")}
          </div>
          <div>
            <strong>Duration:</strong> {daysDifference}{" "}
            {daysDifference > 1 ? "days" : "day"}
          </div>

          {isSameDay && task.startTime && task.endTime ? (
            <div>
              <strong>Time:</strong> {task.startTime} - {task.endTime}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
