import React, { useState } from 'react';
import { FaLeaf, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-primary-green text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <FaLeaf className="text-light-green text-2xl" />
            <span>FARMERS NATION</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="hover:text-light-green transition">Home</Link>
            <Link to="/guides" className="hover:text-light-green transition">Guides</Link>
            <Link to="/blog" className="hover:text-light-green transition">Blog</Link>
            <Link to="/marketplace" className="hover:text-light-green transition">Marketplace</Link>
            <Link to="/contact" className="hover:text-light-green transition">Contact</Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="bg-light-green text-gray-800 px-4 py-2 rounded hover:bg-accent-green transition">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-light-green transition">Login</Link>
                <Link to="/register" className="bg-light-green text-gray-800 px-4 py-2 rounded hover:bg-accent-green transition">
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-opacity-20 bg-white p-2 rounded hover:bg-opacity-30 transition"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-opacity-20 bg-white p-2 rounded"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:text-light-green transition py-2">Home</Link>
            <Link to="/guides" className="block hover:text-light-green transition py-2">Guides</Link>
            <Link to="/blog" className="block hover:text-light-green transition py-2">Blog</Link>
            <Link to="/marketplace" className="block hover:text-light-green transition py-2">Marketplace</Link>
            <Link to="/contact" className="block hover:text-light-green transition py-2">Contact</Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block bg-light-green text-gray-800 px-4 py-2 rounded mt-2">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={logout} className="block w-full text-left bg-red-600 px-4 py-2 rounded mt-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2">Login</Link>
                <Link to="/register" className="block bg-light-green text-gray-800 px-4 py-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
