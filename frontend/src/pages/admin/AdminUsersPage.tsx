import React, { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
} from "api";
import {
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiUserPlus,
  FiEdit,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { formatDate } from "../../utils/dateUtils";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
};

const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
  size: {
    md: "px-4 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-sm",
    icon: "p-2",
  },
  variant: {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow hover:shadow-md active:bg-blue-800",
    secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow hover:shadow-md active:bg-red-800",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200",
    dark: "bg-gray-800 text-white hover:bg-gray-700 shadow hover:shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 active:bg-gray-800",
  },
};

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "details" | "delete" | "add" | "edit"
  >("details");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "candidate",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      toast.success("User deleted successfully");
      setShowModal(false);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleCreateOrEdit = async () => {
    const isEdit = modalContent === "edit";
    try {
      if (isEdit && selectedUser) {
        const { password, ...rest } = form;
        const payload = password ? { ...rest, password } : rest;
        const updated = await updateUser(selectedUser.id, payload);
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updated.data : u))
        );
        toast.success("User updated successfully");
      } else {
        const res = await createUser(form);
        setUsers((prev) => [...prev, res.data]);
        toast.success("User created successfully");
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to submit");
    }
  };

  const filteredUsers = users.filter((u) => {
    const t = searchTerm.toLowerCase();
    return (
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t) ||
      u.role.toLowerCase().includes(t)
    );
  });

  const columns = [
    { 
      header: "Name", 
      accessor: (u: User) => (
        <span className="font-medium">{`${u.first_name} ${u.last_name}`}</span>
      ),
    },
    { header: "Email", accessor: (u: User) => u.email },
    { 
      header: "Role", 
      accessor: (u: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
          u.role === 'employer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {u.role}
        </span>
      ),
    },
    { 
      header: "Joined", 
      accessor: (u: User) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDate(u.created_at)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (u: User) => (
        <div className="flex gap-1">
          <button
            className={`${buttonStyles.base} ${buttonStyles.size.icon} ${buttonStyles.variant.ghost} text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300`}
            onClick={() => {
              setSelectedUser(u);
              setModalContent("details");
              setShowModal(true);
            }}
            title="View details"
          >
            <FiEye size={18} />
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.size.icon} ${buttonStyles.variant.ghost} text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300`}
            onClick={() => {
              setSelectedUser(u);
              setForm({
                email: u.email,
                first_name: u.first_name,
                last_name: u.last_name,
                role: u.role,
                password: "",
              });
              setModalContent("edit");
              setShowModal(true);
            }}
            title="Edit user"
          >
            <FiEdit size={18} />
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.size.icon} ${buttonStyles.variant.ghost} text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300`}
            onClick={() => {
              setSelectedUser(u);
              setModalContent("delete");
              setShowModal(true);
            }}
            title="Delete user"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage all registered users and their permissions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={fetchUsers}
              className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.secondary} gap-2`}
            >
              <FiRefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setForm({
                  email: "",
                  first_name: "",
                  last_name: "",
                  password: "",
                  role: "candidate",
                });
                setModalContent("add");
                setShowModal(true);
              }}
              className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.primary} gap-2`}
            >
              <FiUserPlus size={16} />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </span>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredUsers}
              emptyMessage={
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <FiSearch size={32} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    No users found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchTerm ? 'Try a different search term' : 'Add a new user to get started'}
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* --- Modal Content --- */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {modalContent === "details" && selectedUser && (
          <div className="w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Details</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className={`${buttonStyles.base} ${buttonStyles.size.icon} ${buttonStyles.variant.ghost} text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                    <p className="font-medium">{selectedUser.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                    <p className="font-medium">{selectedUser.last_name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                    <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.secondary}`}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {modalContent === "delete" && selectedUser && (
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <FiTrash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete User</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedUser.email}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center gap-3">
              <button 
                className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.secondary}`}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.danger} gap-2`}
                onClick={handleDelete}
              >
                <FiTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        )}

        {(modalContent === "add" || modalContent === "edit") && (
          <div className="w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {modalContent === "add" ? "Add New User" : "Edit User"}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className={`${buttonStyles.base} ${buttonStyles.size.icon} ${buttonStyles.variant.ghost} text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    placeholder="John"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    placeholder="Doe"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="candidate">Candidate</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {modalContent === "add" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.secondary}`}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${buttonStyles.base} ${buttonStyles.size.md} ${buttonStyles.variant.primary} gap-2`}
                onClick={handleCreateOrEdit}
              >
                <FiCheck size={16} />
                {modalContent === "add" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}