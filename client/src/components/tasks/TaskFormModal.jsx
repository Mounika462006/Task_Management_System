import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { TASK_PRIORITY } from '../../constants';

export const TaskFormModal = ({ isOpen, onClose, onSubmit, employees = [], initialData = null, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState(TASK_PRIORITY.MEDIUM);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setAssignedTo(initialData.assignedTo?._id || initialData.assignedTo || '');
      setPriority(initialData.priority || TASK_PRIORITY.MEDIUM);
    } else {
      setTitle('');
      setDescription('');
      setAssignedTo(employees[0]?._id || '');
      setPriority(TASK_PRIORITY.MEDIUM);
    }
    setFieldErrors({});
  }, [initialData, isOpen, employees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side quick check
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!assignedTo) errors.assignedTo = 'Assigned employee is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        priority,
      });
      onClose();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const mapped = {};
        err.errors.forEach((e) => {
          mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
      } else {
        setFieldErrors({ general: err.message || 'Operation failed' });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Create New Task'}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        {fieldErrors.general && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            {fieldErrors.general}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="task-title">Task Title *</label>
          <input
            id="task-title"
            type="text"
            className="form-control"
            placeholder="e.g. Implement OAuth2 flow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {fieldErrors.title && <div className="form-error">{fieldErrors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-description">Description *</label>
          <textarea
            id="task-description"
            className="form-control"
            rows={4}
            placeholder="Provide detailed requirements, context, and expected deliverable..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {fieldErrors.description && <div className="form-error">{fieldErrors.description}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-assignedTo">Assign To Employee *</label>
            <select
              id="task-assignedTo"
              className="form-control"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            {fieldErrors.assignedTo && <div className="form-error">{fieldErrors.assignedTo}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            {fieldErrors.priority && <div className="form-error">{fieldErrors.priority}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" id="save-task-submit-btn" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
