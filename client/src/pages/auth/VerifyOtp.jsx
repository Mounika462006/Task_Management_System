import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MailCheck, AlertCircle, CheckCircle2, RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || sessionStorage.getItem('taskflow_pending_email') || '';
  const employeeName = location.state?.name || sessionStorage.getItem('taskflow_pending_name') || '';

  // Save to sessionStorage so reload doesn't lose state
  useEffect(() => {
    if (location.state?.email) {
      sessionStorage.setItem('taskflow_pending_email', location.state.email);
    }
    if (location.state?.name) {
      sessionStorage.setItem('taskflow_pending_name', location.state.name);
    }
  }, [location.state]);

  // 6 separate digits for OTP input
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 5-minute total expiration timer (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300);

  // 60-second resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(60);

  // If user opens /employee/verify-otp directly without an email in state or storage, redirect to register
  useEffect(() => {
    if (!email) {
      navigate('/employee/register', { replace: true });
    }
  }, [email, navigate]);

  // Total expiry countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Mask email for display (e.g. j***e@gmail.com)
  const getMaskedEmail = (rawEmail) => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [user, domain] = rawEmail.split('@');
    if (user.length <= 2) {
      return `${user[0]}*@${domain}`;
    }
    const visibleStart = user.slice(0, 2);
    const visibleEnd = user.slice(-1);
    const maskedMiddle = '*'.repeat(Math.min(user.length - 3, 4));
    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
  };

  // Handle direct paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text') || '';
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);
    if (!digits) return;

    const newDigits = [...otpDigits];
    digits.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    setError('');

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle single digit input change
  const handleDigitChange = (index, value) => {
    setError('');
    const cleanDigits = value.replace(/\D/g, '');

    if (!cleanDigits) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // If pasted or typed multiple characters
    if (cleanDigits.length > 1) {
      const newDigits = [...otpDigits];
      if (cleanDigits.length === 2 && otpDigits[index]) {
        const newChar = cleanDigits.replace(otpDigits[index], '') || cleanDigits.slice(-1);
        newDigits[index] = newChar;
        setOtpDigits(newDigits);
        if (index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
        return;
      }

      const chars = cleanDigits.slice(0, 6).split('');
      chars.forEach((c, i) => {
        if (index + i < 6) {
          newDigits[index + i] = c;
        }
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single digit input
    const newDigits = [...otpDigits];
    newDigits[index] = cleanDigits;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard navigation & backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...otpDigits];
      if (otpDigits[index]) {
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const fullOtp = otpDigits.join('');

  // Submit OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();
    if (fullOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    if (secondsLeft <= 0) {
      setError('OTP has expired. Please request a new verification code.');
      return;
    }

    setError('');
    setSuccessInfo('');
    setIsSubmitting(true);

    try {
      const res = await authService.verifyOtp({ email, otp: fullOtp });
      if (res.success) {
        sessionStorage.removeItem('taskflow_pending_email');
        sessionStorage.removeItem('taskflow_pending_name');

        // Redirect to employee login with success banner
        navigate('/employee/login', {
          replace: true,
          state: {
            successMessage: 'Account verified successfully! You can now sign in with your password.',
          },
        });
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please check your email and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setError('');
    setSuccessInfo('');
    setIsResending(true);

    try {
      const res = await authService.resendOtp({ email });
      if (res.success) {
        setSuccessInfo('A new verification code has been dispatched to your email.');
        setSecondsLeft(300); // Reset 5-minute timer
        setResendCooldown(60); // Reset 60-second cooldown
        setOtpDigits(['', '', '', '', '', '']); // Clear input
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2rem 2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Back Link */}
        <Link
          to="/employee/register"
          id="verify-back-to-register-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            textDecoration: 'none',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <ArrowLeft size={16} />
          <span>Back to Registration</span>
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              border: '1px solid #dbeafe',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <MailCheck size={22} />
          </div>

          <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
              }}
            >
              Account Verification
            </span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Verify Your Email
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
            We've sent a 6-digit verification code to
          </p>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '3px 10px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {getMaskedEmail(email)}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successInfo && (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              color: '#15803d',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successInfo}</span>
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* Segmented 6-digit OTP Inputs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                id={`otp-digit-${index}`}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => {
                  e.target.select();
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = digit ? '#2563eb' : '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
                style={{
                  width: '46px',
                  height: '52px',
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                  border: digit ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  outline: 'none',
                  cursor: 'text',
                  transition: 'all var(--transition-fast)',
                }}
                disabled={isSubmitting}
                autoFocus={index === 0}
                aria-label={`Digit ${index + 1} of 6`}
              />
            ))}
          </div>

          {/* Expiration Timer display */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: secondsLeft <= 30 ? '#dc2626' : '#64748b',
              marginBottom: '1.25rem',
              fontWeight: secondsLeft <= 30 ? 600 : 400,
            }}
          >
            {secondsLeft > 0 ? (
              <span>
                Code expires in{' '}
                <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#0f172a' }}>
                  {formatTime(secondsLeft)}
                </strong>
              </span>
            ) : (
              <span style={{ color: '#dc2626' }}>Code has expired. Request a new verification code below.</span>
            )}
          </div>

          {/* Verify OTP Button */}
          <button
            type="submit"
            id="verify-otp-submit-btn"
            className="btn btn-primary"
            style={{ width: '100%', height: '42px', fontSize: '0.92rem', fontWeight: 600 }}
            disabled={fullOtp.length !== 6 || isSubmitting || secondsLeft <= 0}
          >
            {isSubmitting ? (
              'Verifying Code...'
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#64748b' }}>Didn't receive the email?</span>
          <button
            type="button"
            id="resend-otp-btn"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            style={{
              background: 'none',
              border: 'none',
              color: resendCooldown > 0 ? '#94a3b8' : '#2563eb',
              fontWeight: 600,
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: 0,
            }}
          >
            <RotateCw size={14} className={isResending ? 'spin' : ''} />
            <span>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
