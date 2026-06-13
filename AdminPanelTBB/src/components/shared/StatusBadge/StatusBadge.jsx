import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ label, variant = 'default' }) => {
  return <span className={`status-badge ${variant}`}>{label}</span>;
};

export default StatusBadge;
