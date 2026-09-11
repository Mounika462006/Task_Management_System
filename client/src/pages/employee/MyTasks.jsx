import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import Header from '../../components/layout/Header';
import TaskTable from '../../components/tasks/TaskTable';
import Pagination from '../../components/common/Pagination';
import { Spinner, EmptyState } from '../../components/common/Spinner';
import { taskService } from '../../services/taskService';
import useDebounce from '../../hooks/useDebounce';

export const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [toastMessage, setToastMessage] = useState(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateTaskStatus(taskId, newStatus);
      showToast(res.message || 'Task status updated successfully.');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <Header
        title="My Tasks"
        subtitle="View deliverables, filter assignments, and update task progress"
      />

      <div className="page-wrapper">
        {toastMessage && (
          <div className="toast-container">
            <div className="toast">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}>
            {/* Server-Side Search */}
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
                id="employee-tasks-search-input"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search by title or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              id="employee-tasks-status-filter"
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
              id="employee-tasks-priority-filter"
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
                id="employee-tasks-limit-select"
                className="form-control"
                style={{ width: '80px', padding: '0.5rem' }}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {loading ? (
          <Spinner size={36} text="Loading your tasks..." />
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
            description={searchInput ? `No assigned tasks found matching "${searchInput}".` : 'You currently do not have any tasks in this category.'}
          />
        ) : (
          <>
            <TaskTable
              tasks={tasks}
              isAdmin={false}
              onStatusChange={handleStatusChange}
            />

            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
