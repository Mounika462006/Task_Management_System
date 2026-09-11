import React from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_PRIORITY, TASK_PRIORITY_LABELS } from '../../constants';

export const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-not-started';
  if (status === TASK_STATUS.IN_PROGRESS) badgeClass = 'badge-in-progress';
  if (status === TASK_STATUS.COMPLETED) badgeClass = 'badge-completed';

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
      {TASK_STATUS_LABELS[status] || status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  let badgeClass = 'badge-priority-low';
  if (priority === TASK_PRIORITY.MEDIUM) badgeClass = 'badge-priority-medium';
  if (priority === TASK_PRIORITY.HIGH) badgeClass = 'badge-priority-high';
  if (priority === TASK_PRIORITY.URGENT) badgeClass = 'badge-priority-urgent';

  return (
    <span className={`badge ${badgeClass}`}>
      {TASK_PRIORITY_LABELS[priority] || priority}
    </span>
  );
};

export default { StatusBadge, PriorityBadge };
