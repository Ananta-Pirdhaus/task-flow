import React, { useEffect, useState } from "react";
import { Columns } from "../../types";

const GenerateModal = () => {
  const [columns, setColumns] = useState<Columns | null>(null);
  const [showToDoModal, setShowToDoModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("taskBoard");
    if (storedData) {
      const parsedData: Columns = JSON.parse(storedData);
      setColumns(parsedData);
    }
  }, []);

  const formatDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generateToDoContent = (columns: Columns): string => {
    const date = formatDate();
    const content = Object.entries(columns)
      .map(([columnKey, column]) => {
        return (
          `${column.name}\n` +
          column.items
            .map((task) => {
              return `- ${task.title}\n  Description: ${task.description}\n  Priority: ${task.priority}\n`;
            })
            .join("\n")
        );
      })
      .join("\n\n");

    return `${date}\n\n${content}\n\n#todo(user)`;
  };

  const generateReportContent = (columns: Columns): string => {
    const date = formatDate();
    const content = Object.entries(columns)
      .map(([columnKey, column]) => {
        return (
          `${column.name}\n` +
          column.items
            .map((task) => {
              return `- ${task.title}\n  Description: ${task.description}\n  Priority: ${task.priority}\n  Progress: ${task.progress}%\n`;
            })
            .join("\n")
        );
      })
      .join("\n\n");

    return `${date}\n\n${content}\n\n#report`;
  };

  const openToDoModal = () => {
    setShowToDoModal(true);
    setShowReportModal(false);
  };

  const openReportModal = () => {
    setShowReportModal(true);
    setShowToDoModal(false);
  };

  const closeModal = () => {
    setShowToDoModal(false);
    setShowReportModal(false);
  };

  if (!columns) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={openToDoModal}
          className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
        >
          Generate To-do
          <span className="absolute bottom-full mb-2 hidden w-max whitespace-nowrap text-xs text-white bg-black rounded-md px-2 py-1 group-hover:block">
            Generate To-do
          </span>
        </button>
        <button
          onClick={openReportModal}
          className="relative bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
        >
          Generate Report
          <span className="absolute bottom-full mb-2 hidden w-max whitespace-nowrap text-xs text-white bg-black rounded-md px-2 py-1 group-hover:block">
            Generate Report
          </span>
        </button>
      </div>

      {showToDoModal && (
        <div className="fixed inset-0 flex justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full overflow-y-auto max-h-96">
            <h2 className="text-xl font-bold mb-4">Generate ToDo</h2>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              {formatDate()}
            </h3>
            <div>
              {Object.entries(columns).map(([columnKey, column]) => (
                <div key={columnKey}>
                  <h3 className="font-semibold mb-2">{column.name}</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {column.items.map((task) => (
                      <li key={task.id} className="mb-2">
                        <p className="font-semibold">{task.title}</p>
                        <p>{task.description}</p>
                        <p className="text-sm font-bold">
                          Priority: {task.priority}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const toDoContent = columns
                    ? generateToDoContent(columns)
                    : "No tasks available";
                  navigator.clipboard.writeText(toDoContent);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 flex justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-96">
            <h2 className="text-xl font-bold mb-4">Generate Report</h2>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Date: {formatDate()}
            </h3>
            <div>
              {Object.entries(columns).map(([columnKey, column]) => (
                <div key={columnKey}>
                  <h3 className="font-semibold mb-2">{column.name}</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {column.items.map((task) => (
                      <li key={task.id} className="mb-2">
                        <p className="font-semibold">{task.title}</p>
                        <p>{task.description}</p>
                        <p className="text-sm font-bold">
                          Priority: {task.priority}
                        </p>
                        <p className="text-sm font-semibold">
                          Progress: {task.progress}%
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const reportContent = columns
                    ? generateReportContent(columns)
                    : "No tasks available";
                  navigator.clipboard.writeText(reportContent);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateModal;
