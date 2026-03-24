import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { trainingAPI } from '../services/api';

export default function TrainingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    trainingTopic: '',
    preferredDate: '',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await trainingAPI.register(formData);
      toast.success('Training registration submitted successfully');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        trainingTopic: '',
        preferredDate: '',
        location: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-3">Register for Training</h1>
          <p className="text-gray-600 mb-10">
            Join practical farming training sessions. Fill the form and our team will contact you.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
            <input
              type="text"
              placeholder="Training topic (e.g. Poultry, Dairy)"
              value={formData.trainingTopic}
              onChange={(e) => setFormData({ ...formData, trainingTopic: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full p-3 border rounded"
              />
              <input
                type="text"
                placeholder="Your location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border rounded"
              />
            </div>
            <textarea
              placeholder="Additional notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border rounded"
              rows="4"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-secondary-green disabled:opacity-50 font-semibold"
            >
              {loading ? <FaSpinner className="animate-spin inline" /> : 'Submit Registration'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
