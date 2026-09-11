import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  Layers,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { getInitials } from '../../utils/helpers';

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isOpen, close } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    close();
    await logout();
    navigate('/');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    color: isActive ? '#1d4ed8' : '#475569',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.875rem',
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    marginBottom: '0.25rem',
    borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
  });

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '250px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          minHeight: '100vh',
          zIndex: 100,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Layers size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                TaskFlow
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                }}
              >
                {isAdmin ? 'Enterprise Admin' : 'Employee Portal'}
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            className="mobile-sidebar-close-btn"
            onClick={close}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
              borderRadius: '6px',
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.25rem 0.875rem', flex: 1, overflowY: 'auto' }}>
          {isAdmin ? (
            <>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0 0.75rem 0.5rem',
                  fontWeight: 600,
                }}
              >
                Admin Management
              </div>
              <NavLink to="/admin/dashboard" style={navItemStyle} onClick={close} id="nav-admin-dashboard">
                <LayoutDashboard size={18} strokeWidth={1.8} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/employees" style={navItemStyle} onClick={close} id="nav-admin-employees">
                <Users size={18} strokeWidth={1.8} />
                <span>Employee Management</span>
              </NavLink>
              <NavLink to="/admin/tasks" style={navItemStyle} onClick={close} id="nav-admin-tasks">
                <CheckSquare size={18} strokeWidth={1.8} />
                <span>Tasks</span>
              </NavLink>
              <NavLink to="/admin/progress" style={navItemStyle} onClick={close} id="nav-admin-progress">
                <TrendingUp size={18} strokeWidth={1.8} />
                <span>Progress</span>
              </NavLink>
              <NavLink to="/admin/notifications" style={navItemStyle} onClick={close} id="nav-admin-notifications">
                <Bell size={18} strokeWidth={1.8} />
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/admin/settings" style={navItemStyle} onClick={close} id="nav-admin-settings">
                <Settings size={18} strokeWidth={1.8} />
                <span>Settings</span>
              </NavLink>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0 0.75rem 0.5rem',
                  fontWeight: 600,
                }}
              >
                Employee Workspace
              </div>
              <NavLink to="/employee/dashboard" style={navItemStyle} onClick={close} id="nav-employee-dashboard">
                <LayoutDashboard size={18} strokeWidth={1.8} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/employee/tasks" style={navItemStyle} onClick={close} id="nav-employee-tasks">
                <CheckSquare size={18} strokeWidth={1.8} />
                <span>My Tasks</span>
              </NavLink>
              <NavLink to="/employee/progress" style={navItemStyle} onClick={close} id="nav-employee-progress">
                <TrendingUp size={18} strokeWidth={1.8} />
                <span>Progress</span>
              </NavLink>
              <NavLink to="/employee/profile" style={navItemStyle} onClick={close} id="nav-employee-profile">
                <User size={18} strokeWidth={1.8} />
                <span>Profile</span>
              </NavLink>
              <NavLink to="/employee/settings" style={navItemStyle} onClick={close} id="nav-employee-settings">
                <Settings size={18} strokeWidth={1.8} />
                <span>Settings</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* User Footer Profile */}
        <div
          style={{
            padding: '1.125rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: isAdmin ? '#eff6ff' : '#f0fdf4',
                border: isAdmin ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: isAdmin ? '#1d4ed8' : '#15803d',
                flexShrink: 0,
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  color: '#0f172a',
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            id="sidebar-logout-btn"
            className="btn btn-secondary"
            style={{
              width: '100%',
              height: '34px',
              fontSize: '0.8125rem',
              gap: '0.5rem',
              borderRadius: '6px',
            }}
          >
            <LogOut size={15} strokeWidth={1.8} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .app-sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            transform: translateX(-100%);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          }
          .app-sidebar.open {
            transform: translateX(0) !important;
          }
          .mobile-sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
