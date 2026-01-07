import React, { useState } from "react";

// Typing untuk data user dan tugas
type UserTask = {
  id: number;
  name: string;
  task: string[];
};

const UserTaskPage: React.FC = () => {
  // Data pengguna dan tugas
  const [users, setUsers] = useState<UserTask[]>([
    { id: 1, name: "Alice", task: ["Task 1", "Task 2"] },
    { id: 2, name: "Bob", task: ["Task 3", "Task 4"] },
    { id: 3, name: "Charlie", task: ["Task 5"] },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<string>("");

  // Filter user berdasarkan nama
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menambahkan task ke pengguna yang dipilih
  const handleAddTask = () => {
    if (selectedUserId && newTask) {
      setUsers(
        users.map((user) =>
          user.id === selectedUserId
            ? { ...user, task: [...user.task, newTask] }
            : user
        )
      );
      setNewTask(""); // Clear task input after adding
    }
  };

  return (
    <div className="container m-5 bg-white mx-auto p-6 rounded-lg shadow-lg">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
        User Task Management
      </h1>

      {/* Filter and Add Task Section */}
      <div className="flex justify-between items-center space-x-6 mb-6">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Select User Dropdown */}
        <div className="flex-1">
          <select
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            <option value="" disabled>
              Select User
            </option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Task Button */}
        <div>
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Input untuk menambah task */}
      {selectedUserId && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="New task"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">{user.id}</td>
                  <td className="py-3 px-6 border-b">{user.name}</td>
                  <td className="py-3 px-6 border-b">{user.task.join(", ")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-3 px-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTaskPage;
