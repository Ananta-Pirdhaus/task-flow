import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axios";
import AddUserModal from "../../../components/Modals/AddUserModal";
import EditUserModal from "../../../components/Modals/EditUserModal";
import ToastProvider from "../../../helpers/onNotifications";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [roles, setRoles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        if (response.data.meta.status === "success") {
          setRoles(response.data.data.data);
        } else {
          console.error("Failed to fetch roles:", response.data.meta.message);
          toast.error("Failed to fetch roles.");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("An error occurred while fetching roles.", {
          autoClose: 5000,
        });
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/users/user");
        if (response.data.meta.status === "success") {
          setUsers(response.data.data);
          toast.success("Users fetched successfully!");
        } else {
          console.error("Failed to fetch users:", response.data.meta.message);
          toast.error("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("An error occurred while fetching users.", {
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
    toast.info(`Editing user: ${user.name}`);
  };

  const deleteUser = async (userId: number) => {
    console.log("User ID to delete:", userId); // Pastikan userId valid
    if (!userId) {
      toast.error("User ID is missing.");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `http://127.0.0.1:8000/api/v1/users/${userId}`
      );
      if (response.data.meta.status === "success") {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user.", {
        autoClose: 5000,
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole
      ? user.role_id.toString() === selectedRole
      : true;
    const matchesSearchTerm =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearchTerm;
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-orange-800">
        User Management
      </h1>
      <div className="flex space-x-4 mt-4 mb-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => setShowAddModal(true)}
        >
          Add User
        </button>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.role_id} value={role.role_id.toString()}>
              {role.role_name}
            </option>
          ))}
        </select>
      </div>

      {showAddModal && <AddUserModal setShowModal={setShowAddModal} />}
      {showEditModal && (
        <EditUserModal
          setShowModal={setShowEditModal}
          selectedUser={selectedUser}
        />
      )}

      {loading ? (
        <div className="mt-6 text-center text-gray-600">Loading users...</div>
      ) : (
        <table className="mt-6 w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left text-orange-800">
                Name
              </th>
              <th className="px-4 py-2 border-b text-left text-orange-800">
                Username
              </th>
              <th className="px-4 py-2 border-b text-left text-orange-800">
                Email
              </th>
              <th className="px-4 py-2 border-b text-left text-orange-800">
                Role
              </th>
              <th className="px-4 py-2 border-b text-left text-orange-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">
                  {
                    roles.find((role) => role.role_id === user.role_id)
                      ?.role_name
                  }
                </td>
                <td className="px-4 py-2 border-b flex items-center space-x-2">
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => deleteUser(user.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastProvider
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default UserManagement;
