import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const initialForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: ''
};

export default function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAdminUsers();
      setAdmins(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load admin users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setShowForm(true);
    setFormData({
      email: admin.email || '',
      password: '',
      firstName: admin.first_name || '',
      lastName: admin.last_name || '',
      phone: admin.phone || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingId) {
        await authAPI.updateAdminUser(editingId, payload);
        toast.success('Admin user updated');
      } else {
        if (!formData.password) {
          toast.error('Password is required for new admin user');
          return;
        }

        await authAPI.createAdminUser({ ...payload, password: formData.password });
        toast.success('Admin user created');
      }

      resetForm();
      fetchAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to save admin user');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin user?')) {
      return;
    }

    try {
      await authAPI.deleteAdminUser(id);
      toast.success('Admin user deleted');
      fetchAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to delete admin user');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-green">Admin Users Management</h1>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
              return;
            }

            setShowForm(true);
            setEditingId(null);
            setFormData(initialForm);
          }}
          className="bg-light-green text-primary-green px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-accent-green transition"
        >
          <FaPlus /> New Admin
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder={editingId ? 'New Password (leave blank to keep current)' : 'Password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : editingId ? 'Update Admin' : 'Create Admin'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="hidden md:table w-full">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{admin.email}</td>
                <td className="px-6 py-3">{[admin.first_name, admin.last_name].filter(Boolean).join(' ') || '-'}</td>
                <td className="px-6 py-3">{admin.phone || '-'}</td>
                <td className="px-6 py-3 flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(admin)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(admin.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {!admins.length && (
              <tr>
                <td className="px-6 py-4 text-gray-500" colSpan={4}>No admin users found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="md:hidden divide-y">
          {admins.map((admin) => (
            <div key={admin.id} className="p-4 space-y-2">
              <p className="font-semibold text-primary-green">{[admin.first_name, admin.last_name].filter(Boolean).join(' ') || 'Admin User'}</p>
              <p className="text-sm text-gray-600 break-all">{admin.email}</p>
              <p className="text-sm text-gray-600">Phone: {admin.phone || '-'}</p>
              <div className="flex items-center gap-4 pt-1">
                <button className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1" onClick={() => handleEdit(admin)}>
                  <FaEdit /> Edit
                </button>
                <button className="text-red-600 hover:text-red-800 inline-flex items-center gap-1" onClick={() => handleDelete(admin.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
          {!admins.length && <p className="p-4 text-gray-500">No admin users found.</p>}
        </div>
      </div>
    </div>
  );
}
