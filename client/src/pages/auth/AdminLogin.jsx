import React from 'react';
import Login from './Login';

/**
 * Dedicated Admin Login Page for TaskFlow.
 * Preserves the exact original TaskFlow theme and branding from Screenshot 2,
 * pre-selected to the Administrator role portal with proper admin authentication.
 */
export const AdminLogin = () => {
  return <Login roleMode="ADMIN" />;
};

export default AdminLogin;
