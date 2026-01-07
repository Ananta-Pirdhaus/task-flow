import React from "react";
import { Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js elements
ChartJS.register(
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const MainAdmin: React.FC = () => {
  const radarData = {
    labels: ["Total User", "Programmer", "Project Leader"],
    datasets: [
      {
        label: "Jumlah User",
        data: [100, 60, 40],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const taskStatusData = {
    labels: ["Todo", "Processing", "Done"],
    datasets: [
      {
        label: "Jumlah Task",
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
        borderColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  const totalUserData = { programmer: 60, projectLeader: 40 };
  const averageTaskType = "Processing";

  return (
    <div className="p-8  min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          style={{ height: "300px" }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Jumlah User
          </h2>
          <Radar
            data={radarData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                r: {
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const label = tooltipItem.label;
                      const value = tooltipItem.raw;
                      if (label === "Total User")
                        return `Total User: ${value} pengguna`;
                      if (label === "Programmer")
                        return `Programmer: ${value} programmer aktif`;
                      if (label === "Project Leader")
                        return `Project Leader: ${value} orang`;
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          style={{ height: "300px" }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Status Task Programmer
          </h2>
          <Bar
            data={taskStatusData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const status = tooltipItem.label;
                      const value = tooltipItem.raw;
                      if (status === "Todo")
                        return `Todo: ${value} task belum dikerjakan`;
                      if (status === "Processing")
                        return `Processing: ${value} task sedang dikerjakan`;
                      if (status === "Done")
                        return `Done: ${value} task selesai`;
                      return `${status}: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row gap-4">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-300 pr-4 pb-4 md:pb-0">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total User
          </h2>
          <p className="text-gray-600">
            Programmer: {totalUserData.programmer}
          </p>
          <p className="text-gray-600">
            Project Leader: {totalUserData.projectLeader}
          </p>
          <p className="font-semibold text-gray-800">
            Total User: {totalUserData.programmer + totalUserData.projectLeader}
          </p>
        </div>

        <div className="flex-1 pl-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Rata-rata Tipe Task yang Dikerjakan
          </h2>
          <p className="text-gray-600">{averageTaskType}</p>
        </div>
      </div>
    </div>
  );
};

export default MainAdmin;
