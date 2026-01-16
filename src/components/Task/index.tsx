import { DraggableProvided } from "react-beautiful-dnd";
import { TaskData, Tag } from "@/types/task"; // Pastikan path ini sesuai
import {
  Gauge,
  AlertCircle,
  CalendarDays,
  Eye,
  Pencil,
  Trash2,
  Tag as TagIcon,
  // Import icon tambahan untuk Project
  Folder,
  ChevronRight,
} from "lucide-react";
import { useTasks } from "@/context/TaskContext";

interface TaskProps {
  task: TaskData;
  provided: DraggableProvided;
  onDelete?: (id: string | number) => void;
}

// Style untuk priority (sedikit disesuaikan agar lebih pop-up)
const PRIORITY_CLASSES: Record<string, string> = {
  low: "text-emerald-700 border-emerald-300 bg-emerald-100/80",
  medium: "text-amber-700 border-amber-300 bg-amber-100/80",
  high: "text-rose-700 border-rose-300 bg-rose-100/80",
};

const getProgressColorClass = (progress: number) => {
  if (progress <= 25) return "from-rose-500 to-red-500 shadow-rose-500/40";
  if (progress <= 50)
    return "from-orange-500 to-amber-500 shadow-orange-500/40";
  if (progress <= 75) return "from-yellow-500 to-lime-500 shadow-yellow-500/40";
  return "from-green-500 to-teal-500 shadow-green-500/40";
};

const Task = ({ task, provided, onDelete }: TaskProps) => {
  const {
    title,
    description,
    priority,
    endDate,
    endTime,
    progress,
    tags,
    id,
    project, // Destructure project
  } = task;

  const { setModalOpen, setModalMode, setSelectedTask } = useTasks();

  /* ========================= LOGIC TANGGAL ========================= */
  // (Logika tanggal tidak berubah dari sebelumnya)
  const endDateTime = endDate
    ? new Date(`${endDate}T${endTime || "23:59:59"}`)
    : null;
  const now = new Date();
  const diffMs = endDateTime ? endDateTime.getTime() - now.getTime() : null;
  const diffHrs =
    diffMs !== null ? Math.floor(diffMs / (1000 * 60 * 60)) : null;
  const diffMins =
    diffMs !== null
      ? Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      : null;
  const diffDays =
    diffMs !== null ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;

  let dateContainerClass = "bg-white/50 border-white/20 text-slate-600";
  let dateText = endDate || "No due date";

  if (diffMs !== null) {
    if (diffMs < 0) {
      dateContainerClass =
        "bg-rose-100/80 border-rose-200 text-rose-700 font-bold animate-pulse";
      dateText = "Overdue!";
    } else if (diffHrs! < 24) {
      dateContainerClass =
        "bg-amber-100/90 border-amber-300 text-amber-800 font-black ring-2 ring-amber-500/20";
      dateText =
        diffHrs! > 0
          ? `Due in ${diffHrs}h ${diffMins}m`
          : `Due in ${diffMins} mins!`;
    } else if (diffDays! <= 2) {
      dateContainerClass =
        "bg-yellow-50 border-yellow-200 text-yellow-700 font-bold";
      dateText = `${diffDays} days left`;
    }
  }

  /* ========================= HANDLERS ========================= */
  const handleView = () => {
    setSelectedTask(task);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = () => {
    setSelectedTask(task);
    setModalMode("edit");
    setModalOpen(true);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      // Mengubah gap-4 menjadi gap-3 agar terlihat lebih rapi dengan struktur baru
      className="group relative w-full mb-4 flex flex-col gap-3 p-5 bg-white/40 backdrop-blur-xl rounded-[28px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:bg-white/70 transition-all duration-300 cursor-grab active:cursor-grabbing overflow-hidden"
    >
      {/* ================= SECTIONS HEADER BARU ================= */}
      <div className="flex justify-between items-center">
        {/* 1. PROJECT SECTION (PALING ATAS) */}
        {project && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-transform group-hover:scale-105 bg-white/50 border-white/30 text-indigo-600">
            <Folder size={14} className="text-indigo-500/80" />
            <span className="text-[11px] font-bold tracking-tight">
              {project.name}
            </span>
            {/* Icon panah kecil untuk kesan breadcrumb */}
            <ChevronRight size={12} className="text-indigo-300" />
          </div>
        )}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-100 text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
          <Gauge size={14} strokeWidth={2.5} className="text-indigo-500" />
          <span className="text-[11px] font-black tracking-tighter">
            {progress}%
          </span>
        </div>
      </div>

      {/* 2. PRIORITY & PROGRESS SECTION (DIBAWAH PROJECT) */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-transform group-hover:scale-105 ${
              PRIORITY_CLASSES[priority] || PRIORITY_CLASSES.low
            }`}
          >
            <AlertCircle size={12} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {priority} Priority
            </span>
          </div>
        </div>
      </div>

      {/* ================= END SECTIONS HEADER ================= */}

      {/* Title & Description (Diberi sedikit margin atas) */}
      <div className="space-y-1 mt-1">
        <h4 className="text-slate-900 font-extrabold text-[17px] tracking-tight leading-snug group-hover:text-indigo-700 transition-colors">
          {title}
        </h4>
        <p className="text-slate-500/90 text-[13px] font-medium line-clamp-2 leading-relaxed">
          {description || "No description"}
        </p>
      </div>

      {/* ================= TAGS DENGAN LOGIKA TRUNCATE (SESUAI REQUEST) ================= */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {/* Hanya tampilkan 2 tag pertama menggunakan slice(0, 2) */}
        {tags?.slice(0, 2).map((tag: Tag) => (
          <div
            key={tag.id}
            // Style tag dipercantik agar menyesuaikan warna tagnya secara dinamis namun tetap lembut
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold shadow-sm transition-all hover:scale-105"
            style={{
              backgroundColor: tag.color ? `${tag.color}15` : "#f8fafc", // 15% opacity hex
              borderColor: tag.color ? `${tag.color}40` : "#e2e8f0", // 40% opacity hex
              color: tag.color || "#475569",
            }}
          >
            <TagIcon size={10} className="opacity-70" />
            {tag.title}
          </div>
        ))}

        {/* Jika jumlah tag lebih dari 2, tampilkan indikator "..." */}
        {tags && tags.length > 2 && (
          <div
            className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-black tracking-widest shadow-sm cursor-help"
            title={`${tags.length - 2} more tags`}
          >
            ...
          </div>
        )}
      </div>
      {/* ================= END TAGS LOGIC ================= */}

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-slate-200/40 rounded-full overflow-hidden mt-1">
        <div
          className={`h-full bg-gradient-to-r rounded-full transition-all duration-700 shadow-lg ${getProgressColorClass(
            progress
          )}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/50">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-sm transition-all duration-300 ${dateContainerClass}`}
        >
          <CalendarDays size={14} />
          <span className="text-[10px] uppercase font-black tracking-tight">
            {dateText}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleView}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
          >
            <Eye size={18} strokeWidth={2.2} />
          </button>

          <button
            onClick={handleEdit}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all active:scale-90"
          >
            <Pencil size={18} strokeWidth={2.2} />
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
            >
              <Trash2 size={18} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
