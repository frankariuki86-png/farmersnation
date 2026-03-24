import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminGuides from './AdminGuides';
import AdminBlogs from './AdminBlogs';
import AdminMarketplace from './AdminMarketplace';
import AdminUsers from './AdminUsers';
import AdminTraining from './AdminTraining';
import AdminFarmVisits from './AdminFarmVisits';
import AdminBusinessPlans from './AdminBusinessPlans';
import { useLocation } from 'react-router-dom';

export default function AdminDashboard() {
  const location = useLocation();

  const renderContent = () => {
    const path = location.pathname;
    
    if (path.includes('/admin/guides')) {
      return <AdminGuides />;
    }

    if (path.includes('/admin/blogs')) {
      return <AdminBlogs />;
    }

    if (path.includes('/admin/marketplace')) {
      return <AdminMarketplace />;
    }

    if (path.includes('/admin/users')) {
      return <AdminUsers />;
    }

    if (path.includes('/admin/training')) {
      return <AdminTraining />;
    }

    if (path.includes('/admin/farm-visits')) {
      return <AdminFarmVisits />;
    }

    if (path.includes('/admin/business-plans')) {
      return <AdminBusinessPlans />;
    }

    return <AdminGuides />; // Default to guides
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-6">
        {renderContent()}
      </main>
    </div>
  );
}
