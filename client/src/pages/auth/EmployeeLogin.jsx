import React from 'react';
import Login from './Login';

/**
 * Dedicated Employee Login Page for TaskFlow.
 * Preserves the exact original TaskFlow theme and branding from Screenshot 2,
 * pre-selected to the Employee role portal with proper employee authentication.
 */
export const EmployeeLogin = () => {
  return <Login roleMode="EMPLOYEE" />;
};

export default EmployeeLogin;
