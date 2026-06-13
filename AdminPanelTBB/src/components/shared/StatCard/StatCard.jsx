import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, badge, color, detail, trend, icon: Icon }) => {
  const isTrendingUp = trend === 'up';
  
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title">
          <span>{title}</span>
          {badge && <span className="stat-badge">{badge}</span>}
        </div>
        {Icon && (
          <div className="stat-card-icon">
            <Icon size={20} />
          </div>
        )}
      </div>
      
      <div className="stat-card-content">
        <div className="stat-card-value" style={{ color: color || 'var(--text-primary)' }}>
          {value}
        </div>
        {detail && (
          <div className={`stat-card-detail ${isTrendingUp ? 'trending-up' : 'trending-down'}`}>
            {isTrendingUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{detail}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
