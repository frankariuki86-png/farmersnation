import React, { useEffect, useState } from 'react';
import { FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { trainingAPI } from '../services/api';

export default function AdminTraining() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const response = await trainingAPI.getAllAdmin();
      setRows(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch training registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await trainingAPI.updateStatus(id, { status });
      toast.success('Status updated');
      fetchRows();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await trainingAPI.delete(id);
      toast.success('Registration deleted');
      fetchRows();
    } catch (error) {
      toast.error('Failed to delete registration');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary-green">Training Registrations</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="hidden md:table w-full">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Topic</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{row.full_name}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3">{row.training_topic}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => deleteRow(row.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-gray-500">No training registrations yet.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="md:hidden divide-y">
          {rows.map((row) => (
            <div key={row.id} className="p-4 space-y-2">
              <p className="font-semibold text-primary-green">{row.full_name}</p>
              <p className="text-sm text-gray-600">Phone: {row.phone}</p>
              <p className="text-sm text-gray-600">Topic: {row.training_topic}</p>
              <select
                value={row.status}
                onChange={(e) => updateStatus(row.id, e.target.value)}
                className="border rounded p-2 text-sm w-full"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => deleteRow(row.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                <FaTrash /> Delete
              </button>
            </div>
          ))}
          {!rows.length && <p className="p-4 text-gray-500">No training registrations yet.</p>}
        </div>
      </div>
    </div>
  );
}
