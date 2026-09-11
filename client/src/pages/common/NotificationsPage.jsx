import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Mail,
  AlertCircle,
  CheckCheck,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/layout/Header';
import { taskService } from '../../services/taskService';
import { formatDate } from '../../utils/helpers';
import { Spinner } from '../../components/common/Spinner';

export const NotificationsPage = () => {
  const { user, isAdmin } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`read_notifications_${user?._id || 'user'}`)) || [];
    } catch {
      return [];
    }
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks();
      setTasks(res.data?.tasks || res.data || []);
    } catch (err) {
      console.error('Failed to load notifications tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Build notifications stream from real tasks and system events
  const notifications = React.useMemo(() => {
    const list = [];

    // Email delivery notification
    list.push({
      id: 'sys-smtp-1',
      title: 'Gmail SMTP Service Active',
      message: 'Automated email dispatch configured for task assignments and status updates.',
      category: 'SYSTEM',
      timestamp: new Date().toISOString(),
      icon: Mail,
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      read: readIds.includes('sys-smtp-1'),
    });

    tasks.forEach((t) => {
      // Completed task notification
      if (t.status === 'COMPLETED') {
        list.push({
          id: `task-comp-${t._id}`,
          title: `Task Marked as Completed: ${t.title}`,
          message: isAdmin
            ? `${t.assignedTo?.name || 'Employee'} marked deliverable as completed.`
            : `You finished "${t.title}". Admin has received the confirmation email.`,
          category: 'COMPLETED',
          timestamp: t.updatedAt || t.createdAt,
          icon: CheckCircle2,
          iconColor: '#16a34a',
          iconBg: '#f0fdf4',
          link: isAdmin ? `/admin/tasks/${t._id}` : `/employee/tasks/${t._id}`,
          read: readIds.includes(`task-comp-${t._id}`),
        });
      }

      // In progress task notification
      if (t.status === 'IN_PROGRESS') {
        list.push({
          id: `task-prog-${t._id}`,
          title: `Task In Progress: ${t.title}`,
          message: isAdmin
            ? `${t.assignedTo?.name || 'Employee'} started working on this task.`
            : `You are currently working on this task. Due by ${formatDate(t.dueDate)}.`,
          category: 'IN_PROGRESS',
          timestamp: t.updatedAt || t.createdAt,
          icon: Clock,
          iconColor: '#2563eb',
          iconBg: '#eff6ff',
          link: isAdmin ? `/admin/tasks/${t._id}` : `/employee/tasks/${t._id}`,
          read: readIds.includes(`task-prog-${t._id}`),
        });
      }

      // High priority task alert
      if (t.priority === 'HIGH' && t.status !== 'COMPLETED') {
        list.push({
          id: `task-high-${t._id}`,
          title: `High Priority Deliverable: ${t.title}`,
          message: `Urgent deliverable due on ${formatDate(t.dueDate)}. Priority attention required.`,
          category: 'URGENT',
          timestamp: t.createdAt,
          icon: AlertCircle,
          iconColor: '#dc2626',
          iconBg: '#fef2f2',
          link: isAdmin ? `/admin/tasks/${t._id}` : `/employee/tasks/${t._id}`,
          read: readIds.includes(`task-high-${t._id}`),
        });
      }
    });

    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [tasks, isAdmin, readIds]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'URGENT') return n.category === 'URGENT';
    if (filter === 'COMPLETED') return n.category === 'COMPLETED';
    if (filter === 'SYSTEM') return n.category === 'SYSTEM';
    return true;
  });

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(`read_notifications_${user?._id || 'user'}`, JSON.stringify(allIds));
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = (id) => {
    if (readIds.includes(id)) return;
    const next = [...readIds, id];
    setReadIds(next);
    try {
      localStorage.setItem(`read_notifications_${user?._id || 'user'}`, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      {/* Standard Sticky Header */}
      <Header
        title="Notifications"
        subtitle="Real-time activity feed, task dispatches, and email notifications."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {unreadCount > 0 && (
              <span
                style={{
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  border: '1px solid #bfdbfe',
                }}
              >
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={fetchTasks}
              className="btn btn-secondary"
              style={{ height: 36, fontSize: '0.8125rem', gap: '0.4rem', padding: '0 0.875rem' }}
              title="Refresh feed"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="btn btn-secondary"
              style={{
                height: 36,
                fontSize: '0.8125rem',
                gap: '0.4rem',
                padding: '0 0.875rem',
                opacity: unreadCount === 0 ? 0.5 : 1,
              }}
            >
              <CheckCheck size={15} />
              <span>Mark all read</span>
            </button>
          </div>
        }
      />

      {/* Main Full-Width Page Wrapper */}
      <div className="page-wrapper">
        {/* Filter Tabs Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
            width: '100%',
          }}
        >
          {[
            { label: 'All Activities', value: 'ALL', count: notifications.length },
            { label: 'Unread', value: 'UNREAD', count: unreadCount },
            { label: 'Urgent', value: 'URGENT', count: notifications.filter((n) => n.category === 'URGENT').length },
            { label: 'Completed', value: 'COMPLETED', count: notifications.filter((n) => n.category === 'COMPLETED').length },
            { label: 'System', value: 'SYSTEM', count: notifications.filter((n) => n.category === 'SYSTEM').length },
          ].map((tab) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563eb' : '#64748b',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    backgroundColor: isActive ? '#dbeafe' : '#f1f5f9',
                    color: isActive ? '#1e40af' : '#64748b',
                    fontWeight: 600,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications Stream (Full Width) */}
        {loading ? (
          <div style={{ padding: '5rem 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner size={36} text="Loading notifications..." />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              width: '100%',
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Bell size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              No notifications found
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.375rem' }}>
              {filter === 'ALL'
                ? 'You have caught up with all updates and task notifications.'
                : `No activity found under the "${filter}" filter.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}>
            {filteredNotifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.125rem 1.5rem',
                    backgroundColor: item.read ? '#ffffff' : '#f8faff',
                    border: item.read ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                    borderRadius: '12px',
                    boxShadow: item.read
                      ? '0 1px 3px 0 rgba(0, 0, 0, 0.03)'
                      : '0 2px 5px rgba(37, 99, 235, 0.06)',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Status Dot & Icon */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '10px',
                        backgroundColor: item.iconBg,
                        color: item.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    {!item.read && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: '#2563eb',
                          border: '2px solid #ffffff',
                        }}
                      />
                    )}
                  </div>

                  {/* Content Area */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: item.read ? 600 : 700,
                          color: '#0f172a',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </h4>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          flexShrink: 0,
                          fontWeight: 500,
                        }}
                      >
                        {formatDate(item.timestamp)}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#475569',
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      {item.message}
                    </p>

                    {item.link && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <Link
                          to={item.link}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: '#2563eb',
                            textDecoration: 'none',
                          }}
                        >
                          <span>View Deliverable Details</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
