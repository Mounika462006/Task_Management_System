import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, CircleDot, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Spinner } from '../../components/common/Spinner';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { dashboardService } from '../../services/employeeService';
import { formatDate } from '../../utils/helpers';

export const EmployeeProgress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getEmployeeDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load employee progress', err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div>
        <Header title="My Progress" subtitle="Your personal deliverable velocity and completion statistics" />
        <div className="page-wrapper">
          <Spinner size={36} text="Loading progress metrics..." />
        </div>
      </div>
    );
  }

  const total = data?.totalTasks || 0;
  const completed = data?.completed || 0;
  const inProgress = data?.inProgress || 0;
  const notStarted = data?.notStarted || 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <Header
        title="My Progress"
        subtitle="Your personal deliverable velocity, completion rate, and active milestones"
      />

      <div className="page-wrapper">
        {/* Progress Rate Card */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #dbeafe',
                }}
              >
                Personal Completion Rate
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.25rem 0' }}>
                {completionRate}% Completed
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                {completed} out of {total} assigned tasks completed
              </p>
            </div>

            <div style={{ width: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem', fontWeight: 600 }}>
                <span style={{ color: '#64748b' }}>Execution Status</span>
                <span style={{ color: completionRate >= 70 ? '#16a34a' : '#2563eb' }}>
                  {completionRate >= 70 ? 'High Velocity' : 'Active Progress'}
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${completionRate}%`,
                    backgroundColor: '#2563eb',
                    borderRadius: '9999px',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="stats-grid">
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Completed Deliverables
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#16a34a' }}>{completed}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Delivered successfully</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                In Progress
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <Clock size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0284c7' }}>{inProgress}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Active work</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Not Started
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <CircleDot size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#64748b' }}>{notStarted}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Upcoming queue</div>
          </div>
        </div>

        {/* Active Deliverables Feed */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Active Deliverables</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Review assigned tasks and report progress</p>
            </div>
            <Link to="/employee/tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>
              <span>View All Tasks</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data?.recentTasks && data.recentTasks.length > 0 ? (
              data.recentTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <Link
                      to={`/employee/tasks/${task._id}`}
                      style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', textDecoration: 'none', display: 'block', marginBottom: '0.2rem' }}
                    >
                      {task.title}
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned on {formatDate(task.createdAt)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                No active tasks assigned at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProgress;
