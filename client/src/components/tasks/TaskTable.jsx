import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, ChevronDown } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatDate, getInitials, truncate } from '../../utils/helpers';
import { TASK_STATUS } from '../../constants';

export const TaskTable = ({
  tasks = [],
  isAdmin = false,
  onEdit = null,
  onDelete = null,
  onStatusChange = null,
}) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Task</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>
                <Link
                  to={isAdmin ? `/admin/tasks/${task._id}` : `/employee/tasks/${task._id}`}
                  style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}
                >
                  {task.title}
                </Link>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {truncate(task.description, 70)}
                </div>
              </td>

              <td>
                {task.assignedTo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: 28,
                      height: 28,
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
                    }}>
                      {getInitials(task.assignedTo.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>{task.assignedTo.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{task.assignedTo.email}</div>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>Unassigned</span>
                )}
              </td>

              <td>
                <PriorityBadge priority={task.priority} />
              </td>

              <td>
                {onStatusChange ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
                    <select
                      className="form-control"
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      style={{
                        padding: '0 0.5rem',
                        height: '28px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor: '#ffffff',
                        borderColor: '#cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        width: 'auto',
                      }}
                    >
                      <option value={TASK_STATUS.NOT_STARTED}>Not Started</option>
                      <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                      <option value={TASK_STATUS.COMPLETED}>Completed</option>
                    </select>
                  </div>
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </td>

              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {formatDate(task.createdAt)}
              </td>

              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Link
                    to={isAdmin ? `/admin/tasks/${task._id}` : `/employee/tasks/${task._id}`}
                    className="btn btn-secondary"
                    style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    title="View Task Details"
                  >
                    <ExternalLink size={13} />
                  </Link>

                  {isAdmin && onEdit && (
                    <button
                      className="btn btn-secondary"
                      style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                    >
                      <Edit2 size={13} />
                    </button>
                  )}

                  {isAdmin && onDelete && (
                    <button
                      className="btn btn-danger"
                      style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => onDelete(task._id)}
                      title="Delete Task"
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

export default TaskTable;
