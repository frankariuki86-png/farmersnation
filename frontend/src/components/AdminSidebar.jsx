import React, { useEffect, useState } from 'react';
import { FaBook, FaBloggerB, FaStore, FaUsers, FaSignOutAlt, FaBars, FaTimes, FaChalkboardTeacher, FaTractor, FaChartLine } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { name: 'Farming Guides', icon: FaBook, path: '/admin/guides' },
    { name: 'Blog Posts', icon: FaBloggerB, path: '/admin/blogs' },
    { name: 'Marketplace', icon: FaStore, path: '/admin/marketplace' },
    { name: 'Training', icon: FaChalkboardTeacher, path: '/admin/training' },
    { name: 'Farm Visits', icon: FaTractor, path: '/admin/farm-visits' },
    { name: 'Business Plans', icon: FaChartLine, path: '/admin/business-plans' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsOpen(true);
    }
  }, []);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 left-3 z-50 bg-primary-green text-white p-2 rounded"
        aria-label="Toggle admin menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-primary-green text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-secondary-green">
          <div className="flex items-center gap-3">
            <img src="/farmersnation logo.jpeg" alt="Farmers Nation" className="h-10 w-10 rounded-full object-cover border border-light-green" />
            <div>
              <h2 className="text-xl font-bold text-light-green">ADMIN PANEL</h2>
              <p className="text-xs text-gray-300">FARMERS NATION</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition ${
                  isActive
                    ? 'bg-light-green text-primary-green font-semibold'
                    : 'hover:bg-secondary-green'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <IconComponent className="text-xl" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black opacity-50 z-40"
        ></div>
      )}
    </>
  );
}
