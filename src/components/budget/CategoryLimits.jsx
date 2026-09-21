import React from 'react';
import { Tag } from 'lucide-react';

export const CategoryLimits = ({ categories = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Tag size={18} color="var(--color-primary)" />
          Category Spending vs Limits
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Active Month Breakdown
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {categories.map((cat) => {
          const limit = cat.limit || 1;
          const spent = cat.spent || 0;
          const percent = Math.min(100, Math.round((spent / limit) * 100));
          const remaining = Math.max(0, limit - spent);

          let barColor = cat.color || 'var(--color-primary)';
          if (percent >= 90) barColor = 'var(--status-rejected-dot)';
          else if (percent >= 75) barColor = 'var(--status-pending-dot)';

          return (
            <div key={cat.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                  {cat.name}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    ₹{spent.toLocaleString('en-IN')} of ₹{limit.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: percent >= 90 ? 'var(--status-rejected-text)' : 'var(--text-primary)',
                    }}
                  >
                    ({percent}%)
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  ₹{remaining.toLocaleString('en-IN')} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
