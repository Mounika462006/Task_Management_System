import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page, limit, total, totalPages } = pagination;

  const startItem = Math.min((page - 1) * limit + 1, total);
  const endItem = Math.min(page * limit, total);

  // Generate page numbers array with ellipsis for many pages
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '1rem'
    }}>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Showing <strong style={{ color: 'var(--text-main)' }}>{startItem}</strong> to{' '}
        <strong style={{ color: 'var(--text-main)' }}>{endItem}</strong> of{' '}
        <strong style={{ color: 'var(--text-main)' }}>{total}</strong> tasks
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <button
          id="pagination-prev-btn"
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} style={{ padding: '0.4rem 0.5rem', color: 'var(--text-muted)' }}>
                ...
              </span>
            );
          }
          const isActive = p === page;
          return (
            <button
              key={`page-${p}`}
              id={`pagination-page-${p}-btn`}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                minWidth: '2.25rem',
                fontWeight: isActive ? 700 : 500
              }}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          );
        })}

        <button
          id="pagination-next-btn"
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
