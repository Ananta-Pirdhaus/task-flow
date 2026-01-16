import React, { useEffect, useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { Link } from "react-router-dom";
import ProjectModal from "@/components/Modals/ProjectModal";
import type { Project } from "@/types/project";
import { Plus, Pencil, Trash2, Folder } from "lucide-react";

const ProjectList: React.FC = () => {
  const {
    projects,
    loading,
    fetchProjects, // ⬅️ PENTING
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Project | null>(null);

  /* =================== FETCH SAAT PERTAMA RENDER =================== */
  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [fetchProjects, projects.length]);

  /* =================== DEBUG =================== */
  useEffect(() => {
    console.log("📦 Data projects dari context:", projects);
  }, [projects]);

  const handleAdd = () => {
    setSelectedData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedData(project);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload: Partial<Project>) => {
    if (selectedData) {
      await updateProject(selectedData.id, payload);
    } else {
      await createProject(payload);
    }
    setIsModalOpen(false);
  };

  /* =================== LOADING STATE =================== */
  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center p-10 font-medium">
        Memuat data project...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500">
            Kelola semua project aktif Anda di sini.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Plus size={18} />
          Tambah Project
        </button>
      </div>

      {/* Content */}
      {!projects.length ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <Folder className="mx-auto text-gray-300 mb-2" size={48} />
          <p className="text-gray-500 text-lg">
            Belum ada project yang dibuat.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white border p-5 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Folder size={20} />
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 hover:text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h2 className="font-bold text-gray-800 truncate">
                {project.name}
              </h2>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedData}
        title={selectedData ? "Edit Project" : "Tambah Project Baru"}
      />
    </div>
  );
};

export default ProjectList;
