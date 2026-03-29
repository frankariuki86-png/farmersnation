import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import GuidesPage from './pages/GuidesPage';
import MarketplacePage from './pages/MarketplacePage';
import TrainingPage from './pages/TrainingPage';
import FarmVisitPage from './pages/FarmVisitPage';
import BusinessPlansPage from './pages/BusinessPlansPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if ((user?.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/farm-visits" element={<FarmVisitPage />} />
        <Route path="/business-plans" element={<BusinessPlansPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/profile"
          element={
            <AuthenticatedRoute>
              <ProfilePage />
            </AuthenticatedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
