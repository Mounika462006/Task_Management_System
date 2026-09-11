import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle2, Clock, AlertTriangle, BarChart3, ArrowUpRight } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Spinner } from '../../components/common/Spinner';
import { dashboardService } from '../../services/employeeService';
import { taskService } from '../../services/taskService';

export const AdminProgress = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dashRes, taskRes] = await Promise.all([
          dashboardService.getAdminDashboard(),
          taskService.getTasks({ limit: 50 }),
        ]);
        if (dashRes.success) setDashboardData(dashRes.data);
        if (taskRes.success) {
          setTasks(taskRes.data?.tasks || (Array.isArray(taskRes.data) ? taskRes.data : []));
        }
      } catch (err) {
        console.error('Failed to load progress data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <Header title="Project Progress" subtitle="Company-wide deliverable velocity and completion analytics" />
        <div className="page-wrapper">
          <Spinner size={36} text="Calculating progress metrics..." />
        </div>
      </div>
    );
  }

  const total = dashboardData?.totalTasks || 0;
  const completed = dashboardData?.completed || 0;
  const inProgress = dashboardData?.inProgress || 0;
  const notStarted = dashboardData?.notStarted || 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <Header
        title="Project Progress"
        subtitle="Company-wide deliverable velocity, completion rates, and milestones"
      />

      <div className="page-wrapper">
        {/* Top Progress Summary Banner */}
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
                Overall System Completion
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.25rem 0' }}>
                {completionRate}% Complete
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                {completed} of {total} deliverables successfully delivered
              </p>
            </div>

            <div style={{ width: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem', fontWeight: 600 }}>
                <span style={{ color: '#64748b' }}>Velocity Status</span>
                <span style={{ color: '#16a34a' }}>On Track</span>
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

        {/* Milestone Breakdown Cards */}
        <div className="stats-grid">
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Completed
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#16a34a' }}>{completed}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Tasks finalized</div>
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
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Under active development</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Not Started
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#64748b' }}>{notStarted}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Backlog queue</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Urgent Priority
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                <AlertTriangle size={16} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#dc2626' }}>
              {dashboardData?.priorityBreakdown?.URGENT || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Immediate attention</div>
          </div>
        </div>

        {/* Priority Breakdown Progress Bars */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem', color: '#0f172a' }}>
            Deliverable Urgency Breakdown
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Track progress across task urgency tiers
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Urgent', count: dashboardData?.priorityBreakdown?.URGENT || 0, color: '#ef4444' },
              { label: 'High', count: dashboardData?.priorityBreakdown?.HIGH || 0, color: '#f97316' },
              { label: 'Medium', count: dashboardData?.priorityBreakdown?.MEDIUM || 0, color: '#eab308' },
              { label: 'Low', count: dashboardData?.priorityBreakdown?.LOW || 0, color: '#94a3b8' },
            ].map((tier) => {
              const pct = total > 0 ? Math.round((tier.count / total) * 100) : 0;
              return (
                <div key={tier.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{tier.label} Urgency</span>
                    <span style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                      {tier.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: tier.color,
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProgress;
