import React from 'react';
import { Wallet, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const BudgetWidget = () => {
  const { budget, setCurrentView } = useApp();

  const monthlyBudget = budget.monthlyBudget || 250000;
  const spent = budget.spentThisMonth || 0;
  const remaining = Math.max(0, monthlyBudget - spent);
  const percentUtilized = Math.min(100, Math.round((spent / monthlyBudget) * 100));

  const isWarning = percentUtilized >= 80 && percentUtilized < 95;
  const isCritical = percentUtilized >= 95;

  let progressColor = 'var(--color-primary)';
  if (isWarning) progressColor = 'var(--status-pending-dot)';
  if (isCritical) progressColor = 'var(--status-rejected-dot)';

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Wallet size={18} color="var(--color-primary)" />
          Budget Overview
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setCurrentView('budget')}
        >
          Manage Budget
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="card-body">
        {/* Metric Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Monthly Allocated
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
              ₹{monthlyBudget.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Amount Spent
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
              ₹{spent.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Clean Progress Indicator */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Budget Utilized</span>
            <span style={{ color: progressColor }}>{percentUtilized}%</span>
          </div>

          <div
            style={{
              height: 10,
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${percentUtilized}%`,
                height: '100%',
                backgroundColor: progressColor,
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Remaining info and alert state */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: isCritical
              ? 'var(--status-rejected-bg)'
              : isWarning
              ? 'var(--status-pending-bg)'
              : 'var(--status-approved-bg)',
            border: `1px solid ${
              isCritical
                ? 'var(--status-rejected-border)'
                : isWarning
                ? 'var(--status-pending-border)'
                : 'var(--status-approved-border)'
            }`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isCritical ? (
              <AlertTriangle size={16} color="var(--status-rejected-text)" />
            ) : isWarning ? (
              <AlertTriangle size={16} color="var(--status-pending-text)" />
            ) : (
              <CheckCircle2 size={16} color="var(--status-approved-text)" />
            )}
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: isCritical
                  ? 'var(--status-rejected-text)'
                  : isWarning
                  ? 'var(--status-pending-text)'
                  : 'var(--status-approved-text)',
              }}
            >
              {isCritical
                ? 'Budget cap almost reached!'
                : isWarning
                ? '80% threshold crossed'
                : 'Healthy spending trajectory'}
            </span>
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: isCritical
                ? 'var(--status-rejected-text)'
                : isWarning
                ? 'var(--status-pending-text)'
                : 'var(--status-approved-text)',
            }}
          >
            ₹{remaining.toLocaleString('en-IN')} left
          </span>
        </div>
      </div>
    </div>
  );
};
