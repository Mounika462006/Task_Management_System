import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '../../components/layout/Header';
import TaskTable from '../../components/tasks/TaskTable';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import Pagination from '../../components/common/Pagination';
import { Spinner, EmptyState } from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { taskService } from '../../services/taskService';
import { employeeService } from '../../services/employeeService';
import useDebounce from '../../hooks/useDebounce';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounced search query to execute server-side search
  const debouncedSearch = useDebounce(searchInput, 400);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load employees for assignment dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getEmployees();
        if (res.success) {
          setEmployees(res.data);
        }
      } catch (err) {
        console.error('Failed to load employees for dropdown:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch tasks with server-side search, filters, and pagination
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        status: statusFilter,
        priority: priorityFilter,
      };

      const res = await taskService.getTasks(params);
      if (res.success) {
        setTasks(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tasks from server');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, priorityFilter]);

  // Reset to page 1 whenever search, status, or priority change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  // Fetch when page, limit, or filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Task creation/update handler
  const handleSaveTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        showToast('Task updated successfully');
      } else {
        await taskService.createTask(taskData);
        showToast('Task created and notification dispatched to employee');
      }
      setIsFormModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status change handler (ADMIN can update any task)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      showToast(`Status updated to ${newStatus}`);
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  // Delete task handler
  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    setIsSubmitting(true);
    try {
      await taskService.deleteTask(deletingTaskId);
      showToast('Task deleted successfully');
      setDeletingTaskId(null);
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header
        title="Task Management"
        subtitle="Search, filter, assign, and manage enterprise tasks"
        actions={
          <button
            id="admin-create-task-modal-btn"
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setIsFormModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        }
      />

      <div className="page-wrapper">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="toast-container">
            <div className="toast">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}>
            {/* Server-side Search Input */}
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
                id="tasks-server-search-input"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search title, description, or employee name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              id="tasks-status-filter"
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              id="tasks-priority-filter"
              className="form-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Items Per Page */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show:</span>
              <select
                id="tasks-page-limit-select"
                className="form-control"
                style={{ width: '80px', padding: '0.5rem' }}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table Section */}
        {loading ? (
          <Spinner size={36} text="Fetching tasks..." />
        ) : error ? (
          <div style={{ padding: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#f87171' }}>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={fetchTasks} style={{ marginTop: '1rem' }}>
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks match your criteria"
            description={searchInput ? `No tasks found matching "${searchInput}". Try adjusting your filters.` : 'Get started by creating your first task.'}
            action={
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingTask(null);
                  setIsFormModalOpen(true);
                }}
              >
                <Plus size={16} />
                <span>Create Task</span>
              </button>
            }
          />
        ) : (
          <>
            <TaskTable
              tasks={tasks}
              isAdmin={true}
              onEdit={(task) => {
                setEditingTask(task);
                setIsFormModalOpen(true);
              }}
              onDelete={(id) => setDeletingTaskId(id)}
              onStatusChange={handleStatusChange}
            />

            {/* Server-Side Pagination Controls */}
            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}

        {/* Create/Edit Task Modal */}
        <TaskFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleSaveTask}
          employees={employees}
          initialData={editingTask}
          isSubmitting={isSubmitting}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(deletingTaskId)}
          onClose={() => setDeletingTaskId(null)}
          title="Confirm Deletion"
          maxWidth="450px"
        >
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setDeletingTaskId(null)} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              id="confirm-delete-task-btn"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Tasks;
