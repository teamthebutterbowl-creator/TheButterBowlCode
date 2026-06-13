import React from 'react';
import './ChartCard.css';

const ChartCard = ({ title, value, chartLabel, percent, progress }) => {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <span className="chart-title">{title}</span>
          <strong>{value}</strong>
        </div>
        <span className="chart-badge">{chartLabel}</span>
      </div>
      <div className="chart-visual">
        <div className="chart-segment" style={{ width: `${progress}%` }} />
      </div>
      <div className="chart-footnote">Completion rate {percent}% in the last 30 days</div>
    </div>
  );
};

export default ChartCard;
