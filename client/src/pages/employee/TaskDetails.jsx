import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, CheckCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { taskService } from '../../services/taskService';
import { formatDate } from '../../utils/helpers';
import { TASK_STATUS } from '../../constants';

export const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getTaskById(id);
      if (res.success) {
        setTask(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await taskService.updateTaskStatus(id, newStatus);
      if (res.success) {
        setTask(res.data);
        showToast(res.message || 'Task status updated successfully.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Task Details" />
        <div className="page-wrapper">
          <Spinner size={36} text="Loading task..." />
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div>
        <Header title="Task Details" />
        <div className="page-wrapper">
          <div style={{ padding: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#f87171' }}>
            <p>{error || 'Task not found or unauthorized'}</p>
            <Link to="/employee/tasks" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              <ArrowLeft size={16} />
              <span>Back to My Tasks</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Task Overview"
        subtitle="Review deliverable details and update execution status"
      />

      <div className="page-wrapper">
        {toastMessage && (
          <div className="toast-container">
            <div className="toast">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <Link
          to="/employee/tasks"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} />
          <span>Back to My Tasks</span>
        </Link>

        <div className="details-grid">
          {/* Main Task Description */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{task.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Update Status</label>
                <select
                  className="form-control"
                  style={{ width: 'auto', height: '36px', padding: '0 0.8rem', fontSize: '0.85rem', fontWeight: 500 }}
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value={TASK_STATUS.NOT_STARTED}>Not Started</option>
                  <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={TASK_STATUS.COMPLETED}>Completed</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600 }}>
                Deliverable Requirements & Description
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {task.description}
              </p>
            </div>
          </div>

          {/* Meta Information Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
                Task Details
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned On:</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{formatDate(task.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Status Change:</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{formatDate(task.updatedAt)}</span>
                </div>
                {task.createdBy && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned By:</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{task.createdBy.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1d4ed8', marginBottom: '0.35rem' }}>
                Email Notification Active
              </div>
              <p style={{ fontSize: '0.8rem', color: '#3b82f6', lineHeight: '1.5', margin: 0 }}>
                Changing this task's status automatically emails the management team with your progress update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
