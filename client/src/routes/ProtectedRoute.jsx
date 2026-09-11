import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Spinner } from '../components/common/Spinner';

/**
 * Route guard that requires authentication.
 * Redirects to role-specific login if unauthenticated.
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <Spinner size={36} text="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Route guard that requires specific role(s).
 * If wrong role, bounces user to their own dashboard.
 */
export const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <Spinner size={36} text="Verifying permissions..." />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // If logged in as Employee trying to access Admin route, redirect to Employee Dashboard
    if (user?.role === 'EMPLOYEE') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    // If Admin trying to access Employee route, redirect to Admin Dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/**
 * Guard for public auth pages (login, register, role landing).
 * If user is already authenticated, redirects them to their respective dashboard.
 */
export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <Spinner size={36} text="Loading workspace..." />
      </div>
    );
  }

  if (user) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
};

export default { ProtectedRoute, RoleRoute, PublicOnlyRoute };
