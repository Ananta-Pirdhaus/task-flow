import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Calendar,
  Clock,
  Tag,
  Layout,
  AlignLeft,
  Image as ImageIcon,
} from "lucide-react";
import { getRandomColors } from "../../helpers/getRandomColors";
import { useTasks } from "../../context/TaskContext";
import { TaskData } from "../../types/task";
import Cookies from "js-cookie";
import { useProjects } from "@/context/ProjectContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  setOpen: (val: boolean) => void;
  handleAddTask?: (taskData: TaskData) => void; // optional, for add mode
  handleEditTask?: (taskData: TaskData) => void; // optional, for edit mode
}

const TaskModal = ({ isOpen, onClose, setOpen }: TaskModalProps) => {
  const { modalMode, selectedColumn, selectedTask, addTask, editTask } =
    useTasks();
  const { projects, loading: projectLoading } = useProjects();
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState<any>({
    title: "",
    description: "",
    priority: "medium",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    image: null,
    alt: "",
    progress: "0",
    tags: [],
    projectId: null, // <-- baru
  });

  const [tagTitle, setTagTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Sync selectedTask when modalMode changes
  useEffect(() => {
    if ((modalMode === "edit" || modalMode === "view") && selectedTask) {
      setTaskData({
        ...selectedTask,
        projectId: selectedTask.project?.id ?? null, // 🔥 INI KUNCI UTAMA
        tags:
          selectedTask.tags?.map((t: any) => ({
            title: t.title,
            bg: t.color,
            text: "#000", // atau mapping warna teks sesuai logic kamu
          })) || [],
      });
    } else {
      setTaskData({
        title: "",
        description: "",
        priority: "medium",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        image: null,
        alt: "",
        progress: "0",
        tags: [],
        projectId: null,
      });
    }

    setErrorMessage("");
    setTagTitle("");
  }, [modalMode, selectedTask]);

  const isViewMode = modalMode === "view";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleAddTag = () => {
    if (!isViewMode && tagTitle.trim() !== "") {
      const { bg, text } = getRandomColors();
      setTaskData({
        ...taskData,
        tags: [...taskData.tags, { title: tagTitle.trim(), bg, text }],
      });
      setTagTitle("");
    }
  };

  const removeTag = (index: number) => {
    if (!isViewMode) {
      setTaskData({
        ...taskData,
        tags: taskData.tags.filter((_: any, i: number) => i !== index),
      });
    }
  };

  const closeModal = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (isViewMode) return;

    const userId = Cookies.get("user_id");
    if (!userId) {
      setErrorMessage("User session expired. Please login again.");
      return;
    }

    if (!taskData.title || !taskData.endDate || !taskData.projectId) {
      setErrorMessage("Title, End Date, dan Project wajib diisi.");
      return;
    }

    setLoading(true);

    const payload = {
      ...taskData,
      user_id: userId,
      taskType: selectedColumn || "backlog",
      tags: taskData.tags.map((t: any) => ({ title: t.title, color: t.bg })),
      projectId: taskData.projectId,
    };

    try {
      if (modalMode === "add") {
        await addTask(payload);
      } else if (modalMode === "edit") {
        await editTask(payload);
      }
      closeModal();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {modalMode === "add"
                ? "Add Task Information"
                : modalMode === "edit"
                ? "Edit Task Information"
                : "View Task"}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
              Section: {selectedColumn || "General"}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {errorMessage && (
            <div className="mb-6 p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Task Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Project
                </label>
                <select
                  value={taskData.projectId || ""}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      projectId: Number(e.target.value),
                    })
                  }
                  disabled={isViewMode || projectLoading}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-semibold text-slate-700 bg-white"
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {isViewMode && taskData.projectId && (
                <p className="text-sm text-slate-600 mt-1">
                  Project:{" "}
                  {projects.find((p) => p.id === taskData.projectId)?.name}
                </p>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layout size={14} className="text-orange-500" /> Task Title
                </label>
                <input
                  name="title"
                  value={taskData.title || ""}
                  onChange={handleChange}
                  placeholder="Task name here..."
                  disabled={isViewMode}
                  className={`w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-semibold text-slate-700 ${
                    isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft size={14} className="text-orange-500" />{" "}
                  Description
                </label>
                <textarea
                  name="description"
                  value={taskData.description || ""}
                  onChange={handleChange}
                  placeholder="Tell us about this task..."
                  disabled={isViewMode}
                  className={`w-full h-44 p-4 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none resize-none text-sm leading-relaxed ${
                    isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} className="text-orange-500" /> Alt Image
                </label>
                <input
                  name="alt"
                  value={taskData.alt || ""}
                  onChange={handleChange}
                  disabled={isViewMode}
                  placeholder="Image description..."
                  className={`w-full h-11 px-4 rounded-xl bg-slate-50 border-none text-sm outline-none font-medium ${
                    isViewMode ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            {/* Right: Settings */}
            <div className="lg:col-span-5 space-y-8 lg:border-l lg:pl-10 border-slate-100">
              {/* Priority */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Priority Level
                </label>
                <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                  {["low", "medium", "high"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        !isViewMode && setTaskData({ ...taskData, priority: p })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${
                        taskData.priority === p
                          ? "bg-orange-100 text-orange-600 shadow-sm border border-slate-200"
                          : "text-slate-400 hover:text-slate-600"
                      } ${isViewMode ? "cursor-not-allowed" : ""}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                  Progress Percentage{" "}
                  <span className="text-slate-900">{taskData.progress}%</span>
                </label>
                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={taskData.progress || "0"}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <Calendar size={12} /> Start Date
                    </span>
                    <input
                      type="date"
                      name="startDate"
                      value={taskData.startDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-lg p-2.5 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <Clock size={12} /> Time
                    </span>
                    <input
                      type="time"
                      name="startTime"
                      value={taskData.startTime}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-lg p-2.5 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter flex items-center gap-1">
                      <Calendar size={12} /> Due Date
                    </span>
                    <input
                      type="date"
                      name="endDate"
                      value={taskData.endDate}
                      onChange={handleChange}
                      className="w-full bg-red-50/50 border-none rounded-lg p-2.5 text-xs font-bold text-red-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter flex items-center gap-1">
                      <Clock size={12} /> Time
                    </span>
                    <input
                      type="time"
                      name="endTime"
                      value={taskData.endTime}
                      onChange={handleChange}
                      className="w-full bg-red-50/50 border-none rounded-lg p-2.5 text-xs font-bold text-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={14} className="text-orange-500" /> Task Tags
                </label>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                  <input
                    value={tagTitle}
                    onChange={(e) => setTagTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    disabled={isViewMode}
                    placeholder="Add tag..."
                    className="flex-1 bg-transparent px-3 py-2 text-xs outline-none font-medium"
                  />
                  {!isViewMode && (
                    <button
                      onClick={handleAddTag}
                      className="w-9 h-9 bg-white text-slate-800 shadow-sm border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {taskData.tags?.map((tag: any, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-2"
                      style={{ backgroundColor: tag.bg, color: tag.text }}
                    >
                      {tag.title}
                      {!isViewMode && (
                        <X
                          size={10}
                          className="cursor-pointer"
                          onClick={() => removeTag(idx)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-between">
          {modalMode !== "view" && (
            <p className="text-[10px] text-slate-400 font-medium italic">
              * Title and End Date are mandatory fields
            </p>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              onClick={closeModal}
            >
              {modalMode === "view" ? "CLOSE" : "DISCARD"}
            </button>
            {modalMode !== "view" && (
              <button
                disabled={loading}
                className="px-10 py-2.5 bg-orange-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50"
                onClick={handleSubmit}
              >
                {loading
                  ? "Saving..."
                  : modalMode === "add"
                  ? "Create New Task"
                  : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
