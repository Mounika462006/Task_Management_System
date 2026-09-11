import api from './api';

export const employeeService = {
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getEmployeeDashboard: async () => {
    const response = await api.get('/dashboard/employee');
    return response.data;
  },
};
