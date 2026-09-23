import React, { useState } from 'react';
import { BarChart3, PieChart, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyticsTrends } from '../../data/mockData';

export const AnalyticsCharts = () => {
  const { budget, claims } = useApp();
  const [timeRange, setTimeRange] = useState('6M'); // '1M' | '3M' | '6M'

  const timeOptions = [
    { id: '1M', label: 'This Month' },
    { id: '3M', label: 'Last 3 Months' },
    { id: '6M', label: 'Last 6 Months' },
  ];

  // Calculate category totals
  const categories = budget.categories || [];
  const totalCategorySpend = categories.reduce((sum, c) => sum + (c.spent || 0), 0);

  // Calculate department totals
  const departments = budget.departments || [];
  const totalDeptSpend = departments.reduce((sum, d) => sum + (d.spent || 0), 0);

  // Claim status distribution
  const totalClaims = claims.length;
  const approvedCount = claims.filter((c) => c.status === 'Approved' || c.status === 'Paid').length;
  const pendingCount = claims.filter((c) => c.status === 'Pending').length;
  const rejectedCount = claims.filter((c) => c.status === 'Rejected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Time Range Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          <Calendar size={16} color="var(--color-primary)" />
          Reporting Timeframe:
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {timeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTimeRange(opt.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid',
                borderColor: timeRange === opt.id ? 'var(--color-primary)' : 'var(--border-color)',
                background: timeRange === opt.id ? 'var(--color-primary-50)' : 'var(--bg-surface)',
                color: timeRange === opt.id ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <PieChart size={18} color="var(--color-primary)" />
              Reimbursement by Category
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Share of Total</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categories.map((cat) => {
              const spent = cat.spent || 0;
              const share = totalCategorySpend > 0 ? Math.round((spent / totalCategorySpend) * 100) : 0;

              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      ₹{spent.toLocaleString('en-IN')} ({share}%)
                    </span>
                  </div>

                  <div
                    style={{
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-surface-subtle)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${share}%`,
                        height: '100%',
                        background: cat.color || 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={18} color="var(--color-primary)" />
              Reimbursement by Department
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Team Burn</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {departments.map((dept) => {
              const spent = dept.spent || 0;
              const share = totalDeptSpend > 0 ? Math.round((spent / totalDeptSpend) * 100) : 0;

              return (
                <div key={dept.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dept.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      ₹{spent.toLocaleString('en-IN')} ({share}%)
                    </span>
                  </div>

                  <div
                    style={{
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-surface-subtle)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${share}%`,
                        height: '100%',
                        background: '#6366F1',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Claim Status Distribution Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={18} color="var(--color-primary)" />
            Claim Approval & Processing Distribution
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total {totalClaims} claim{totalClaims === 1 ? '' : 's'}</span>
        </div>

        <div className="card-body">
          <div
            style={{
              display: 'flex',
              height: 16,
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: 20,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {totalClaims > 0 ? (
              <>
                <div
                  style={{
                    width: `${(approvedCount / totalClaims) * 100}%`,
                    background: 'var(--status-approved-dot)',
                    title: 'Approved',
                  }}
                />
                <div
                  style={{
                    width: `${(pendingCount / totalClaims) * 100}%`,
                    background: 'var(--status-pending-dot)',
                    title: 'Pending',
                  }}
                />
                <div
                  style={{
                    width: `${(rejectedCount / totalClaims) * 100}%`,
                    background: 'var(--status-rejected-dot)',
                    title: 'Rejected',
                  }}
                />
              </>
            ) : null}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ padding: 14, background: 'var(--status-approved-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-approved-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-approved-text)' }}>
                Approved / Paid
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--status-approved-text)', marginTop: 4 }}>
                {approvedCount}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--status-approved-text)', opacity: 0.85 }}>
                {totalClaims > 0 ? Math.round((approvedCount / totalClaims) * 100) : 0}% of claims
              </div>
            </div>

            <div style={{ padding: 14, background: 'var(--status-pending-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-pending-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-pending-text)' }}>
                Pending Review
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--status-pending-text)', marginTop: 4 }}>
                {pendingCount}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--status-pending-text)', opacity: 0.85 }}>
                {totalClaims > 0 ? Math.round((pendingCount / totalClaims) * 100) : 0}% of claims
              </div>
            </div>

            <div style={{ padding: 14, background: 'var(--status-rejected-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-rejected-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-rejected-text)' }}>
                Rejected
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--status-rejected-text)', marginTop: 4 }}>
                {rejectedCount}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--status-rejected-text)', opacity: 0.85 }}>
                {totalClaims > 0 ? Math.round((rejectedCount / totalClaims) * 100) : 0}% of claims
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
