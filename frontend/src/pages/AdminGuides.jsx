import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { guidesAPI, getApiErrorMessage } from '../services/api';
import { getAssetUrl } from '../utils/url';

export default function AdminGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'poultry',
    description: '',
    content: '',
    isPublished: false,
    ebook: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await guidesAPI.getAllAdmin();
      setGuides(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch guides');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formBody = new FormData();
      formBody.append('title', formData.title);
      formBody.append('category', formData.category);
      formBody.append('description', formData.description);
      formBody.append('content', formData.content);
      formBody.append('isPublished', formData.isPublished);

      if (formData.ebook) {
        formBody.append('ebook', formData.ebook);
      }

      if (editingId) {
        await guidesAPI.update(editingId, formBody);
        toast.success('Guide updated successfully');
      } else {
        await guidesAPI.create(formBody);
        toast.success('Guide created successfully');
      }

      setFormData({ title: '', category: 'poultry', description: '', content: '', isPublished: false, ebook: null });
      setEditingId(null);
      setShowForm(false);
      fetchGuides();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save guide'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      try {
        await guidesAPI.delete(id);
        toast.success('Guide deleted successfully');
        fetchGuides();
      } catch (error) {
        toast.error('Failed to delete guide');
      }
    }
  };

  const handleEdit = (guide) => {
    setEditingId(guide.id);
    setShowForm(true);
    setFormData({
      title: guide.title || '',
      category: guide.category || 'poultry',
      description: guide.description || '',
      content: guide.content || '',
      isPublished: !!guide.is_published,
      ebook: null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-green">Farming Guides Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-light-green text-primary-green px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-accent-green transition"
        >
          <FaPlus /> New Guide
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Guide Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="poultry">Poultry Farming</option>
            <option value="goat">Goat Farming</option>
            <option value="dairy">Dairy Farming</option>
            <option value="crop">Crop Farming</option>
          </select>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
          <textarea
            placeholder="Full Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows="6"
            required
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, ebook: e.target.files?.[0] || null })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <span>Publish</span>
          </label>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Save Guide'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="hidden md:table w-full">
            <thead className="bg-primary-green text-white">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Document</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Views</th>
                <th className="px-6 py-3 text-left">Downloads</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{guide.title}</td>
                  <td className="px-6 py-3 capitalize">{guide.category}</td>
                  <td className="px-6 py-3">
                    {guide.ebook_url ? (
                      <a
                        href={getAssetUrl(guide.ebook_url)}
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
                      guide.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {guide.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-semibold">👁️ {guide.views || 0}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-semibold">📥 {guide.downloads || 0}</span>
                  </td>
                  <td className="px-6 py-3 flex justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(guide)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(guide.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {!guides.length && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={7}>No guides found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="md:hidden divide-y">
            {guides.map((guide) => (
              <div key={guide.id} className="p-4 space-y-2">
                <p className="font-semibold text-primary-green">{guide.title}</p>
                <p className="text-sm text-gray-600 capitalize">Category: {guide.category}</p>
                <p className="text-sm text-gray-600">Views: {guide.views || 0} | Downloads: {guide.downloads || 0}</p>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    guide.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {guide.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {guide.ebook_url && (
                  <a
                    href={getAssetUrl(guide.ebook_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline"
                  >
                    Open File
                  </a>
                )}
                <div className="flex items-center gap-4 pt-1">
                  <button className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1" onClick={() => handleEdit(guide)}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(guide.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
            {!guides.length && <p className="p-4 text-gray-500">No guides found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
