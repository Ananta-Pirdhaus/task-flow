import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-toastify";
import type { Project } from "@/types/project";
import type { AxiosResponse } from "axios";

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;

  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: number | string) => Promise<void>;
  createProject: (payload: Partial<Project>) => Promise<void>;
  updateProject: (
    id: number | string,
    payload: Partial<Project>
  ) => Promise<void>;
  deleteProject: (id: number | string) => Promise<void>;

  setSelectedProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  /* ========================= FETCH ALL ========================= */
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res: AxiosResponse<any> = await axiosInstance.get("/projects");

      // ⬇️ AMBIL DATA DENGAN AMAN (sesuai log kamu)
      const data: Project[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setProjects(data);
    } catch (err) {
      console.error("❌ fetchProjects error:", err);
      toast.error("Gagal mengambil data project");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= FETCH BY ID ========================= */
  const fetchProjectById = async (id: number | string) => {
    try {
      setLoading(true);

      const res: AxiosResponse<any> = await axiosInstance.get(
        `/projects/${id}`
      );

      const project: Project | null = res.data?.data ?? res.data ?? null;

      setSelectedProject(project);
    } catch (err) {
      console.error("❌ fetchProjectById error:", err);
      toast.error("Project tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= CREATE ========================= */
  const createProject = async (payload: Partial<Project>) => {
    try {
      const res: AxiosResponse<any> = await axiosInstance.post(
        "/projects",
        payload
      );

      const project: Project = res.data?.data ?? res.data;

      setProjects((prev) => [...prev, project]);
      toast.success("Project berhasil ditambahkan");
    } catch (err: any) {
      console.error("❌ createProject error:", err);
      toast.error(err.response?.data?.message || "Gagal menambahkan project");
    }
  };

  /* ========================= UPDATE ========================= */
  const updateProject = async (
    id: number | string,
    payload: Partial<Project>
  ) => {
    try {
      setLoading(true);

      const res: AxiosResponse<any> = await axiosInstance.put(
        `/projects/${id}`,
        payload
      );

      const updated: Project = res.data?.data ?? res.data;

      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));

      toast.success("Project berhasil diperbarui");
    } catch (err) {
      console.error("❌ updateProject error:", err);
      toast.error("Gagal memperbarui project");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= DELETE ========================= */
  const deleteProject = async (id: number | string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus project ini?")) return;

    try {
      await axiosInstance.delete(`/projects/${id}`);

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project berhasil dihapus");
    } catch (err) {
      console.error("❌ deleteProject error:", err);
      toast.error("Gagal menghapus project");
    }
  };

  /* ========================= INITIAL FETCH ========================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        loading,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProjects must be used inside ProjectProvider");
  }
  return ctx;
};
