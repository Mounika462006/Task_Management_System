import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { SidebarProvider } from '../context/SidebarContext';

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
