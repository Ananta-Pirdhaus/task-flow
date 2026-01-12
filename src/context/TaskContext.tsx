import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Columns, TaskData } from "../types/task";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { DropResult } from "react-beautiful-dnd";
import { onDragEnd as dragLogic } from "../helpers/onDragEnd";
import Cookies from "js-cookie";

export type TaskModalMode = "add" | "edit" | "view";

interface TaskContextType {
  columns: Columns;
  loading: boolean;
  // Modal States
  modalOpen: boolean;
  modalMode: TaskModalMode;
  setModalOpen: (v: boolean) => void;
  setModalMode: (m: TaskModalMode) => void;
  // Selection States
  selectedColumn: keyof Columns;
  setSelectedColumn: (id: keyof Columns) => void;
  selectedTask: TaskData | null;
  setSelectedTask: (task: TaskData | null) => void;
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: any) => Promise<void>;
  editTask: (task: any) => Promise<void>;
  deleteTask: (taskId: string | number) => Promise<void>;
  onDragEnd: (result: DropResult) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

const defaultColumns: Columns = {
  backlog: { name: "Backlog", items: [] },
  inprogress: { name: "In Progress", items: [] },
  done: { name: "Done", items: [] },
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [columns, setColumns] = useState<Columns>(defaultColumns);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<TaskModalMode>("add");
  const [selectedColumn, setSelectedColumn] =
    useState<keyof Columns>("backlog");
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  const fetchTasks = async (p0?: boolean) => {
    const token = Cookies.get("token");
    const role = Cookies.get("role_name");
    const userId = Cookies.get("user_id");

    if (!token) return;

    try {
      setLoading(true);
      let endpoint = "/tasks";
      if (role === "Employee" && userId) endpoint = `/tasks/user/${userId}`;

      const res = await axiosInstance.get(endpoint);
      console.log("Full API response:", res);

      // fix: ambil array dari res atau res.data
      const tasks: TaskData[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      console.log("tasks array:", tasks);

      const structured: Columns = {
        backlog: { name: "Backlog", items: [] },
        inprogress: { name: "In Progress", items: [] },
        done: { name: "Done", items: [] },
      };

      tasks.forEach((task) => {
        const colKey = (task.task_type as keyof Columns) || "backlog";
        console.log(
          `Task ${task.id} | Title: ${task.title} | task_type: ${task.task_type} | role: ${role} -> column: ${colKey}`
        );
        if (structured[colKey]) structured[colKey].items.push(task);
      });

      console.log("structured columns before set:", structured);
      setColumns(structured);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (payload: any) => {
    try {
      // 1. Kirim data ke backend
      const { data } = await axiosInstance.post("/tasks", payload);

      // Asumsikan backend mengembalikan object task yang sudah punya ID dan format lengkap
      const newTask: TaskData = data;

      // 2. Update UI secara manual (Optimistic Update)
      setColumns((prev) => {
        const colKey = newTask.task_type || "backlog";

        // Salin state lama
        const updatedColumns = { ...prev };

        // JIKA kolom belum ada (misal user input tipe baru), buat kolomnya dulu
        if (!updatedColumns[colKey]) {
          updatedColumns[colKey] = {
            name: colKey.charAt(0).toUpperCase() + colKey.slice(1),
            items: [],
          };
        }

        // Tambahkan task baru ke dalam array items kolom tersebut
        updatedColumns[colKey] = {
          ...updatedColumns[colKey],
          items: [...updatedColumns[colKey].items, newTask],
        };

        return updatedColumns;
      });

      toast.success("Task created successfully!");

      // 3. Sinkronisasi background (tanpa loading spinner)
      // Ini penting jika ada field yang diisi otomatis oleh database (seperti created_at)
      fetchTasks(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  const editTask = async (updated: any) => {
    try {
      const { data } = await axiosInstance.put(`/tasks/${updated.id}`, updated);
      setColumns((prev) => {
        const copy = { ...prev };
        (Object.keys(copy) as (keyof Columns)[]).forEach((col) => {
          copy[col].items = copy[col].items.map((t) =>
            t.id === data.id ? data : t
          );
        });
        return copy;
      });
      toast.info("Task updated");
    } catch (err: any) {
      toast.error("Update failed");
    }
  };

  const deleteTask = async (taskId: string | number) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setColumns((prev) => {
        const copy = { ...prev };
        (Object.keys(copy) as (keyof Columns)[]).forEach((col) => {
          copy[col].items = copy[col].items.filter((t) => t.id !== taskId);
        });
        return copy;
      });
      toast.warn("Task deleted");
    } catch (err: any) {
      toast.error("Delete failed");
    }
  };

  const onDragEnd = (result: DropResult) => {
    dragLogic(result, columns, setColumns);
    // Note: Idealnya panggil API update task_type di sini
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        columns,
        loading,
        modalOpen,
        modalMode,
        setModalOpen,
        setModalMode,
        selectedColumn,
        setSelectedColumn,
        selectedTask,
        setSelectedTask,
        fetchTasks,
        addTask,
        editTask,
        deleteTask,
        onDragEnd,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
};
