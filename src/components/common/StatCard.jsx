import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  subtitle,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`stat-card ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {(trend || subtitle) && (
        <div className="stat-card-meta">
          {trend && (
            <span className={trendType === 'up' ? 'trend-up' : trendType === 'down' ? 'trend-down' : ''}>
              {trendType === 'up' && <TrendingUp size={14} style={{ marginRight: 4 }} />}
              {trendType === 'down' && <TrendingDown size={14} style={{ marginRight: 4 }} />}
              {trend}
            </span>
          )}
          {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
