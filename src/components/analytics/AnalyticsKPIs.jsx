import React from 'react';
import { CheckCircle2, Clock, IndianRupee, XCircle, TrendingUp } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { useApp } from '../../context/AppContext';

export const AnalyticsKPIs = () => {
  const { claims, budget } = useApp();

  const totalClaims = claims.length || 1;
  const approved = claims.filter((c) => c.status === 'Approved' || c.status === 'Paid').length;
  const rejected = claims.filter((c) => c.status === 'Rejected').length;
  const pending = claims.filter((c) => c.status === 'Pending').length;

  const approvalRate = Math.round((approved / totalClaims) * 100);
  const rejectionRate = Math.round((rejected / totalClaims) * 100);

  const totalApprovedAmount = claims
    .filter((c) => c.status === 'Approved' || c.status === 'Paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const avgClaimAmount = Math.round(
    claims.reduce((sum, c) => sum + c.amount, 0) / totalClaims
  );

  return (
    <div className="stat-grid" style={{ marginBottom: 20 }}>
      <StatCard
        title="Approval Rate"
        value={`${approvalRate}%`}
        icon={CheckCircle2}
        trend="+3.4% vs last month"
        trendType="up"
      />

      <StatCard
        title="Avg Processing Time"
        value="14.2 hrs"
        icon={Clock}
        subtitle="Target: < 24 hrs SLA"
      />

      <StatCard
        title="Average Claim Size"
        value={`₹${avgClaimAmount.toLocaleString('en-IN')}`}
        icon={IndianRupee}
        subtitle="Per filed employee claim"
      />

      <StatCard
        title="Rejection Rate"
        value={`${rejectionRate}%`}
        icon={XCircle}
        trend="-1.2% policy violations"
        trendType="down"
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
