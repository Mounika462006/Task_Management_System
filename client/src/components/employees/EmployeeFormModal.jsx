import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

export const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setEmployeeId(initialData.employeeId || '');
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setDepartment(initialData.department || 'Engineering');
      setDesignation(initialData.designation || '');
      setDateOfJoining(
        initialData.dateOfJoining ? new Date(initialData.dateOfJoining).toISOString().split('T')[0] : ''
      );
      setUsername(initialData.username || '');
      setPassword('');
      setConfirmPassword('');
      setStatus(initialData.status || 'ACTIVE');
    } else {
      setEmployeeId('');
      setName('');
      setEmail('');
      setPhone('');
      setDepartment('Engineering');
      setDesignation('');
      setDateOfJoining(new Date().toISOString().split('T')[0]);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setStatus('ACTIVE');
    }
    setFieldErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!name.trim()) errors.name = 'Full Name is required';
    if (!email.trim()) errors.email = 'Valid email is required';

    if (!initialData) {
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (password && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (password) {
      if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      designation: designation.trim() || 'Team Member',
      dateOfJoining: dateOfJoining || new Date().toISOString(),
      username: username.trim() || undefined,
      employeeId: employeeId.trim() || undefined,
      status,
    };

    if (password) {
      payload.password = password;
      payload.confirmPassword = confirmPassword;
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const mapped = {};
        err.errors.forEach((e) => {
          mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
      } else {
        setFieldErrors({ general: err.message || 'Operation failed' });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Employee Profile' : 'Add New Employee'}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit} className="employee-modal-form">
        {fieldErrors.general && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {fieldErrors.general}
          </div>
        )}

        {/* Row 1: Employee ID & Full Name */}
        <div className="emp-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="emp-id">
              Employee ID
            </label>
            <input
              id="emp-id"
              type="text"
              className="form-control"
              placeholder="e.g. EMP-101"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            {fieldErrors.employeeId && <div className="form-error">{fieldErrors.employeeId}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emp-name">
              Full Name *
            </label>
            <input
              id="emp-name"
              type="text"
              className="form-control"
              placeholder="e.g. Rachel Adams"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
          </div>
        </div>

        {/* Row 2: Email & Phone Number */}
        <div className="emp-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="emp-email">
              Email Address *
            </label>
            <input
              id="emp-email"
              type="email"
              className="form-control"
              placeholder="rachel.adams@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emp-phone">
              Phone Number
            </label>
            <input
              id="emp-phone"
              type="tel"
              className="form-control"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {fieldErrors.phone && <div className="form-error">{fieldErrors.phone}</div>}
          </div>
        </div>

        {/* Row 3: Department & Designation */}
        <div className="emp-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="emp-department">
              Department
            </label>
            <select
              id="emp-department"
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {fieldErrors.department && <div className="form-error">{fieldErrors.department}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emp-designation">
              Designation
            </label>
            <input
              id="emp-designation"
              type="text"
              className="form-control"
              placeholder="e.g. Senior Software Engineer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            {fieldErrors.designation && <div className="form-error">{fieldErrors.designation}</div>}
          </div>
        </div>

        {/* Row 4: Date of Joining & Username */}
        <div className="emp-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="emp-date-joining">
              Date of Joining
            </label>
            <input
              id="emp-date-joining"
              type="date"
              className="form-control"
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
            />
            {fieldErrors.dateOfJoining && <div className="form-error">{fieldErrors.dateOfJoining}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emp-username">
              Username
            </label>
            <input
              id="emp-username"
              type="text"
              className="form-control"
              placeholder="e.g. racheladams"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {fieldErrors.username && <div className="form-error">{fieldErrors.username}</div>}
          </div>
        </div>

        {/* Row 5: Password & Confirm Password */}
        <div className="emp-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="emp-password">
              {initialData ? 'New Password (optional)' : 'Password *'}
            </label>
            <input
              id="emp-password"
              type="password"
              className="form-control"
              placeholder={initialData ? 'Leave blank to keep current' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emp-confirm-password">
              Confirm Password
            </label>
            <input
              id="emp-confirm-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {fieldErrors.confirmPassword && (
              <div className="form-error">{fieldErrors.confirmPassword}</div>
            )}
          </div>
        </div>

        {/* Row 6: Account Status */}
        <div className="form-group">
          <label className="form-label" htmlFor="emp-status">
            Account Status
          </label>
          <select
            id="emp-status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">Active (Can log in & work)</option>
            <option value="INACTIVE">Inactive (Disabled)</option>
            <option value="SUSPENDED">Suspended (Access blocked)</option>
          </select>
          {fieldErrors.status && <div className="form-error">{fieldErrors.status}</div>}
        </div>

        {/* Modal Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            id="save-emp-submit-btn"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : initialData
              ? 'Save Changes'
              : 'Create Employee'}
          </button>
        </div>

        <style>{`
          .emp-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          @media (max-width: 640px) {
            .emp-form-row {
              grid-template-columns: 1fr !important;
              gap: 0.5rem;
            }
          }
        `}</style>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
