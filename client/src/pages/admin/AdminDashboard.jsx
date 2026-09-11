import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Bell,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { Spinner } from '../../components/common/Spinner';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { dashboardService } from '../../services/employeeService';
import { formatDate } from '../../utils/helpers';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getAdminDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header
          title={`${getGreeting()}, Admin`}
          subtitle="Here is your enterprise task distribution and operational overview."
        />
        <div className="page-wrapper">
          <Spinner size={36} text="Loading dashboard metrics..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header
          title={`${getGreeting()}, Admin`}
          subtitle="Here is your enterprise task distribution and operational overview."
        />
        <div className="page-wrapper">
          <div
            className="card"
            style={{
              padding: '2rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              color: '#dc2626',
            }}
          >
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button
              className="btn btn-secondary"
              onClick={fetchDashboardData}
              style={{ marginTop: '1rem' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4 Required KPI Cards
  const kpiCards = [
    {
      title: 'Total Employees',
      value: data?.totalEmployees || 0,
      icon: Users,
      supportText: 'Active corporate staff',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      link: '/admin/employees',
    },
    {
      title: 'Total Tasks',
      value: data?.totalTasks || 0,
      icon: CheckSquare,
      supportText: 'Across all workspaces',
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      link: '/admin/tasks',
    },
    {
      title: 'In Progress',
      value: data?.inProgress || 0,
      icon: Clock,
      supportText: 'Active deliverables',
      iconBg: '#fefce8',
      iconColor: '#ca8a04',
      link: '/admin/tasks?status=IN_PROGRESS',
    },
    {
      title: 'Completed',
      value: data?.completed || 0,
      icon: CheckCircle2,
      supportText: 'Milestones achieved',
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      link: '/admin/tasks?status=COMPLETED',
    },
  ];

  const totalTasks = data?.totalTasks || 0;
  const completedTasks = data?.completed || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div>
      {/* Apple-inspired Top Header */}
      <Header
        title={`${getGreeting()}, Admin`}
        subtitle="Manage employees, orchestrate deliverables, and monitor operational progress."
        actions={
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Link to="/admin/employees" className="btn btn-secondary" id="admin-view-staff-btn">
              <Users size={16} />
              <span>Employee Directory</span>
            </Link>
            <Link to="/admin/tasks" className="btn btn-primary" id="admin-create-task-quick-btn">
              <Plus size={16} />
              <span>Manage Tasks</span>
            </Link>
          </div>
        }
      />

      <div className="page-wrapper">
        {/* 4 KPI Cards Row - Equal Height */}
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
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      color: '#64748b',
                      fontWeight: 600,
                    }}
                  >
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

        {/* Dashboard Main Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Task Overview & Priority Distribution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Task Overview Card */}
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
                    Task Overview
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
                    Deliverable throughput and completion rate
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
                  {completionRate}% Completed
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: 10,
                    backgroundColor: '#f1f5f9',
                    borderRadius: '999px',
                    overflow: 'hidden',
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
              </div>

              {/* Breakdown Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                    Completed Deliverables
                  </span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data?.completed || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ca8a04' }} />
                    In Progress
                  </span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data?.inProgress || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                    Not Started / Backlog
                  </span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data?.notStarted || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
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
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <Link
                  to="/admin/employees"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Users size={16} color="#2563eb" />
                  <span>Add Employee</span>
                </Link>

                <Link
                  to="/admin/tasks"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CheckSquare size={16} color="#16a34a" />
                  <span>Manage Tasks</span>
                </Link>

                <Link
                  to="/admin/notifications"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Bell size={16} color="#ca8a04" />
                  <span>Notifications</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Recent Activity / Tasks */}
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
                  Recent Activity
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
                  Latest deliverable status changes and assignments
                </p>
              </div>
              <Link
                to="/admin/tasks"
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
                  <Link
                    key={task._id}
                    to={`/admin/tasks/${task._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Assigned to: {task.assignedTo?.name || 'Unassigned'} • Due {formatDate(task.dueDate)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <StatusBadge status={task.status} />
                      <ChevronRight size={15} color="#94a3b8" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.875rem',
                }}
              >
                No recent activity. Create a task to start tracking deliverables.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
