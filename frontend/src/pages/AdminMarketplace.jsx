import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { marketplaceAPI } from '../services/api';

export default function AdminMarketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: '',
    stock: '',
    isAvailable: true,
    image: null
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getAllAdmin(1);
      setProducts(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', price: '', unit: '', stock: '', isAvailable: true, image: null });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setShowForm(true);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: item.price || '',
      unit: item.unit || '',
      stock: item.stock || 0,
      isAvailable: item.is_available !== false,
      image: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('unit', formData.unit);
      payload.append('stock', formData.stock);
      payload.append('isAvailable', formData.isAvailable);

      if (formData.image) {
        payload.append('image', formData.image);
      }

      if (editingId) {
        await marketplaceAPI.update(editingId, payload);
        toast.success('Product updated successfully');
      } else {
        await marketplaceAPI.create(payload);
        toast.success('Product created successfully');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to save product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      await marketplaceAPI.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
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
        <h1 className="text-3xl font-bold text-primary-green">Marketplace Management</h1>
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
          <FaPlus /> New Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Unit (e.g. kg, crate)"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            />
            <span>Available</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green disabled:opacity-50" disabled={loading}>
              {loading ? <FaSpinner className="animate-spin" /> : editingId ? 'Update Product' : 'Create Product'}
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
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3 capitalize">{item.category}</td>
                <td className="px-6 py-3">KSH {item.price}</td>
                <td className="px-6 py-3">{item.stock}</td>
                <td className="px-6 py-3 text-center">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td className="px-6 py-4 text-gray-500" colSpan={5}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
