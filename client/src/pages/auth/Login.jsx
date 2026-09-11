import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotNotice(false);

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setError('Please enter your corporate email address or username.');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(cleanIdentifier, cleanPassword);
      if (res.success && res.user) {
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/employee/dashboard', { replace: true });
        }
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map((e) => e.message).join(', '));
      } else {
        setError(err.message || 'Invalid credentials. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-fullpage-container">
      {/* Left Column: Full-Screen Showcase Panel */}
      <div className="login-fullpage-showcase">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '11px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.22)',
            }}
          >
            <Layers size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              TaskFlow
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Enterprise Task Management
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ margin: 'auto 0', padding: '2.5rem 0', maxWidth: '580px' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            A minimal workspace engineered for focus and clarity.
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              lineHeight: 1.65,
              marginBottom: '2.5rem',
            }}
          >
            Coordinate projects, track milestones, and orchestrate deliverables seamlessly across your entire organization.
          </p>

          {/* Value Props Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <CheckCircle2 size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                  Unified Enterprise Access
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                  One common login portal with automatic role detection for administrators and staff.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <ShieldCheck size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                  Admin-Controlled Accounts
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                  Centralized employee provisioning with enterprise role-based security policies.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#faf5ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Zap size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                  Automated Task Dispatches
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                  Real-time status updates and Gmail SMTP email alerts on every deliverable change.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#16a34a' }} />
            <span>TaskFlow Cloud • Enterprise Edition</span>
          </div>
        </div>
      </div>

      {/* Right Column: Full-Screen Form Panel */}
      <div className="login-fullpage-formpanel">
        <div className="login-form-card">
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                margin: '0 0 0.35rem 0',
              }}
            >
              Sign In
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              Enter your corporate credentials to access your workspace.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                padding: '0.75rem 0.875rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot Password Notice */}
          {forgotNotice && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                padding: '0.75rem 0.875rem',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                color: '#1d4ed8',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                lineHeight: 1.4,
              }}
            >
              <span>Password resets are managed by your administrator. Please contact your IT or system administrator to reset your credentials.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email / Username Input */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="login-identifier-input"
                className="form-label"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.375rem',
                  display: 'block',
                }}
              >
                Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-identifier-input"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  className="form-control"
                  style={{
                    paddingLeft: '2.5rem',
                    height: '44px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                  }}
                  placeholder="name@company.com or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.375rem',
                }}
              >
                <label
                  htmlFor="login-password-input"
                  className="form-label"
                  style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', margin: 0 }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotNotice(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.775rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="form-control"
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.75rem',
                    height: '44px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                  }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <input
                type="checkbox"
                id="login-remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  borderColor: '#cbd5e1',
                  accentColor: '#2563eb',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="login-remember-me"
                style={{ fontSize: '0.8125rem', color: '#64748b', cursor: 'pointer', userSelect: 'none' }}
              >
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                gap: '0.5rem',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-fullpage-container {
          width: 100vw;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          background-color: #ffffff;
          box-sizing: border-box;
          font-family: var(--font-primary);
        }
        .login-fullpage-showcase {
          background-color: #f8fafc;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          padding: 3.5rem 4.5rem;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .login-fullpage-formpanel {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justifyContent: center;
          padding: 3.5rem 4.5rem;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .login-form-card {
          width: 100%;
          max-width: 440px;
        }
        @media (max-width: 1080px) {
          .login-fullpage-showcase {
            padding: 3rem 2.5rem;
          }
          .login-fullpage-formpanel {
            padding: 3rem 2.5rem;
          }
        }
        @media (max-width: 900px) {
          .login-fullpage-container {
            grid-template-columns: 1fr;
          }
          .login-fullpage-showcase {
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
            padding: 2.5rem 1.5rem 2rem;
          }
          .login-fullpage-formpanel {
            min-height: auto;
            padding: 2.5rem 1.5rem 3.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
