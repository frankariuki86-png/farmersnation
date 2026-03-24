import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { farmVisitAPI } from '../services/api';

export default function FarmVisitPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    requesterName: '',
    phone: '',
    email: '',
    visitType: 'visit_my_farm',
    farmLocation: '',
    preferredDate: '',
    purpose: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await farmVisitAPI.create(formData);
      toast.success('Farm visit booking submitted');
      setFormData({
        requesterName: '',
        phone: '',
        email: '',
        visitType: 'visit_my_farm',
        farmLocation: '',
        preferredDate: '',
        purpose: ''
      });
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-3">Book a Farm Visit</h1>
          <p className="text-gray-600 mb-10">
            Choose whether you want us to visit your farm or you want to visit our farm.
          </p>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl shadow p-6 space-y-4 border border-gray-200">
            <input
              type="text"
              placeholder="Your name"
              value={formData.requesterName}
              onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border rounded"
              />
            </div>
            <select
              value={formData.visitType}
              onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              className="w-full p-3 border rounded"
            >
              <option value="visit_my_farm">I want FARMERS NATION to visit my farm</option>
              <option value="visit_your_farm">I want to visit FARMERS NATION farm</option>
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Farm location"
                value={formData.farmLocation}
                onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full p-3 border rounded"
              />
            </div>
            <textarea
              placeholder="Purpose of visit"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full p-3 border rounded"
              rows="4"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-secondary-green disabled:opacity-50 font-semibold"
            >
              {loading ? <FaSpinner className="animate-spin inline" /> : 'Book Visit'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
