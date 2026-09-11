import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import Modal from '../../components/common/Modal';
import { taskService } from '../../services/taskService';
import { employeeService } from '../../services/employeeService';
import { formatDate, getInitials } from '../../utils/helpers';
import { TASK_STATUS } from '../../constants';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchEmployees();
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

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getEmployees();
      if (res.success) {
        setEmployees(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (taskData) => {
    setIsSubmitting(true);
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res.success) {
        setTask(res.data);
        setIsEditModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await taskService.updateTaskStatus(id, newStatus);
      if (res.success) {
        setTask(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await taskService.deleteTask(id);
      navigate('/admin/tasks');
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
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
            <p>{error || 'Task not found'}</p>
            <Link to="/admin/tasks" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              <ArrowLeft size={16} />
              <span>Back to Tasks</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Task Details"
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(true)}>
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        }
      />

      <div className="page-wrapper">
        <Link
          to="/admin/tasks"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Task List</span>
        </Link>

        <div className="details-grid">
          {/* Main Task Information */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{task.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Change Status</label>
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
                Description
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {task.description}
              </p>
            </div>
          </div>

          {/* Sidebar / Meta Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Assigned Employee Card */}
            <div className="card">
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600 }}>
                Assigned Employee
              </h4>

              {task.assignedTo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#2563eb',
                    flexShrink: 0,
                  }}>
                    {getInitials(task.assignedTo.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{task.assignedTo.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{task.assignedTo.email}</div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>Unassigned</p>
              )}
            </div>

            {/* Task Timeline & Details */}
            <div className="card">
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                Activity & Timestamps
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Created On:</span>
                  <span style={{ fontWeight: 500 }}>{formatDate(task.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Updated:</span>
                  <span style={{ fontWeight: 500 }}>{formatDate(task.updatedAt)}</span>
                </div>
                {task.createdBy && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Created By:</span>
                    <span style={{ fontWeight: 500 }}>{task.createdBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Task Modal */}
        <TaskFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
          employees={employees}
          initialData={task}
          isSubmitting={isSubmitting}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Task"
          maxWidth="450px"
        >
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Are you sure you want to permanently delete "{task.title}"?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TaskDetails;
