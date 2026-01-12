import {
  Clock,
  Eye,
  Pencil,
  Trash2,
  Target,
  Tag,
  AlertCircle,
  Gauge, // Ikon baru untuk progress
  CalendarDays,
  Zap, // Ikon untuk urgensi menit/jam
} from "lucide-react";
import { TaskData } from "../../types/task";
import { DraggableProvided } from "react-beautiful-dnd";

const getProgressColorClass = (progress: number) => {
  if (progress <= 25) return "from-rose-500 to-red-500 shadow-rose-500/40";
  if (progress <= 50)
    return "from-orange-500 to-amber-500 shadow-orange-500/40";
  if (progress <= 75) return "from-yellow-500 to-lime-500 shadow-yellow-500/40";
  return "from-green-500 to-teal-500 shadow-green-500/40";
};

interface TaskProps {
  task: TaskData;
  provided: DraggableProvided;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const Task = ({ task, provided, onEdit, onDelete, onView }: TaskProps) => {
  const { title, description, priority, end_date, end_time, tags, progress } =
    task;

  // --- LOGIKA TIMELINE DETAIL (JAM & MENIT) ---
  const endDateTime = new Date(`${end_date}T${end_time || "23:59:59"}`);
  const now = new Date();

  const diffMs = endDateTime.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let dateContainerClass = "bg-white/50 border-white/20 text-slate-600";
  let dateIcon = <CalendarDays size={14} className="text-slate-500" />;
  let dateText = `Due: ${end_date}`;

  if (diffMs < 0) {
    dateContainerClass =
      "bg-rose-100/80 border-rose-200 text-rose-700 font-bold animate-pulse";
    dateIcon = <AlertCircle size={14} className="text-rose-600" />;
    dateText = "Overdue Task!";
  } else if (diffHrs < 24) {
    // JIKA HARI INI
    dateContainerClass =
      "bg-amber-100/90 border-amber-300 text-amber-800 font-black ring-2 ring-amber-500/20";
    dateIcon = (
      <Zap size={14} className="text-amber-600 fill-amber-600 animate-bounce" />
    );

    // Tampilkan Jam jika > 0, jika tidak tampilkan Menit
    dateText =
      diffHrs > 0
        ? `Due in ${diffHrs}h ${diffMins}m`
        : `Due in ${diffMins} mins!`;
  } else if (diffDays <= 2) {
    dateContainerClass =
      "bg-yellow-50 border-yellow-200 text-yellow-700 font-bold";
    dateText = `${diffDays} days left`;
  }

  // Priority Styling
  const priorityTheme =
    {
      high: "text-rose-600 border-rose-200 bg-rose-50/60",
      medium: "text-amber-600 border-amber-200 bg-amber-50/60",
      low: "text-emerald-600 border-emerald-200 bg-emerald-50/60",
    }[priority as "high" | "medium" | "low"] ||
    "text-slate-600 border-slate-200 bg-slate-50/60";

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="group relative w-full mb-4 flex flex-col gap-4 p-5 bg-white/40 backdrop-blur-xl rounded-[28px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:bg-white/70 hover:-translate-y-1 transition-all duration-300 cursor-grab active:cursor-grabbing overflow-hidden"
    >
      {/* 1. HEADER: LABEL & PROGRESS BADGE */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${priorityTheme}`}
          >
            <AlertCircle size={12} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {priority}
            </span>
          </div>
        </div>

        {/* PROGRESS BADGE (MODERN LOOK) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
          <Gauge size={14} strokeWidth={2.5} className="text-indigo-500" />
          <span className="text-[11px] font-black tracking-tighter">
            {progress}%
          </span>
        </div>
      </div>

      {/* 2. CONTENT */}
      <div className="space-y-1">
        <h4 className="text-slate-900 font-extrabold text-[17px] tracking-tight leading-snug group-hover:text-indigo-700 transition-colors">
          {title}
        </h4>
        <p className="text-slate-500/90 text-[13px] font-medium line-clamp-2 leading-relaxed">
          {description || "No description provided."}
        </p>
      </div>

      {/* 3. TAGS */}
      <div className="flex flex-wrap gap-1.5">
        {tags?.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/80 border border-white/50 text-[10px] font-bold text-slate-500 shadow-sm"
          >
            <Tag size={10} className="text-indigo-400" />
            {tag.title}
          </div>
        ))}
      </div>

      {/* 4. PROGRESS BAR (Dynamic Gradient) */}
      <div className="relative w-full h-2 bg-slate-200/40 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r rounded-full transition-all duration-700 shadow-lg ${getProgressColorClass(
            progress
          )}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 5. FOOTER: TIMELINE & ACTIONS */}
      <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/50">
        {/* Detail Timeline Informatif */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-sm transition-all duration-300 ${dateContainerClass}`}
        >
          {dateIcon}
          <span className="text-[10px] uppercase font-black tracking-tight">
            {dateText}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5">
          {[
            {
              icon: Eye,
              color: "hover:text-indigo-600 hover:bg-indigo-50",
              action: onView,
              label: "View",
            },
            {
              icon: Pencil,
              color: "hover:text-amber-600 hover:bg-amber-50",
              action: onEdit,
              label: "Edit",
            },
            {
              icon: Trash2,
              color: "hover:text-rose-600 hover:bg-rose-50",
              action: onDelete,
              label: "Delete",
            },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`p-2 text-slate-400 ${btn.color} rounded-xl transition-all active:scale-90`}
              title={btn.label}
            >
              <btn.icon size={18} strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Task;
