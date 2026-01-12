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

  modalOpen: boolean;
  modalMode: TaskModalMode;
  setModalOpen: (v: boolean) => void;
  setModalMode: (m: TaskModalMode) => void;

  selectedColumn: keyof Columns;
  setSelectedColumn: (id: keyof Columns) => void;
  selectedTask: TaskData | null;
  setSelectedTask: (task: TaskData | null) => void;

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

  // Ambil dari cookies
  const role = Cookies.get("role_name");
  const userId = Cookies.get("user_id");

  /* ========================= FETCH ========================= */
  const fetchTasks = async () => {
    if (role === "Employee" && !userId) return;

    try {
      setLoading(true);

      const endpoint = role === "Employee" ? `/tasks/user/${userId}` : `/tasks`;

      const res = await axiosInstance.get(endpoint);

      const tasks: TaskData[] = Array.isArray(res.data) ? res.data : [];

      const structured: Columns = {
        backlog: { name: "Backlog", items: [] },
        inprogress: { name: "In Progress", items: [] },
        done: { name: "Done", items: [] },
      };

      tasks.forEach((task) => {
        const key: keyof Columns =
          task.taskType === "backlog" ||
          task.taskType === "inprogress" ||
          task.taskType === "done"
            ? task.taskType
            : "backlog";

        structured[key].items.push({ ...task, taskType: key });
      });

      setColumns(structured);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= ADD ========================= */
  const addTask = async (payload: any) => {
    try {
      const endpoint = role === "Employee" ? `/tasks/user/${userId}` : `/tasks`;

      const { data } = await axiosInstance.post(endpoint, payload);

      const task: TaskData = {
        ...data,
        task_type: data.task_type || selectedColumn,
      };

      setColumns((prev) => ({
        ...prev,
        [task.taskType]: {
          ...prev[task.taskType],
          items: [...prev[task.taskType].items, task],
        },
      }));

      toast.success("Task created");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Add task failed");
    }
  };

  /* ========================= EDIT ========================= */
  const editTask = async (updated: any) => {
    try {
      const endpoint =
        role === "Employee"
          ? `/tasks/${updated.id}/user/${userId}`
          : `/tasks/${updated.id}`;

      const { data } = await axiosInstance.put(endpoint, updated);

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
    } catch {
      toast.error("Update failed");
    }
  };


  /* ========================= DELETE ========================= */
  const deleteTask = async (taskId: string | number) => {
    try {
      const endpoint =
        role === "Employee"
          ? `/tasks/${taskId}/user/${userId}`
          : `/tasks/${taskId}`;

      await axiosInstance.delete(endpoint);

      setColumns((prev) => {
        const copy = { ...prev };
        (Object.keys(copy) as (keyof Columns)[]).forEach((col) => {
          copy[col].items = copy[col].items.filter((t) => t.id !== taskId);
        });
        return copy;
      });

      toast.warn("Task deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ========================= DRAG ========================= */
  const onDragEnd = (result: DropResult) => {
    dragLogic(result, columns, setColumns);
    // bisa panggil API update task_type di sini
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
