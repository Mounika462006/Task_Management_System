import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, CheckSquare, Clock, CheckCircle2, CircleDot } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Spinner, EmptyState } from '../../components/common/Spinner';
import { employeeService } from '../../services/employeeService';
import { formatDate, getInitials } from '../../utils/helpers';

export const EmployeeDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await employeeService.getEmployeeById(id);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Employee Details" />
        <div className="page-wrapper">
          <Spinner size={36} text="Loading employee profile..." />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Header title="Employee Details" />
        <div className="page-wrapper">
          <div style={{ padding: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#f87171' }}>
            <p>{error || 'Employee not found'}</p>
            <Link to="/admin/employees" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              <ArrowLeft size={16} />
              <span>Back to Employees</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { employee, taskStats, tasks } = data;

  return (
    <div>
      <Header
        title={employee.name}
        subtitle={`Staff Profile • ${employee.email}`}
      />

      <div className="page-wrapper">
        <Link
          to="/admin/employees"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee List</span>
        </Link>

        {/* Profile Card */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#2563eb',
            flexShrink: 0,
          }}>
            {getInitials(employee.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{employee.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} />
                {employee.email}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} />
                Joined {formatDate(employee.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Workload Metric Cards */}
        <div className="stats-grid" style={{ marginBottom: '1.75rem' }}>
          <div className="card" style={{ padding: '1.125rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TOTAL ASSIGNED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.3rem', color: 'var(--text-main)' }}>{taskStats.total}</div>
          </div>
          <div className="card" style={{ padding: '1.125rem' }}>
            <div style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>IN PROGRESS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0284c7', marginTop: '0.3rem' }}>{taskStats.inProgress}</div>
          </div>
          <div className="card" style={{ padding: '1.125rem' }}>
            <div style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>COMPLETED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#16a34a', marginTop: '0.3rem' }}>{taskStats.completed}</div>
          </div>
          <div className="card" style={{ padding: '1.125rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>NOT STARTED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#64748b', marginTop: '0.3rem' }}>{taskStats.notStarted}</div>
          </div>
        </div>

        {/* Assigned Tasks List */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Assigned Tasks ({tasks.length})</h3>

          {tasks.length === 0 ? (
            <EmptyState title="No tasks assigned" description="This employee currently has no tasks assigned to them." />
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link to={`/admin/tasks/${task._id}`} style={{ color: 'var(--text-main)' }}>
                          {task.title}
                        </Link>
                      </td>
                      <td><PriorityBadge priority={task.priority} /></td>
                      <td><StatusBadge status={task.status} /></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(task.createdAt)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/admin/tasks/${task._id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
