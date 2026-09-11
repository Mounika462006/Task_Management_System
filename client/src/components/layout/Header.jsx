import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { ShieldCheck, UserCheck, Menu } from 'lucide-react';

export const Header = ({ title, subtitle, actions }) => {
  const { user, isAdmin } = useAuth();
  const { toggle } = useSidebar();

  return (
    <header
      className="header-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2.5rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={toggle}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#334155',
            width: '36px',
            height: '36px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '0.15rem', marginBottom: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
        {actions}

        {/* Role Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            backgroundColor: isAdmin ? '#eff6ff' : '#f0fdf4',
            border: isAdmin ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: isAdmin ? '#1d4ed8' : '#15803d',
          }}
        >
          {isAdmin ? <ShieldCheck size={14} strokeWidth={2} /> : <UserCheck size={14} strokeWidth={2} />}
          <span>{isAdmin ? 'Admin Console' : 'Employee Workspace'}</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .header-container {
            padding: 0.875rem 1.5rem !important;
          }
        }
        @media (max-width: 640px) {
          .header-container {
            padding: 0.875rem 1rem !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
