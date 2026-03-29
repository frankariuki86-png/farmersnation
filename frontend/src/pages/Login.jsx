import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import Footer from '../components/Footer';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.login(formData);
      login(response.data.data.user, response.data.data.token);
      toast.success('Login successful!');
      
      // Redirect based on role
      if ((response.data.data.user.role || '').toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-green to-secondary-green flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-primary-green mb-2 text-center">Welcome Back!</h2>
          <p className="text-gray-600 text-center mb-6">Sign in to your FARMERS NATION account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-light-green text-primary-green font-bold py-2 rounded-lg hover:bg-accent-green transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-light-green font-semibold hover:text-primary-green">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
