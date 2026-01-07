import React, { useState } from "react";
import { getRandomColors } from "../../helpers/getRandomColors";
import { v4 as uuidv4 } from "uuid";
import { axiosInstance } from "../../lib/axios";
import { TaskT, TagT } from "../../types";

interface Tag {
  title: string;
  bg: string;
  text: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTask: (taskData: any) => void;
}

const AddModal = ({
  isOpen,
  onClose,
  setOpen,
  handleAddTask,
}: AddModalProps) => {
  const initialTaskData = {
    id: uuidv4(),
    title: "",
    description: "",
    priority: "medium", // Default priority value
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    image: "",
    alt: "",
    tags: [] as Tag[],
    progress: 0,
  };

  const [taskData, setTaskData] = useState(initialTaskData);
  const [tagTitle, setTagTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target) {
          setTaskData({ ...taskData, image: e.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (tagTitle.trim() !== "") {
      const { bg, text } = getRandomColors();
      const newTag: Tag = { title: tagTitle.trim(), bg, text };
      setTaskData({ ...taskData, tags: [...taskData.tags, newTag] });
      setTagTitle("");
    }
  };

  const closeModal = () => {
    setOpen(false);
    onClose();
    setTaskData(initialTaskData);
  };

  const handleSubmit = async () => {
    // Check if the end date is provided
    if (!taskData.endDate) {
      setErrorMessage("The end date field is required.");
      return;
    }

    // Prepare the task data in the required format
    const taskToCreate = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      task_type: "Done", // Assuming task type is fixed as "Todo" here, otherwise make it dynamic
      progress: taskData.progress,
      tags: taskData.tags.map((tag) => ({
        title: tag.title,
        color: tag.bg, // Assuming color is the background color for the tag
      })),
    };

    try {
      // Send POST request to create the task
      const response = await axiosInstance.post("/tasks", taskToCreate);

      // Handle success (task created)
      console.log("Task created successfully:", response.data);
      handleAddTask(response.data); // Assuming handleAddTask is for updating local state after task creation
      closeModal();
    } catch (error) {
      // Handle error (e.g., task creation failed)
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div
      className={`w-screen h-screen place-items-center fixed top-0 left-0 ${
        isOpen ? "grid" : "hidden"
      }`}
    >
      <div
        className="w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20"
        onClick={closeModal}
      ></div>
      <div className="md:w-[30vw] w-[90%] bg-white rounded-lg shadow-md z-50 flex flex-col items-center gap-3 px-5 py-6">
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
        />
        <input
          type="text"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
        />
        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={taskData.startDate}
          onChange={handleChange}
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
        />
        <input
          type="date"
          name="endDate"
          value={taskData.endDate}
          onChange={handleChange}
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
        />
        <input
          type="time"
          name="startTime"
          value={taskData.startTime}
          onChange={handleChange}
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
        />

        <input
          type="time"
          name="endTime"
          value={taskData.endTime}
          onChange={handleChange}
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
        />

        <label className="w-full text-sm">Progress: {taskData.progress}%</label>
        <input
          type="range"
          name="progress"
          min="0"
          max="100"
          value={taskData.progress}
          onChange={handleChange}
          className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="text"
          value={tagTitle}
          onChange={(e) => setTagTitle(e.target.value)}
          placeholder="Tag Title"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
        />
        <button
          className="w-full rounded-md h-9 bg-slate-500 text-amber-50 font-medium"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
        <div className="w-full">
          {taskData.tags && <span>Tags:</span>}
          {taskData.tags.map((tag, index) => (
            <div
              key={index}
              className="inline-block mx-1 px-[10px] py-[2px] text-[13px] font-medium rounded-md"
              style={{ backgroundColor: tag.bg, color: tag.text }}
            >
              {tag.title}
            </div>
          ))}
        </div>
      
        <button
          className="w-full mt-3 rounded-md h-9 bg-orange-400 text-blue-50 font-medium"
          onClick={handleSubmit}
        >
          Submit Task
        </button>
      </div>
    </div>
  );
};

export default AddModal;
