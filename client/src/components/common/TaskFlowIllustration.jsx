import React from 'react';
import { CheckCircle2, Clock, CheckSquare, Layers, Shield, Users } from 'lucide-react';

export const TaskFlowIllustration = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        margin: '1.5rem auto 0 auto',
      }}
    >
      {/* Main SaaS Dashboard Mockup Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Mockup Window Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fca5a5' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fde047' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#86efac' }} />
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#64748b',
              backgroundColor: '#f8fafc',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
            }}
          >
            taskflow.internal
          </div>
        </div>

        {/* Mockup KPI Mini Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              padding: '0.625rem',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500 }}>Active Tasks</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>24</div>
          </div>
          <div
            style={{
              padding: '0.625rem',
              backgroundColor: '#eff6ff',
              borderRadius: '6px',
              border: '1px solid #bfdbfe',
            }}
          >
            <div style={{ fontSize: '0.6875rem', color: '#1d4ed8', fontWeight: 500 }}>In Progress</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1d4ed8', marginTop: '2px' }}>12</div>
          </div>
          <div
            style={{
              padding: '0.625rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '6px',
              border: '1px solid #bbf7d0',
            }}
          >
            <div style={{ fontSize: '0.6875rem', color: '#15803d', fontWeight: 500 }}>Completed</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#15803d', marginTop: '2px' }}>98%</div>
          </div>
        </div>

        {/* Mock Task Deliverable Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={13} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>
                Deploy Authentication Cluster
              </span>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '2px 6px',
                borderRadius: '9999px',
              }}
            >
              Completed
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={13} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>
                Frontend Enterprise Redesign
              </span>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#1d4ed8',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '2px 6px',
                borderRadius: '9999px',
              }}
            >
              In Progress
            </span>
          </div>
        </div>

        {/* Footer Meta Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.875rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.6875rem',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Shield size={12} strokeWidth={2} color="#2563eb" />
            <span>Role-Based Access Control</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Users size={12} strokeWidth={2} color="#0284c7" />
            <span>Real-time Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFlowIllustration;
