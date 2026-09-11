import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Sliders,
  Check,
  Server,
  Globe,
  Lock,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import useAuth from '../../hooks/useAuth';

export const SettingsPage = () => {
  const { user, isAdmin } = useAuth();
  const [savedToast, setSavedToast] = useState(false);
  const [prefs, setPrefs] = useState({
    emailOnAssignment: true,
    emailOnStatusChange: true,
    emailDailyDigest: false,
    autoRefreshDashboard: true,
    soundNotifications: false,
  });

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast();
  };

  const showToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      {/* Toast */}
      {savedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            zIndex: 9999,
          }}
        >
          <Check size={16} color="#22c55e" />
          <span>Settings saved successfully</span>
        </div>
      )}

      {/* Standard Sticky Header */}
      <Header
        title="Settings & Preferences"
        subtitle="Manage your notification channels, security policies, and workspace configurations."
      />

      <div className="page-wrapper">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          {/* Email & Notification Settings */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Notification Dispatches
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Configure when TaskFlow triggers email notifications via Nodemailer SMTP.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    Task Assignment Notifications
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Send an instant email to the employee whenever a new task is created and assigned.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.emailOnAssignment}
                  onChange={() => handleToggle('emailOnAssignment')}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    Status Change Email to Admin
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Send real-time alerts to the configured Admin email when employees change status to In Progress or Completed.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.emailOnStatusChange}
                  onChange={() => handleToggle('emailOnStatusChange')}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    Live Data Auto-Refresh
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Automatically refresh task lists and dashboard statistics without reloading the page.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.autoRefreshDashboard}
                  onChange={() => handleToggle('autoRefreshDashboard')}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563eb' }}
                />
              </div>
            </div>
          </div>

          {/* Enterprise System Configuration (Admin Only) */}
          {isAdmin && (
            <div
              className="card"
              style={{
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Server size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Enterprise SMTP & Access Policy
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                    Backend integration details and enterprise identity management.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Admin Notification Recipient
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
                    admin.taskflow@gmail.com
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 500 }}>
                    • Active Nodemailer Recipient
                  </div>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Registration Policy
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
                    Admin Controlled Only
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.25rem', fontWeight: 500 }}>
                    • Public self-signup disabled
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security & Authentication */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Security & Session
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  JWT token session and cryptographic authentication parameters.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Authentication Strategy</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Bearer JWT Token (7-Day Expiry)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Password Encryption</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>bcrypt (10 Salt Rounds)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Current User Role</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: user?.role === 'ADMIN' ? '#2563eb' : '#16a34a',
                    backgroundColor: user?.role === 'ADMIN' ? '#eff6ff' : '#f0fdf4',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
