import React from 'react';
import './Pagination.css';

const Pagination = ({ page = 1, total = 10, onPageChange }) => {
  const pages = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className="pagination-wrapper">
      {pages.map((num) => (
        <button
          key={num}
          type="button"
          className={`pagination-item ${page === num ? 'active' : ''}`}
          onClick={() => onPageChange?.(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
