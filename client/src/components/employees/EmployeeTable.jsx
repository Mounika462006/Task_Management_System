import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit2, Trash2, Eye } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

export const EmployeeTable = ({
  employees = [],
  onView = null,
  onEdit = null,
  onDelete = null,
}) => {
  const getStatusBadge = (status) => {
    const s = (status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
              }}
            />
            Active
          </span>
        );
      case 'PENDING':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#b45309',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
              }}
            />
            Pending
          </span>
        );
      case 'INACTIVE':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#94a3b8',
              }}
            />
            Inactive
          </span>
        );
      case 'SUSPENDED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#dc2626',
              }}
            />
            Suspended
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
              }}
            />
            Active
          </span>
        );
    }
  };

  return (
    <div className="table-container" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ width: '130px', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
              Employee ID
            </th>
            <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
              Name
            </th>
            <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
              Email
            </th>
            <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
              Department
            </th>
            <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
              Designation
            </th>
            <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
              Status
            </th>
            <th style={{ textAlign: 'right', width: '130px', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp._id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Employee ID */}
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    padding: '3px 7px',
                    borderRadius: '5px',
                    border: '1px solid #dbeafe',
                  }}
                >
                  {emp.employeeId || `EMP-${emp._id.slice(-4).toUpperCase()}`}
                </span>
              </td>

              {/* Name with initials avatar */}
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(emp.name)}
                  </div>
                  <div>
                    <Link
                      to={`/admin/employees/${emp._id}`}
                      style={{
                        fontWeight: 600,
                        color: '#0f172a',
                        display: 'block',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                    >
                      {emp.name}
                    </Link>
                    {emp.username && (
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>@{emp.username}</div>
                    )}
                  </div>
                </div>
              </td>

              {/* Email */}
              <td style={{ padding: '12px 16px', color: '#475569', fontSize: '0.84375rem' }}>
                {emp.email}
              </td>

              {/* Department */}
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: '#334155',
                    fontWeight: 500,
                  }}
                >
                  {emp.department || 'Engineering'}
                </span>
              </td>

              {/* Designation */}
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: '#64748b',
                  }}
                >
                  {emp.designation || 'Team Member'}
                </span>
              </td>

              {/* Status */}
              <td style={{ padding: '12px 16px' }}>{getStatusBadge(emp.status)}</td>

              {/* Actions: View, Edit, Delete */}
              <td style={{ textAlign: 'right', padding: '12px 16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* View */}
                  <Link
                    to={`/admin/employees/${emp._id}`}
                    className="btn btn-secondary"
                    style={{
                      width: '30px',
                      height: '30px',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                    }}
                    title="View Profile & Deliverables"
                  >
                    <Eye size={14} />
                  </Link>

                  {/* Edit */}
                  {onEdit && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        width: '30px',
                        height: '30px',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                      }}
                      onClick={() => onEdit(emp)}
                      title="Edit Employee"
                    >
                      <Edit2 size={13} />
                    </button>
                  )}

                  {/* Delete */}
                  {onDelete && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{
                        width: '30px',
                        height: '30px',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                      }}
                      onClick={() => onDelete(emp)}
                      title="Delete Employee"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
