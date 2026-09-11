import React from 'react';
import {
  User,
  Mail,
  Building,
  Briefcase,
  Calendar,
  Phone,
  Hash,
  AtSign,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import useAuth from '../../hooks/useAuth';
import { getInitials, formatDate } from '../../utils/helpers';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      {/* Standard Sticky Header */}
      <Header
        title="My Profile"
        subtitle="View your corporate profile details, identification, and workspace credentials."
      />

      <div className="page-wrapper">
        {/* Main Profile Banner Card */}
        <div
          className="card"
          style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                border: '2px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1d4ed8',
                flexShrink: 0,
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {user?.name || 'Employee Name'}
                </h2>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>{user?.status || 'ACTIVE'}</span>
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                {user?.designation || 'Staff Member'} • {user?.department || 'Operations'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Hash size={14} color="#94a3b8" />
                  <strong>ID:</strong> {user?.employeeId || 'EMP-001'}
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AtSign size={14} color="#94a3b8" />
                  <strong>Username:</strong> {user?.username || user?.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Access Role</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              {user?.role === 'ADMIN' ? 'Administrator' : 'Enterprise Employee'}
            </div>
          </div>
        </div>

        {/* Grid of Profile Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
          {/* Employment Information */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 1.25rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Briefcase size={18} color="#2563eb" />
              <span>Employment Details</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Department
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.department || 'Engineering'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Designation
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.designation || 'Software Engineer'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Employee Identification
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.employeeId || 'EMP-001'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Date of Joining
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.dateOfJoining ? formatDate(user.dateOfJoining) : 'Active Corporate Member'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Credentials */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 1.25rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Mail size={18} color="#2563eb" />
              <span>Contact & Credentials</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Primary Email
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.email || 'employee@taskflow.local'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Account Username
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.username || user?.email?.split('@')[0]}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Contact Phone
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.phone || 'Not provided'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Account Governance
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={15} color="#16a34a" />
                  <span>Managed directly by Corporate Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
