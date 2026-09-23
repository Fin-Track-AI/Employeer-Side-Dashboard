import React, { useState } from 'react';
import { Wallet, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { CategoryLimits } from '../components/budget/CategoryLimits';
import { DepartmentLimits } from '../components/budget/DepartmentLimits';
import { EditBudgetModal } from '../components/budget/EditBudgetModal';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';

export const BudgetView = () => {
  const { budget, updateBudget } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const monthlyBudget = budget.monthlyBudget || 250000;
  const spent = budget.spentThisMonth || 0;
  const remaining = Math.max(0, monthlyBudget - spent);
  const percentUtilized = Math.min(100, Math.round((spent / monthlyBudget) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Budget Action Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
            Corporate Reimbursement Budget Governance
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Cycle: September 2026 • Controlled under Company Financial Policy
          </div>
        </div>

        <Button
          variant="primary"
          icon={Settings}
          onClick={() => setIsEditModalOpen(true)}
        >
          Configure & Edit Budget
        </Button>
      </div>

      {/* Top Budget Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Monthly Allocation"
          value={`₹${monthlyBudget.toLocaleString('en-IN')}`}
          icon={Wallet}
          subtitle="Fixed corporate monthly cap"
        />

        <StatCard
          title="Spent This Month"
          value={`₹${spent.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          trend={`${percentUtilized}% utilized`}
          trendType={percentUtilized >= 90 ? 'down' : 'up'}
        />

        <StatCard
          title="Remaining Budget"
          value={`₹${remaining.toLocaleString('en-IN')}`}
          icon={Wallet}
          subtitle="Available for pending claims"
        />

        <StatCard
          title="Projected Month-End"
          value={`₹${(budget.projectedMonthEnd != null ? budget.projectedMonthEnd : 0).toLocaleString('en-IN')}`}
          icon={TrendingUp}
          trend={budget.projectedMonthEnd > 0 ? 'Within monthly allocation' : 'Awaiting activity'}
          trendType={budget.projectedMonthEnd > 0 ? 'up' : 'neutral'}
        />

        <StatCard
          title="Annual Corporate Pool"
          value={`₹${(budget.annualBudget || 1800000).toLocaleString('en-IN')}`}
          icon={Wallet}
          subtitle="FY 2026-27 total budget"
        />
      </div>

      {/* Category Breakdown & Department Quotas Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        <CategoryLimits categories={budget.categories} />
        <DepartmentLimits departments={budget.departments} />
      </div>

      {/* Edit Budget Modal with 2-step confirmation */}
      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentBudget={budget}
        onSaveBudget={updateBudget}
      />
    </div>
  );
};
