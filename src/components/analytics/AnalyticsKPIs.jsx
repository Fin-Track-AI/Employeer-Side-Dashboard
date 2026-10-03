import React from 'react';
import { CheckCircle2, Clock, IndianRupee, XCircle, TrendingUp } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { useApp } from '../../context/AppContext';

export const AnalyticsKPIs = () => {
  const { claims } = useApp();

  const totalClaims = claims.length;
  const approved = claims.filter((c) => c.status === 'Approved' || c.status === 'Paid').length;
  const rejected = claims.filter((c) => c.status === 'Rejected').length;
  const pending = claims.filter((c) => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'In Review').length;
  const adjudicated = approved + rejected;

  const approvalRate = adjudicated > 0 ? Math.round((approved / adjudicated) * 100) : 0;
  const rejectionRate = adjudicated > 0 ? Math.round((rejected / adjudicated) * 100) : 0;

  const totalApprovedAmount = claims
    .filter((c) => c.status === 'Approved' || c.status === 'Paid')
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  const avgClaimAmount =
    totalClaims > 0
      ? Math.round(claims.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) / totalClaims)
      : 0;

  return (
    <div className="stat-grid" style={{ marginBottom: 20 }}>
      <StatCard
        title="Approval Rate"
        value={`${approvalRate}%`}
        icon={CheckCircle2}
        trend={adjudicated > 0 ? `${approvalRate}% of ${adjudicated} reviewed` : 'Awaiting claim review'}
        trendType={approvalRate > 0 ? 'up' : 'neutral'}
      />

      <StatCard
        title="Avg Processing Time"
        value={totalClaims > 0 ? '< 24 hrs' : '—'}
        icon={Clock}
        subtitle={totalClaims > 0 ? 'Target: < 24 hrs SLA' : 'Awaiting first claim'}
      />

      <StatCard
        title="Average Claim Size"
        value={`₹${avgClaimAmount.toLocaleString('en-IN')}`}
        icon={IndianRupee}
        subtitle={totalClaims > 0 ? 'Per filed employee claim' : 'No claims submitted'}
      />

      <StatCard
        title="Rejection Rate"
        value={`${rejectionRate}%`}
        icon={XCircle}
        trend={totalClaims > 0 ? `${rejected} policy violation(s)` : '0 policy violations'}
        trendType={rejectionRate > 0 ? 'down' : 'neutral'}
      />

      <StatCard
        title="Total Settled Claims"
        value={`₹${totalApprovedAmount.toLocaleString('en-IN')}`}
        icon={TrendingUp}
        subtitle="Approved & paid year-to-date"
      />
    </div>
  );
};
