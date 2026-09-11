import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Bell,
  User,
  ChevronRight,
  Check,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { Spinner } from '../../components/common/Spinner';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { dashboardService } from '../../services/employeeService';
import { taskService } from '../../services/taskService';
import { formatDate } from '../../utils/helpers';
import { TASK_STATUS } from '../../constants';
import useAuth from '../../hooks/useAuth';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getEmployeeDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      const res = await taskService.updateTaskStatus(taskId, newStatus);
      showToast(res.message || 'Task status updated successfully.');
      await fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <Header
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'Member'}`}
          subtitle="View your assigned deliverables and update work progress."
        />
        <div className="page-wrapper">
          <Spinner size={36} text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  const totalTasks = data?.totalTasks || 0;
  const inProgressTasks = data?.inProgress || 0;
  const completedTasks = data?.completed || 0;
  const overdueTasks = data?.notStarted || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const kpiCards = [
    {
      title: 'My Tasks',
      value: totalTasks,
      icon: CheckSquare,
      supportText: 'Assigned to you',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      link: '/employee/tasks',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      supportText: 'Active workstreams',
      iconBg: '#fefce8',
      iconColor: '#ca8a04',
      link: '/employee/tasks?status=IN_PROGRESS',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      supportText: 'Finished deliverables',
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      link: '/employee/tasks?status=COMPLETED',
    },
    {
      title: 'Overdue / Pending',
      value: overdueTasks,
      icon: AlertCircle,
      supportText: 'Requires action',
      iconBg: '#fef2f2',
      iconColor: '#dc2626',
      link: '/employee/tasks?status=NOT_STARTED',
    },
  ];

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            zIndex: 9999,
          }}
        >
          <Check size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Member'}`}
        subtitle="Manage your assigned deliverables and update work progress."
        actions={
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Link to="/employee/tasks" className="btn btn-primary" id="employee-view-tasks-btn">
              <CheckSquare size={16} />
              <span>View All Tasks</span>
            </Link>
          </div>
        }
      />

      <div className="page-wrapper">
        {/* 4 KPI Cards Grid - Equal Height */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={idx}
                to={kpi.link}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    {kpi.title}
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: kpi.iconBg,
                      color: kpi.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '1.875rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      letterSpacing: '-0.025em',
                      lineHeight: 1.1,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {kpi.supportText}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Recent Tasks with Quick Status Updater */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  My Recent Deliverables
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
                  Update status directly — triggers admin email notification
                </p>
              </div>
              <Link
                to="/employee/tasks"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  textDecoration: 'none',
                }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {data?.recentTasks && data.recentTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.recentTasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div>
                        <Link
                          to={`/employee/tasks/${task._id}`}
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            textDecoration: 'none',
                          }}
                        >
                          {task.title}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          Due: {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                        Update Status:
                      </div>
                      <select
                        className="form-control"
                        style={{
                          height: '32px',
                          padding: '0 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          width: 'auto',
                          minWidth: '130px',
                        }}
                        value={task.status}
                        disabled={updatingTaskId === task._id}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value={TASK_STATUS.NOT_STARTED}>Not Started</option>
                        <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                        <option value={TASK_STATUS.COMPLETED}>Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.875rem',
                }}
              >
                No active tasks assigned. You are caught up with all deliverables!
              </div>
            )}
          </div>

          {/* Column 2: Personal Completion & Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Progress Card */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    My Progress
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
                    Personal milestone completion rate
                  </p>
                </div>
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #dbeafe',
                  }}
                >
                  {completionRate}% Complete
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 10,
                  backgroundColor: '#f1f5f9',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: `${completionRate}%`,
                    height: '100%',
                    backgroundColor: '#2563eb',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Finished Tasks</span>
                  <span style={{ fontWeight: 600, color: '#16a34a' }}>{completedTasks}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Currently In Progress</span>
                  <span style={{ fontWeight: 600, color: '#ca8a04' }}>{inProgressTasks}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Pending / Overdue</span>
                  <span style={{ fontWeight: 600, color: '#dc2626' }}>{overdueTasks}</span>
                </div>
              </div>
            </div>

            {/* Quick Workspace Navigation */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
                Quick Access
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Link
                  to="/employee/tasks"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <CheckSquare size={16} color="#2563eb" />
                    <span>My Task Board</span>
                  </div>
                  <ChevronRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/employee/progress"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <TrendingUp size={16} color="#ca8a04" />
                    <span>Deliverable Progress</span>
                  </div>
                  <ChevronRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/employee/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <User size={16} color="#16a34a" />
                    <span>Corporate Profile</span>
                  </div>
                  <ChevronRight size={14} color="#94a3b8" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
