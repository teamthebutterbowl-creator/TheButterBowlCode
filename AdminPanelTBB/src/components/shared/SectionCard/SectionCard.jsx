import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import './SectionCard.css';

const SectionCard = ({ icon, title, status, onEdit, onDelete }) => {
  return (
    <div className="section-card">
      <div className="section-card-main">
        <div className="section-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <StatusBadge label={status} variant={status === 'Live' ? 'success' : 'warning'} />
        </div>
      </div>
      <div className="section-card-actions">
        <button type="button" className="secondary-button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="ghost-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default SectionCard;
