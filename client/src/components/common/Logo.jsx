import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

/**
 * TaskFlow Official Brand Logo Component
 * Renders the official TaskFlow orbital-checkmark logo with responsive sizing and styling.
 */
export const Logo = ({
  size = 'md', // 'sm' (28px), 'md' (38px), 'lg' (46px), 'xl' (54px), or number
  showText = true,
  subtitle = 'Enterprise Task Management',
  badgeText = null,
  to = null,
  className = '',
  style = {},
  imageOnly = false,
  textColor = '#0f172a',
  subtitleColor = '#64748b',
}) => {
  let imgHeight = 40;
  let titleSize = '1.3rem';
  let subSize = '0.72rem';

  if (typeof size === 'number') {
    imgHeight = size;
    titleSize = `${Math.round(size * 0.35 * 10) / 10}rem`;
    subSize = `${Math.round(size * 0.19 * 10) / 10}rem`;
  } else if (size === 'sm') {
    imgHeight = 30;
    titleSize = '1.05rem';
    subSize = '0.675rem';
  } else if (size === 'md') {
    imgHeight = 40;
    titleSize = '1.3rem';
    subSize = '0.72rem';
  } else if (size === 'lg') {
    imgHeight = 48;
    titleSize = '1.45rem';
    subSize = '0.78rem';
  } else if (size === 'xl') {
    imgHeight = 58;
    titleSize = '1.75rem';
    subSize = '0.85rem';
  }

  const content = (
    <div
      className={`taskflow-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.875rem',
        textDecoration: 'none',
        ...style,
      }}
    >
      <img
        src={logoImg}
        alt="TaskFlow Logo"
        style={{
          height: `${imgHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 6px rgba(37, 99, 235, 0.18))',
        }}
      />
      {showText && !imageOnly && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: titleSize,
                fontWeight: 800,
                color: textColor,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                fontFamily: 'var(--font-primary, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              TaskFlow
            </span>
            {badgeText && (
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
                  lineHeight: '1.2',
                }}
              >
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <span
              style={{
                fontSize: subSize,
                fontWeight: 600,
                color: subtitleColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '0.15rem',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
