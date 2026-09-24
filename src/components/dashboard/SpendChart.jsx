import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { analyticsTrends } from '../../data/mockData';

export const SpendChart = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const data = analyticsTrends;
  const maxSpend = Math.max(...data.map((d) => d.totalSpent), 10000) * 1.15;

  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Calculate points for line/area
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * innerWidth;
    const y = chartHeight - paddingY - (d.totalSpent / maxSpend) * innerHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (point.x - prev.x) / 2;
    const cpy2 = point.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <BarChart3 size={18} color="var(--color-primary)" />
          Spending Overview (Last 6 Months)
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Monthly Total (₹ INR)
        </div>
      </div>

      <div className="card-body" style={{ padding: '16px 20px 24px' }}>
        <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - paddingY - ratio * innerHeight;
              const value = Math.round((ratio * maxSpend) / 1000) * 1000;
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray={i === 0 ? '' : '3 3'}
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--text-muted)"
                    fontFamily="var(--font-mono)"
                  >
                    ₹{(value / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#spendGradient)" />

            {/* Spline Path */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interactive Points */}
            {points.map((p, index) => {
              const isHovered = hoverIndex === index;
              return (
                <g key={index}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill="var(--bg-surface)"
                    stroke="var(--color-primary)"
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />

                  {/* Month Label */}
                  <text
                    x={p.x}
                    y={chartHeight - paddingY + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? 700 : 500}
                    fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                  >
                    {p.month.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Tooltip */}
          {hoverIndex !== null && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${(points[hoverIndex].x / chartWidth) * 100}%`,
                transform: 'translate(-50%, -10px)',
                background: 'var(--text-primary)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: 11.5,
                fontWeight: 600,
                pointerEvents: 'none',
                boxShadow: 'var(--shadow-md)',
                whiteSpace: 'nowrap',
                zIndex: 10,
              }}
            >
              <div style={{ fontWeight: 800 }}>{points[hoverIndex].month}</div>
              <div>₹{points[hoverIndex].totalSpent.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 10, opacity: 0.85 }}>
                {points[hoverIndex].approvedCount} approved claims
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
