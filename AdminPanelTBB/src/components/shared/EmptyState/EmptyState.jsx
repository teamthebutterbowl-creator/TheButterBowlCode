import React from 'react';
import Button from '../../common/Button/Button';
import './EmptyState.css';

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="empty-state-card">
    <div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-description">{description}</p>
    </div>
    {actionLabel && onAction && (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
