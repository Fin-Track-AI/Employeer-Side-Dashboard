import React from 'react';
import {
  Users,
  Receipt,
  CheckCircle2,
  IndianRupee,
  Wallet,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { PendingApprovals } from '../components/dashboard/PendingApprovals';
import { BudgetWidget } from '../components/dashboard/BudgetWidget';
import { SpendChart } from '../components/dashboard/SpendChart';
import { useApp } from '../context/AppContext';

export const DashboardView = ({ onOpenClaim, onRejectClaim }) => {
  const {
    employees,
    claims,
    pendingClaims,
    approvedClaims,
    budget,
    setCurrentView,
  } = useApp();

  const totalReimbursedThisMonth = budget.spentThisMonth || 0;
  const remainingBudget = budget.remainingThisMonth || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Stat Metrics Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={Users}
          subtitle="Linked via mobile app"
          onClick={() => setCurrentView('employees')}
        />

        <StatCard
          title="Pending Claims"
          value={pendingClaims.length}
          icon={Receipt}
          trend={pendingClaims.length > 0 ? 'Requires your review' : 'All cleared'}
          trendType={pendingClaims.length > 0 ? 'down' : 'up'}
          onClick={() => setCurrentView('claims')}
          className={pendingClaims.length > 0 ? 'pulse-border' : ''}
        />

        <StatCard
          title="Approved Claims"
          value={approvedClaims.length}
          icon={CheckCircle2}
          subtitle="Processed this cycle"
          onClick={() => setCurrentView('claims')}
        />

        <StatCard
          title="Total Reimbursed"
          value={`₹${totalReimbursedThisMonth.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          subtitle="Current month spend"
          onClick={() => setCurrentView('budget')}
        />

        <StatCard
          title="Remaining Budget"
          value={`₹${remainingBudget.toLocaleString('en-IN')}`}
          icon={Wallet}
          trend="Healthy cap status"
          trendType="up"
          onClick={() => setCurrentView('budget')}
        />
      </div>

      {/* Pending Approvals Section */}
      <PendingApprovals
        onOpenClaim={onOpenClaim}
        onRejectClaim={onRejectClaim}
      />

      {/* Dual Column: Budget Overview & Spending Trend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        <BudgetWidget />
        <SpendChart />
      </div>
    </div>
  );
};
