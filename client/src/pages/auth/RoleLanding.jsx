import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  Shield,
  UserCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';
import TaskFlowIllustration from '../../components/common/TaskFlowIllustration';

export const RoleLanding = () => {
  const navigate = useNavigate();

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
      {/* Large Centered Rounded Two-Column Container */}
      <div
        className="taskflow-split-container"
        style={{
          width: '100%',
          maxWidth: '1080px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
        }}
      >
        {/* ========================================================= */}
        {/* LEFT SIDE: Brand / Introduction & SaaS Illustration       */}
        {/* ========================================================= */}
        <div
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Logo & Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Layers size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: '#0f172a',
                    }}
                  >
                    TaskFlow
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    Enterprise
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                  Enterprise Task Management System
                </p>
              </div>
            </div>

            {/* Main Heading & Description */}
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                lineHeight: 1.3,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
              }}
            >
              Streamline work. Track progress with confidence.
            </h1>

            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: '#475569',
                marginBottom: '1.75rem',
                maxWidth: '420px',
              }}
            >
              Organize deliverables, assign responsibilities, and monitor task completion in real time.
            </p>

            {/* Feature Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem 1rem',
                marginBottom: '1rem',
              }}
            >
              {[
                'Employee Directory',
                'Role-Based Access',
                'Live Task Updates',
                'Automated Email Alerts',
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    color: '#334155',
                    fontWeight: 500,
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} strokeWidth={2.5} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Illustration Mockup */}
          <div className="desktop-only" style={{ marginTop: '1.5rem' }}>
            <TaskFlowIllustration />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: Role Selection Cards                          */}
        {/* ========================================================= */}
        <div
          style={{
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid #bfdbfe',
                display: 'inline-block',
                marginBottom: '0.625rem',
              }}
            >
              Sign In Portal
            </span>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              Select your workspace
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              Choose your role to access the corresponding TaskFlow console.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div
            className="role-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {/* CARD 1 — ADMIN PANEL */}
            <div
              className="role-card admin-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Shield size={20} strokeWidth={2} />
                </div>

                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: '0 0 0.35rem 0',
                  }}
                >
                  Admin Console
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#64748b',
                    lineHeight: 1.5,
                    margin: '0 0 1rem 0',
                    minHeight: '36px',
                  }}
                >
                  Assign tasks, manage team members, and oversee operations.
                </p>

                {/* Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                  {[
                    'Create & assign tasks',
                    'Manage employee access',
                    'Track team deliverables',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '0.8125rem',
                        color: '#334155',
                      }}
                    >
                      <Check size={13} strokeWidth={2.5} style={{ color: '#2563eb', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                id="role-continue-admin-btn"
                onClick={() => navigate('/admin/login')}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <span>Continue as Admin</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* CARD 2 — EMPLOYEE WORKSPACE */}
            <div
              className="role-card employee-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <UserCheck size={20} strokeWidth={2} />
                </div>

                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: '0 0 0.35rem 0',
                  }}
                >
                  Employee Portal
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#64748b',
                    lineHeight: 1.5,
                    margin: '0 0 1rem 0',
                    minHeight: '36px',
                  }}
                >
                  View your assignments, update task status, and track execution.
                </p>

                {/* Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                  {[
                    'View assigned tasks',
                    'Update execution status',
                    'Trigger status alerts',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '0.8125rem',
                        color: '#334155',
                      }}
                    >
                      <Check size={13} strokeWidth={2.5} style={{ color: '#0284c7', flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                id="role-continue-employee-btn"
                onClick={() => navigate('/employee/login')}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <span>Continue as Employee</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Employee Register Link */}
          <div
            style={{
              textAlign: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.8125rem',
              color: '#64748b',
            }}
          >
            <span>Are you a new team member? </span>
            <Link
              to="/employee/register"
              id="role-employee-register-link"
              style={{ color: '#2563eb', fontWeight: 600 }}
            >
              Create an employee account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLanding;
