import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../app/apiClient";
import { FiTrash2, FiSearch, FiEdit2 } from "react-icons/fi";

const PAGE_SIZE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modal, setModal] = useState({ open: false, userId: null, type: null });
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });

  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
const users = response.data.data || [];

const filtered = users.filter(
  (user) => user.role !== "Admin"
);

setUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
        if ([401, 403].includes(error.response?.status)) {
          alert("Access denied. Please login as admin.");
          navigate("/login");
        } else {
          setErrorMsg("Failed to load users. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  // Delete user
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Open modal
  const openModal = (type, user) => {
    setModal({ open: true, type, userId: user._id });
    if (type === "edit") {
      setEditData({ name: user.name, email: user.email, role: user.role });
    }
  };
  const closeModal = () => setModal({ open: false, type: null, userId: null });

  // Update user
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/admin/users/${modal.userId}`, editData);
      setUsers((prev) =>
        prev.map((user) => (user._id === modal.userId ? data.user : user))
      );
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const getProfileImage = (profileImage) => {
    if (!profileImage) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (profileImage.startsWith("uploads/") || profileImage.startsWith("/uploads/")) {
      return `http://localhost:3000${profileImage.startsWith("/") ? "" : "/"}${profileImage}`;
    }
    return profileImage;
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading)
    return (
      <p className="text-gray-600 dark:text-gray-300 text-center mt-6 animate-pulse">
        Loading users...
      </p>
    );
  if (errorMsg)
    return (
      <p className="text-red-600 dark:text-red-400 text-center mt-6">{errorMsg}</p>
    );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-400">
        Users
      </h2>

      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center w-full sm:w-64 border rounded-md px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
          <FiSearch className="text-gray-500 dark:text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-purple-200 dark:bg-purple-700 text-left">
            <tr>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2">
                    <img
                      src={getProfileImage(user.profileImage)}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 capitalize text-gray-700 dark:text-gray-300">
                    {user.role}
                  </td>
                  <td className="px-4 py-2 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openModal("delete", user)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() => openModal("edit", user)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      title="Edit User"
                    >
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            className="px-3 py-1 border rounded-md hover:bg-purple-100 dark:hover:bg-purple-800"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1
                  ? "bg-purple-500 text-white dark:bg-purple-600"
                  : "hover:bg-purple-100 dark:hover:bg-purple-800"
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded-md hover:bg-purple-100 dark:hover:bg-purple-800"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {modal.open && modal.type === "delete" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 sm:w-96 shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={() => handleDelete(modal.userId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modal.open && modal.type === "edit" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full sm:w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Edit User
            </h3>
            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
              <input
                type="text"
                placeholder="Name"
                className="px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                required
              />
              <select
                className="px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                required
              >
                <option value="User">User</option>
                <option value="Agent">Agent</option>
              </select>
              <div className="flex justify-end gap-4 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
