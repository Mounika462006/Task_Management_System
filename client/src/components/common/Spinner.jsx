import React from 'react';

export const Spinner = ({ size = 28, text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      gap: '0.75rem',
      color: 'var(--text-muted)'
    }}>
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--primary-500)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      {text && <span style={{ fontSize: '0.875rem' }}>{text}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const EmptyState = ({ title = 'No data found', description = '', action = null, icon: Icon = null }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.01)',
      border: '1px dashed var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      margin: '1rem 0'
    }}>
      {Icon && (
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: 'var(--primary-400)'
        }}>
          <Icon size={26} />
        </div>
      )}
      <h4 style={{ fontSize: '1.125rem', marginBottom: '0.375rem' }}>{title}</h4>
      {description && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 400, marginBottom: action ? '1.25rem' : 0 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '0.75rem' }}>{action}</div>}
    </div>
  );
};

export default { Spinner, EmptyState };
