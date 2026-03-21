import React, { useState } from 'react';
import { FaBook, FaBloggerB, FaStore, FaUsers, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { name: 'Farming Guides', icon: FaBook, path: '/admin/guides' },
    { name: 'Blog Posts', icon: FaBloggerB, path: '/admin/blogs' },
    { name: 'Marketplace', icon: FaStore, path: '/admin/marketplace' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary-green text-white p-2 rounded"
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
          <h2 className="text-2xl font-bold text-light-green">ADMIN PANEL</h2>
          <p className="text-sm text-gray-300">FARMERS NATION</p>
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
          className="absolute bottom-6 left-6 right-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition w-52"
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
