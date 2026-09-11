import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowLeft, ArrowRight, AlertCircle, Layers } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password, 'ADMIN');
      if (res.success && res.user) {
        if (res.user.role !== 'ADMIN') {
          setError('This account does not have Administrator privileges. Please sign in via the Employee Portal.');
          return;
        }

        if (from && from.startsWith('/admin')) {
          navigate(from, { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map((e) => e.message).join(', '));
      } else {
        setError(err.message || 'Invalid admin email or password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Back Link */}
        <Link
          to="/"
          id="admin-back-to-roles-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            fontSize: '0.8125rem',
            fontWeight: 500,
            marginBottom: '1.75rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to workspace selection</span>
        </Link>

        {/* Brand & Role Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Shield size={24} strokeWidth={2} />
          </div>

          <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
              }}
            >
              Enterprise Admin
            </span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            Admin Sign In
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Enter your credentials to access the TaskFlow administration console.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                className="form-control"
                placeholder="admin.taskflow@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={17}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                className="form-control"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={17}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            id="admin-signin-submit-btn"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              gap: '0.5rem',
            }}
          >
            {isSubmitting ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: '#64748b',
          }}
        >
          <span>Need employee access? </span>
          <Link
            to="/employee/login"
            id="admin-switch-to-employee-link"
            style={{ color: '#2563eb', fontWeight: 600 }}
          >
            Go to Employee Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
