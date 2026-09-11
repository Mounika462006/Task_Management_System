import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, RefreshCw, AlertCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import EmployeeTable from '../../components/employees/EmployeeTable';
import EmployeeFormModal from '../../components/employees/EmployeeFormModal';
import Modal from '../../components/common/Modal';
import { Spinner, EmptyState } from '../../components/common/Spinner';
import { employeeService } from '../../services/employeeService';

const DEPARTMENTS = [
  'ALL',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await employeeService.getEmployees();
      if (res.success) {
        setEmployees(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load employees from server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateEmployee = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee._id, formData);
        showToast('Employee account updated successfully.');
      } else {
        await employeeService.createEmployee(formData);
        showToast('Employee account created successfully.');
      }
      setIsFormModalOpen(false);
      setEditingEmployee(null);
      await fetchEmployees();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    setIsSubmitting(true);
    try {
      await employeeService.deleteEmployee(deletingEmployee._id);
      showToast(`Employee "${deletingEmployee.name}" deleted successfully.`);
      setDeletingEmployee(null);
      await fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to delete employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side filtering across live data
  const filteredEmployees = employees.filter((emp) => {
    // Search query matching Name, Email, Employee ID, Username
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = emp.name?.toLowerCase().includes(q);
      const matchEmail = emp.email?.toLowerCase().includes(q);
      const matchEmpId = emp.employeeId?.toLowerCase().includes(q);
      const matchUser = emp.username?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchEmpId && !matchUser) {
        return false;
      }
    }

    // Department filter
    if (departmentFilter !== 'ALL') {
      if ((emp.department || 'Engineering') !== departmentFilter) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      if ((emp.status || 'ACTIVE') !== statusFilter) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <Header
        title="Employee Management"
        subtitle="Manage employees, accounts and access."
        actions={
          <button
            id="admin-add-employee-btn"
            className="btn btn-primary"
            onClick={() => {
              setEditingEmployee(null);
              setIsFormModalOpen(true);
            }}
          >
            <UserPlus size={16} />
            <span>Add Employee</span>
          </button>
        }
      />

      <div className="page-wrapper">
        {toastMessage && (
          <div className="toast-container">
            <div className="toast">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Search & Filters Toolbar */}
        <div className="card" style={{ padding: '1.125rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="employee-search-input"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search employee by name, email, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <select
              id="employee-department-filter"
              className="form-control"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              id="employee-status-filter"
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            {/* Total Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Showing: <strong style={{ color: 'var(--text-main)' }}>{filteredEmployees.length}</strong> of{' '}
                {employees.length} employees
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <Spinner size={36} text="Loading employee directory..." />
        ) : error ? (
          <div
            style={{
              padding: '2rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#dc2626',
            }}
          >
            <p>{error}</p>
            <button
              className="btn btn-secondary"
              onClick={fetchEmployees}
              style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={
              search || departmentFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'No staff members match the selected filters. Try clearing your search.'
                : 'No employees have been registered yet. Add your first employee above.'
            }
            icon={Users}
            action={
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingEmployee(null);
                  setIsFormModalOpen(true);
                }}
              >
                <UserPlus size={16} />
                <span>Add Employee</span>
              </button>
            }
          />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={(emp) => {
              setEditingEmployee(emp);
              setIsFormModalOpen(true);
            }}
            onDelete={(emp) => setDeletingEmployee(emp)}
          />
        )}

        {/* Add / Edit Employee Modal */}
        <EmployeeFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingEmployee(null);
          }}
          onSubmit={handleCreateOrUpdateEmployee}
          initialData={editingEmployee}
          isSubmitting={isSubmitting}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(deletingEmployee)}
          onClose={() => setDeletingEmployee(null)}
          title="Delete Employee Account"
          maxWidth="460px"
        >
          <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={20} />
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 600, fontSize: '0.95rem' }}>
                Are you sure you want to delete {deletingEmployee?.name}?
              </p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                This will permanently delete the employee's account ({deletingEmployee?.email}). Any active tasks assigned to them will be marked unassigned. This action cannot be undone.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeletingEmployee(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              id="confirm-delete-employee-btn"
              className="btn btn-danger"
              onClick={handleDeleteEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Employee'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Employees;
