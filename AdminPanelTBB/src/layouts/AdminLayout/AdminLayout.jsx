import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar/Sidebar';
import Header from '../../components/shared/Header/Header';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extra safety check (defense-in-depth, ProtectedRoute already handles main guard)
  const token = localStorage.getItem("token"); 
  const userStr = localStorage.getItem("user"); 

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user?.role !== "admin") {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  const handleToggle = () => {
    setSidebarCollapsed((current) => !current);
  };

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        open={sidebarOpen}
        onToggle={handleToggle}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`admin-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
          onCollapseSidebar={handleToggle}
        />
        <main className="admin-page-shell">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;