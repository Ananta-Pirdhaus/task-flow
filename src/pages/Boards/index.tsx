"use client";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTasks } from "../../context/TaskContext";
import TaskModal from "../../components/Modals/TaskModal";
import Task from "../../components/Task";
import GenerateModal from "../../components/Modals/GenerateModal";
import { PlusCircleIcon } from "lucide-react";

/* Skeleton Component */
const ColumnSkeleton = () => (
  <div className="w-[260px] flex flex-col gap-3">
    <div className="h-10 bg-slate-200 rounded animate-pulse" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-24 bg-slate-200 rounded animate-pulse" />
    ))}
  </div>
);

const Home = () => {
  const {
    columns,
    loading,
    onDragEnd,

    modalOpen,
    setModalOpen,
    setSelectedColumn,
    selectedTask,
    setSelectedTask,

    deleteTask,
  } = useTasks();

  if (loading) {
    return (
      <div className="flex gap-6 px-6">
        <ColumnSkeleton />
        <ColumnSkeleton />
        <ColumnSkeleton />
      </div>
    );
  }

  const columnStyles: Record<string, any> = {
    backlog: {
      border: "border-t-red-400",
      dot: "bg-red-400",
      bg: "bg-red-500/10",
    },
    inprogress: {
      border: "border-t-yellow-400",
      dot: "bg-yellow-400 animate-pulse",
      bg: "bg-yellow-500/10",
    },
    done: {
      border: "border-t-emerald-400",
      dot: "bg-emerald-400",
      bg: "bg-emerald-500/10",
    },
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[85vh] w-full p-6">
        <DragDropContext
          onDragEnd={(result) => {
            // Hanya update state jika drop berhasil
            if (!result.destination) return;
            onDragEnd(result);
          }}
        >
          <div className="flex gap-8 px-4 py-8 overflow-x-auto max-w-full items-start justify-center no-scrollbar">
            {Object.entries(columns).map(([columnId, column]) => {
              const styles = columnStyles[columnId] || {};

              return (
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-[320px] flex flex-col gap-4 p-5 rounded-3xl border-t-4 transition-all duration-300
                        ${styles.border}
                        ${
                          snapshot.isDraggingOver
                            ? "bg-white/30 scale-[1.02] shadow-2xl"
                            : "bg-white/10 shadow-xl"
                        }
                        backdrop-blur-xl border-x border-b border-white/20`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${styles.dot}`}
                          />
                          <h3 className="font-bold text-white text-sm tracking-widest uppercase">
                            {column.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-white/20 text-white">
                          {column.items.length}
                        </span>
                      </div>

                      {/* Tasks */}
                      <div className="flex flex-col gap-4 min-h-[200px]">
                        {column.items.length === 0 ? (
                          <div
                            className={`flex items-center justify-center py-12 rounded-2xl border-2 border-dashed border-white/10 ${styles.bg}`}
                          >
                            <p className="text-white/40 text-[10px] uppercase tracking-widest">
                              Empty Space
                            </p>
                          </div>
                        ) : (
                          column.items
                            .filter((task) => task?.id != null) // Filter task null/undefined
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`transition-transform ${
                                      snapshot.isDragging
                                        ? "rotate-2 scale-105"
                                        : "hover:-translate-y-1"
                                    }`}
                                  >
                                    <Task
                                      task={task}
                                      provided={provided}
                                      onView={() => {
                                        setSelectedTask(task);
                                        setModalOpen(true);
                                      }}
                                      onEdit={() => {
                                        setSelectedTask(task);
                                        setModalOpen(true);
                                      }}
                                      onDelete={() => deleteTask(task.id)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                      </div>

                      {/* Add Task */}
                      <button
                        onClick={() => {
                          setSelectedColumn(columnId as keyof typeof columns);
                          setSelectedTask(null);
                          setModalOpen(true);
                        }}
                        className="mt-2 py-3 rounded-xl bg-white/10 text-white flex items-center justify-center gap-2"
                      >
                        <PlusCircleIcon className="w-4 h-4" />
                        Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* SINGLE MODAL */}
      {modalOpen && <TaskModal isOpen={modalOpen} setOpen={setModalOpen} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />}

      <GenerateModal />
    </>
  );
};

export default Home;
