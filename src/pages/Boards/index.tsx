import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { Columns, TaskData } from "../../types";
import { onDragEnd } from "../../helpers/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../../components/Modals/AddModal";
import EditModal from "../../components/Modals/EditModal";
import ViewModal from "../../components/Modals/ViewModal";
import Task from "../../components/Task";
import { toast } from "react-toastify";
import ToastProvider from "../../helpers/onNotifications";
import GenerateModal from "../../components/Modals/GenerateModal";
import { axiosInstance } from "../../lib/axios";

const fetchTasks = async (): Promise<Columns> => {
  try {
    const response = await axiosInstance.get("/tasks"); // API call to fetch tasks
    const data = response.data.data;

    // Structure columns based on your response format
    const columns: Columns = data.reduce((acc: any, task: any) => {
      const taskColumn = task.task_type.type || "General"; // Example: use task type to create column names
      if (!acc[taskColumn]) {
        acc[taskColumn] = { name: taskColumn, items: [] };
      }
      acc[taskColumn].items.push(task); // Add task to respective column
      return acc;
    }, {});

    // Add toast notification for successful fetch
    toast.success("Tasks loaded successfully!");

    return columns;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to load tasks.");
    return {};
  }
};

const Home = () => {
  const [columns, setColumns] = useState<Columns>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<any>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const fetchedColumns = await fetchTasks();
      setColumns(fetchedColumns);
    };

    loadTasks();
  }, []);

  const openModal = (columnId: string) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openViewTaskModal = (task: TaskData) => {
    setSelectedTask(task);
    setViewModalOpen(true);
    setEditModalOpen(false);
  };

  const openEditModal = (task: TaskData) => {
    setSelectedTask(task);
    setEditModalOpen(true);
    setViewModalOpen(false);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = (taskData: TaskData) => {
    const newBoard = { ...columns };
    newBoard[selectedColumn].items.push(taskData);
    setColumns(newBoard);
    toast.success("Task added successfully!");
  };

  const handleEditTask = (updatedTask: TaskData) => {
    const newColumns = { ...columns };
    const columnId = Object.keys(newColumns).find((id) =>
      newColumns[id].items.some((task) => task.id === updatedTask.id)
    );
    if (!columnId) return;

    const taskIndex = newColumns[columnId].items.findIndex(
      (task) => task.id === updatedTask.id
    );
    if (taskIndex === -1) return;

    newColumns[columnId].items[taskIndex] = updatedTask;
    setColumns(newColumns);
    toast.info("Task updated successfully!");
  };

  const handleDeleteTask = (taskId: any) => {
    const newColumns = { ...columns };
    const columnId = Object.keys(newColumns).find((id) =>
      newColumns[id].items.some((task) => task.id === taskId)
    );
    if (!columnId) return;

    newColumns[columnId].items = newColumns[columnId].items.filter(
      (task) => task.id !== taskId
    );

    setColumns(newColumns);
    toast.error("Task deleted successfully!");
  };

  return (
    <>
      <ToastProvider options={{ position: "top-right", autoClose: 3000 }} />
      <DragDropContext
        onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}
      >
        <div className="w-full flex items-start justify-between px-5 pb-8 md:gap-2 gap-10">
          {Object.entries(columns).map(([columnId, column]: [string, any]) => (
            <div className="w-full flex flex-col gap-0" key={columnId}>
              <Droppable droppableId={columnId}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
                  >
                    <div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
                      {column.name}
                    </div>
                    {column.items.map((task: any, index: any) => (
                      <Draggable
                        key={task.id.toString()}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided: any) => (
                          <Task
                            provided={provided}
                            task={task}
                            onView={() => openViewTaskModal(task)}
                            onEdit={() => openEditModal(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Add Task button inside the column */}
                    <div
                      onClick={() => openModal(columnId)}
                      className="flex cursor-pointer items-center justify-center gap-1 py-[10px] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px] mt-2"
                    >
                      <AddOutline color={"#555"} />
                      Add Task
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AddModal
        isOpen={modalOpen}
        onClose={closeModal}
        setOpen={setModalOpen}
        handleAddTask={handleAddTask}
      />
      {selectedTask && (
        <>
          <EditModal
            isOpen={editModalOpen}
            onClose={closeEditModal}
            setOpen={setEditModalOpen}
            handleEditTask={handleEditTask}
            currentTaskData={selectedTask}
          />
          <ViewModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            task={selectedTask}
          />
        </>
      )}
      <GenerateModal />
    </>
  );
};

export default Home;
