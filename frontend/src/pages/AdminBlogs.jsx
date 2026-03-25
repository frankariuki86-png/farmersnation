import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { blogsAPI } from '../services/api';
import { getAssetUrl } from '../utils/url';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    isPublished: false,
    image: null
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAllAdmin(1);
      setBlogs(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', category: '', isPublished: false, image: null });
    setEditingId(null);
    setShowForm(false);
    setImagePreview(null);
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setShowForm(true);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || '',
      isPublished: !!blog.is_published,
      image: null
    });
    if (blog.image_url) {
      setImagePreview(getAssetUrl(blog.image_url));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('excerpt', formData.excerpt);
      payload.append('content', formData.content);
      payload.append('category', formData.category);
      payload.append('isPublished', formData.isPublished);

      if (formData.image) {
        payload.append('image', formData.image);
      }

      if (editingId) {
        await blogsAPI.update(editingId, payload);
        toast.success('Blog updated successfully');
      } else {
        await blogsAPI.create(payload);
        toast.success('Blog created successfully');
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to save blog');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) {
      return;
    }

    try {
      await blogsAPI.delete(id);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-green">Blog Management</h1>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
              return;
            }
            setShowForm(true);
            setEditingId(null);
          }}
          className="bg-light-green text-primary-green px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-accent-green transition"
        >
          <FaPlus /> New Blog
        </button>
      </div>

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
            placeholder="Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows="7"
            required
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="w-full p-2 border rounded"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData({ ...formData, image: file });
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</p>
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded border" />
            </div>
          )}
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
              {loading ? <FaSpinner className="animate-spin" /> : editingId ? 'Update Blog' : 'Create Blog'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="px-6 py-3 text-left">Photo</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">
                  {blog.image_url ? (
                    <img
                      src={getAssetUrl(blog.image_url)}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span>No Image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-3">{blog.title}</td>
                <td className="px-6 py-3 capitalize">{blog.category || 'general'}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    blog.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {!blogs.length && (
              <tr>
                <td className="px-6 py-4 text-gray-500" colSpan={5}>No blog posts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
