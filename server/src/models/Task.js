const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned employee is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
        message: 'Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED',
      },
      default: 'NOT_STARTED',
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        message: 'Priority must be LOW, MEDIUM, HIGH, or URGENT',
      },
      default: 'MEDIUM',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes required by spec:
// 1. Text index on title (and description) for server-side search
taskSchema.index({ title: 'text', description: 'text' });

// 2. Index on assignedTo
taskSchema.index({ assignedTo: 1 });

// 3. Index on status
taskSchema.index({ status: 1 });

// 4. Index on priority
taskSchema.index({ priority: 1 });

// Composite indexes for fast filtered sorting
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
