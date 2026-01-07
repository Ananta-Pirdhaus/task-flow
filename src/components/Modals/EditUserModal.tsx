import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditUserModalProps {
  setShowModal: (show: boolean) => void;
  selectedUser: any;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  setShowModal,
  selectedUser,
}) => {
  const [name, setName] = useState(selectedUser?.name || "");
  const [email, setEmail] = useState(selectedUser?.email || "");
  const [role, setRole] = useState<string | number>(""); // Make role a string or number for easy comparison
  const [roles, setRoles] = useState<Array<any>>([]); // State to store roles
  const [loading, setLoading] = useState<boolean>(false); // Loading state for roles

  // Fetch roles when the modal is opened
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/roles");
        if (response.data.meta.status === "success") {
          setRoles(response.data.data.data);
        } else {
          toast.error("Failed to fetch roles: " + response.data.meta.message);
        }
      } catch (error) {
        toast.error("Error fetching roles: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setName(selectedUser?.name || "");
    setEmail(selectedUser?.email || "");
    setRole(selectedUser?.role_id || "");
  }, [selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/users/${selectedUser.user_id}`,
        {
          name,
          email,
          role: role ? [role] : [], // Send role as an array
        }
      );
      if (response.data.meta.status === "success") {
        toast.success("User updated successfully!"); // Success toast
        console.log("DATA UPDATE USER:", response.data);
        setShowModal(false); // Close modal after success
      } else {
        toast.error("Failed to update user: " + response.data.meta.message); // Error toast
      }
    } catch (error) {
      toast.error("Error updating user: " + error.message); // Error toast
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full mt-2 px-4 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-2 px-4 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="w-full mt-2 px-4 py-2 border rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading} // Disable select when loading roles
            >
              <option value="">Select Role</option>
              {loading ? (
                <option>Loading roles...</option>
              ) : (
                roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={() => setShowModal(false)} // Close modal
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditUserModal;
