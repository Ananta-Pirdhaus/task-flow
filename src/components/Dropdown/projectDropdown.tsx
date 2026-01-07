import React from "react";

interface ProjectDropdownProps {
  projects: { id: number; name: string }[]; // Props berupa array object yang berisi id dan nama project
  onSelectProject: (projectId: number) => void; // Fungsi callback untuk menangani event pemilihan project
  label?: string; // Label opsional untuk dropdown
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  projects,
  onSelectProject,
  label,
}) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = Number(event.target.value);
    onSelectProject(selectedProjectId); // Memanggil callback saat project dipilih
  };

  return (
    <div className="w-full max-w-xs">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <select
        onChange={handleSelect}
        className="block w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      >
        <option value="" disabled selected>
          Pilih Project
        </option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectDropdown;
