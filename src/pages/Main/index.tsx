import React from "react";
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
import { useTasks } from "@/context/TaskContext";
import {
  ClipboardList,
  CheckCircle2, 
  Timer,
  BarChart3,
} from "lucide-react";

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
  const { columns, loading } = useTasks();

  if (loading)
    return (
      <div className="p-10 font-medium animate-pulse text-slate-400">
        Syncing data...
      </div>
    );

  const stats = [
    {
      label: "Backlog",
      count: columns.backlog.items.length,
      icon: <ClipboardList size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      chartColor: "rgba(59, 130, 246, 0.7)",
    },
    {
      label: "In Progress",
      count: columns.inprogress.items.length,
      icon: <Timer size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      chartColor: "rgba(245, 158, 11, 0.7)",
    },
    {
      label: "Done",
      count: columns.done.items.length,
      icon: <CheckCircle2 size={16} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      chartColor: "rgba(16, 185, 129, 0.7)",
    },
  ];

  const data = {
    labels: stats.map((s) => s.label),
    datasets: [
      {
        data: stats.map((s) => s.count),
        backgroundColor: stats.map((s) => s.chartColor),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="p-10">
      {/* PARENT CONTAINER WITH GLASSMORPHISM */}
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-2xl border border-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] w-full max-w-max mx-auto transition-all">
        {/* ===================== CHART (450px) ===================== */}
        <div className="w-[450px] h-[450px] relative flex flex-col items-center justify-center bg-white/20 rounded-[2rem] border border-white/40 shadow-inner p-6">
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Distribution
            </span>
          </div>
          <div className="w-full h-full mt-4">
            <PolarArea data={data} options={options} />
          </div>
        </div>

        {/* ===================== MODERN LIST (400px) ===================== */}
        <div className="w-[400px] ml-10 flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-800">
              Analytics Breakdown
            </h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
              Neurogine TaskFlow Engine
            </p>
          </div>

          <div className="space-y-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-4 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-xl transition-all hover:scale-[1.02] hover:bg-black"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shadow-lg shadow-current/5`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-white text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                      Total Tasks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">
                    {stat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL FOOTER CARD */}
          <div className="mt-2 p-4 rounded-2xl bg-indigo-600/5 border border-indigo-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-600/60 uppercase">
              System Integrity
            </span>
            <span className="text-[11px] font-black text-indigo-600">
              Active Node
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
