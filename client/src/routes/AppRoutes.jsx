import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

// Route Guards
import { ProtectedRoute, RoleRoute, PublicOnlyRoute } from './ProtectedRoute';

// Auth Pages (Unified Common Login)
import Login from '../pages/auth/Login';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Tasks from '../pages/admin/Tasks';
import AdminTaskDetails from '../pages/admin/TaskDetails';
import Employees from '../pages/admin/Employees';
import EmployeeDetails from '../pages/admin/EmployeeDetails';
import AdminProgress from '../pages/admin/AdminProgress';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import MyTasks from '../pages/employee/MyTasks';
import EmployeeTaskDetails from '../pages/employee/TaskDetails';
import EmployeeProgress from '../pages/employee/EmployeeProgress';
import ProfilePage from '../pages/employee/ProfilePage';

// Common Pages
import NotificationsPage from '../pages/common/NotificationsPage';
import SettingsPage from '../pages/common/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Single Unified Common Login Page */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      {/* Legacy / Helper Route Redirects (All point to common login) */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route path="/employee/login" element={<Navigate to="/login" replace />} />
      <Route path="/login/admin" element={<Navigate to="/login" replace />} />
      <Route path="/login/employee" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/employee/register" element={<Navigate to="/login" replace />} />
      <Route path="/verify-otp" element={<Navigate to="/login" replace />} />
      <Route path="/employee/verify-otp" element={<Navigate to="/login" replace />} />

      {/* 2. Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:id" element={<AdminTaskDetails />} />
        <Route path="progress" element={<AdminProgress />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 3. Employee Protected Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="tasks/:id" element={<EmployeeTaskDetails />} />
        <Route path="progress" element={<EmployeeProgress />} />
        <Route path="notifications" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 4. Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

