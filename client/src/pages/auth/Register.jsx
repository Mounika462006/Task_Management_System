import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, ArrowRight, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { authService } from '../../services/authService';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');

    // Frontend validation
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      if (res.success) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();
        sessionStorage.setItem('taskflow_pending_email', cleanEmail);
        sessionStorage.setItem('taskflow_pending_name', cleanName);

        // Navigate to Step 2 OTP verification page
        navigate('/employee/verify-otp', {
          state: {
            email: cleanEmail,
            name: cleanName,
          },
        });
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const mapped = {};
        err.errors.forEach((e) => {
          mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
      } else {
        setGeneralError(err.message || 'Registration failed. Please try again.');
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
          maxWidth: '480px',
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
          id="register-back-to-roles-link"
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
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              border: '1px solid #bae6fd',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <UserPlus size={24} strokeWidth={2} />
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
                backgroundColor: '#f0f9ff',
                color: '#0284c7',
                border: '1px solid #bae6fd',
              }}
            >
              Step 1 of 2: Registration
            </span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Enter your details to register as a TaskFlow team member.
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div
            role="alert"
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
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-name"
                type="text"
                className="form-control"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                }}
                required
                autoFocus
                style={{
                  paddingLeft: '2.5rem',
                  borderColor: fieldErrors.name ? '#dc2626' : undefined,
                }}
              />
              <User
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
            {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-email"
                type="email"
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
                required
                style={{
                  paddingLeft: '2.5rem',
                  borderColor: fieldErrors.email ? '#dc2626' : undefined,
                }}
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
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
                required
                style={{
                  paddingLeft: '2.5rem',
                  borderColor: fieldErrors.password ? '#dc2626' : undefined,
                }}
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
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-confirm-password"
                type="password"
                className="form-control"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                }}
                required
                style={{
                  paddingLeft: '2.5rem',
                  borderColor: fieldErrors.confirmPassword ? '#dc2626' : undefined,
                }}
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
            {fieldErrors.confirmPassword && <div className="form-error">{fieldErrors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            id="register-submit-btn"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              marginTop: '0.75rem',
              gap: '0.5rem',
            }}
          >
            {isSubmitting ? (
              <span>Sending Verification Code...</span>
            ) : (
              <>
                <span>Continue to OTP Verification</span>
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
          <span>Already have an account? </span>
          <Link
            to="/employee/login"
            id="register-login-link"
            style={{ color: '#2563eb', fontWeight: 600 }}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
