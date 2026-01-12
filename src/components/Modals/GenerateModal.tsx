"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Columns } from "../../types/task";

/* =========================
   Skeleton Components
========================= */
const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const SkeletonModal = () => (
  <div className="space-y-4">
    <SkeletonBlock className="h-6 w-1/3" />
    <SkeletonBlock className="h-4 w-1/4" />
    <SkeletonBlock className="h-16 w-full" />
    <SkeletonBlock className="h-16 w-full" />
  </div>
);

/* =========================
   Main Component
========================= */
const GenerateModal = () => {
  const [columns, setColumns] = useState<Columns>({});
  const [loading, setLoading] = useState(true);

  const [showToDoModal, setShowToDoModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  /* =========================
     Load from Cookies
  ========================= */
  useEffect(() => {
    try {
      const cookieData = Cookies.get("taskBoard");

      if (cookieData) {
        const parsed: Columns = JSON.parse(cookieData);
        setColumns(parsed ?? {});
      } else {
        setColumns({});
      }
    } catch (err) {
      console.error("Failed to read taskBoard cookie:", err);
      setColumns({});
    } finally {
      setLoading(false);
    }
  }, []);

  const isEmpty = Object.keys(columns).length === 0;

  /* =========================
     Helpers
  ========================= */
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString("id-ID");
  };

  const generateToDoContent = (data: Columns) => {
    if (Object.keys(data).length === 0) return "No tasks available";

    const content = Object.values(data)
      .map(
        (column) =>
          `${column.name}\n` +
          column.items
            .map(
              (task) =>
                `- ${task.title}\n  Description: ${task.description}\n  Priority: ${task.priority}`
            )
            .join("\n")
      )
      .join("\n\n");

    return `${formatDate()}\n\n${content}\n\n#todo(user)`;
  };

  const generateReportContent = (data: Columns) => {
    if (Object.keys(data).length === 0) return "No tasks available";

    const content = Object.values(data)
      .map(
        (column) =>
          `${column.name}\n` +
          column.items
            .map(
              (task) =>
                `- ${task.title}\n  Description: ${task.description}\n  Priority: ${task.priority}\n  Progress: ${task.progress}%`
            )
            .join("\n")
      )
      .join("\n\n");

    return `${formatDate()}\n\n${content}\n\n#report`;
  };

  const closeModal = () => {
    setShowToDoModal(false);
    setShowReportModal(false);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-4">
      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-40">
        <button
          onClick={() => {
            setShowToDoModal(true);
            setShowReportModal(false);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Generate To-do
        </button>

        <button
          onClick={() => {
            setShowReportModal(true);
            setShowToDoModal(false);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Generate Report
        </button>
      </div>

      {/* =========================
          ToDo Modal
      ========================= */}
      {showToDoModal && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/30">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-1">Generate ToDo</h2>
            <p className="text-sm text-gray-500 mb-4">{formatDate()}</p>

            {loading ? (
              <SkeletonModal />
            ) : isEmpty ? (
              <p className="text-gray-500 italic text-sm">
                Tidak ada task untuk ditampilkan
              </p>
            ) : (
              Object.entries(columns).map(([key, column]) => (
                <div key={key} className="mb-4">
                  <h3 className="font-semibold mb-2">{column.name}</h3>
                  <ul className="list-disc pl-5">
                    {column.items.map((task) => (
                      <li key={task.id}>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm">{task.description}</p>
                        <p className="text-xs font-bold">
                          Priority: {task.priority}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(generateToDoContent(columns))
                }
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Report Modal
      ========================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/30">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-1">Generate Report</h2>
            <p className="text-sm text-gray-500 mb-4">{formatDate()}</p>

            {loading ? (
              <SkeletonModal />
            ) : isEmpty ? (
              <p className="text-gray-500 italic text-sm">
                Tidak ada task untuk ditampilkan
              </p>
            ) : (
              Object.entries(columns).map(([key, column]) => (
                <div key={key} className="mb-4">
                  <h3 className="font-semibold mb-2">{column.name}</h3>
                  <ul className="list-disc pl-5">
                    {column.items.map((task) => (
                      <li key={task.id}>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm">{task.description}</p>
                        <p className="text-xs font-bold">
                          Progress: {task.progress}%
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(generateReportContent(columns))
                }
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
