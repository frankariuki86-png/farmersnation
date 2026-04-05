import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { businessPlanAPI, getApiErrorMessage } from '../services/api';
import { getAssetUrl } from '../utils/url';

export default function AdminBusinessPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    isPublished: false,
    document: null
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await businessPlanAPI.getAllAdmin();
      setPlans(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load business plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', summary: '', content: '', category: '', isPublished: false, document: null });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setShowForm(true);
    setFormData({
      title: plan.title || '',
      summary: plan.summary || '',
      content: plan.content || '',
      category: plan.category || '',
      isPublished: !!plan.is_published,
      document: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('summary', formData.summary);
      payload.append('content', formData.content);
      payload.append('category', formData.category);
      payload.append('isPublished', formData.isPublished);
      if (formData.document) {
        payload.append('document', formData.document);
      }

      if (editingId) {
        await businessPlanAPI.update(editingId, payload);
        toast.success('Business plan updated');
      } else {
        await businessPlanAPI.create(payload);
        toast.success('Business plan created');
      }

      resetForm();
      fetchPlans();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save business plan'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this business plan?')) return;
    try {
      await businessPlanAPI.delete(id);
      toast.success('Business plan deleted');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete business plan');
    }
  };

  if (loading && !showForm) {
    return <div className="text-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-green">Business Plan eBooks Management</h1>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
              return;
            }
            setShowForm(true);
            setEditingId(null);
          }}
          className="bg-light-green text-primary-green px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-accent-green transition"
        >
          <FaPlus /> New eBook
        </button>
      </div>

      <p className="text-gray-600">Admin can create, edit, and delete business plan eBooks from this dashboard.</p>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Summary"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
          <textarea
            placeholder="Detailed content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows="6"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, document: e.target.files?.[0] || null })}
            required={!editingId}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <span>Publish</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green disabled:opacity-50" disabled={loading}>
              {loading ? <FaSpinner className="animate-spin" /> : editingId ? 'Update Plan' : 'Create Plan'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="hidden md:table w-full">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">eBook</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{plan.title}</td>
                <td className="px-6 py-3 capitalize">{plan.category}</td>
                <td className="px-6 py-3">
                  {plan.document_url ? (
                    <a
                      href={getAssetUrl(plan.document_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Open File
                    </a>
                  ) : (
                    <span className="text-gray-500">No file</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    plan.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {plan.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <button onClick={() => handleEdit(plan)} className="text-blue-600 hover:text-blue-800 mr-4 font-semibold inline-flex items-center gap-1">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {!plans.length && (
              <tr>
                <td className="px-6 py-4 text-gray-500" colSpan={5}>No business plans found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="md:hidden divide-y">
          {plans.map((plan) => (
            <div key={plan.id} className="p-4 space-y-2">
              <p className="font-semibold text-primary-green">{plan.title}</p>
              <p className="text-sm text-gray-600 capitalize">Category: {plan.category}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                plan.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {plan.is_published ? 'Published' : 'Draft'}
              </span>
              {plan.document_url && (
                <a
                  href={getAssetUrl(plan.document_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 text-sm underline"
                >
                  Open File
                </a>
              )}
              <div className="flex items-center gap-4 pt-1">
                <button onClick={() => handleEdit(plan)} className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
          {!plans.length && <p className="p-4 text-gray-500">No business plans found.</p>}
        </div>
      </div>
    </div>
  );
}
