import React, { useEffect, useState } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Main: React.FC = () => {
  // State untuk menyimpan data dari localStorage
  const [boardData, setBoardData] = useState<any>(null);

  useEffect(() => {
    // Ambil data dari localStorage
    const savedBoardData = localStorage.getItem("taskBoard");

    if (savedBoardData) {
      setBoardData(JSON.parse(savedBoardData)); // Simpan data ke state setelah parsing JSON
    }
  }, []);

  if (!boardData) {
    return <div>Loading...</div>; // Menampilkan loading jika data belum ada
  }

  // Hitung total tugas di setiap kolom
  const totalTasksBacklog = boardData.backlog.items.length;
  const totalTasksPending = boardData.pending.items.length;
  const totalTasksTodo = boardData.todo.items.length;
  const totalTasksDoing = boardData.doing.items.length;
  const totalTasksDone = boardData.done.items.length;

  // Data untuk chart Polar Area
  const data = {
    labels: ["Backlog", "Pending", "To Do", "Doing", "Done"],
    datasets: [
      {
        label: "Task Count",
        data: [
          totalTasksBacklog,
          totalTasksPending,
          totalTasksTodo,
          totalTasksDoing,
          totalTasksDone,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)", // Color for "Backlog"
          "rgba(255, 99, 132, 0.2)", // Color for "Pending"
          "rgba(54, 162, 235, 0.2)", // Color for "To Do"
          "rgba(153, 102, 255, 0.2)", // Color for "Doing"
          "rgba(255, 159, 64, 0.2)", // Color for "Done"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Border color for "Backlog"
          "rgba(255, 99, 132, 1)", // Border color for "Pending"
          "rgba(54, 162, 235, 1)", // Border color for "To Do"
          "rgba(153, 102, 255, 1)", // Border color for "Doing"
          "rgba(255, 159, 64, 1)", // Border color for "Done"
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Task Distribution",
      },
    },
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-start bg-gradient-to-b from-white to-gray-100 p-4 shadow-md rounded-lg w-full">
        {/* Chart Section */}
        <div className="w-[500px] h-[500px]">
          <PolarArea data={data} options={options} />
        </div>

        {/* Table Section */}
        <div className="w-[400px] ml-10">
          <table className="min-w-full border-collapse table-auto bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-orange-700">
                <th className="px-4 py-2 text-left border-b">Jenis Task</th>
                <th className="px-4 py-2 text-left border-b">Jumlah Task</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-orange-200 transition-colors duration-200">
                <td className="px-4 py-2 border-b">Backlog</td>
                <td className="px-4 py-2 border-b">{totalTasksBacklog}</td>
              </tr>
              <tr className="hover:bg-orange-200 transition-colors duration-200">
                <td className="px-4 py-2 border-b">Pending</td>
                <td className="px-4 py-2 border-b">{totalTasksPending}</td>
              </tr>
              <tr className="hover:bg-orange-200 transition-colors duration-200">
                <td className="px-4 py-2 border-b">To Do</td>
                <td className="px-4 py-2 border-b">{totalTasksTodo}</td>
              </tr>
              <tr className="hover:bg-orange-200 transition-colors duration-200">
                <td className="px-4 py-2 border-b">Doing</td>
                <td className="px-4 py-2 border-b">{totalTasksDoing}</td>
              </tr>
              <tr className="hover:bg-orange-200 transition-colors duration-200">
                <td className="px-4 py-2 border-b">Done</td>
                <td className="px-4 py-2 border-b">{totalTasksDone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Main;
