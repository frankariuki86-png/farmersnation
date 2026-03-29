import React, { useEffect, useState } from 'react';
import { FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { farmVisitAPI } from '../services/api';

export default function AdminFarmVisits() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const response = await farmVisitAPI.getAllAdmin();
      setRows(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch farm visit bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await farmVisitAPI.updateStatus(id, { status });
      toast.success('Status updated');
      fetchRows();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await farmVisitAPI.delete(id);
      toast.success('Booking deleted');
      fetchRows();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const labelVisitType = (visitType) => {
    if (visitType === 'visit_my_farm') return 'Visit my farm';
    if (visitType === 'visit_your_farm') return 'Visit your farm';
    return visitType;
  };

  if (loading) {
    return <div className="text-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary-green">Farm Visit Bookings</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="hidden md:table w-full">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{row.requester_name}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3">{labelVisitType(row.visit_type)}</td>
                <td className="px-4 py-3">{row.farm_location}</td>
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
                <td colSpan={6} className="px-4 py-4 text-gray-500">No farm visit bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="md:hidden divide-y">
          {rows.map((row) => (
            <div key={row.id} className="p-4 space-y-2">
              <p className="font-semibold text-primary-green">{row.requester_name}</p>
              <p className="text-sm text-gray-600">Phone: {row.phone}</p>
              <p className="text-sm text-gray-600">Type: {labelVisitType(row.visit_type)}</p>
              <p className="text-sm text-gray-600">Location: {row.farm_location}</p>
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
          {!rows.length && <p className="p-4 text-gray-500">No farm visit bookings yet.</p>}
        </div>
      </div>
    </div>
  );
}
