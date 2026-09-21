import React from 'react';
import { AnalyticsKPIs } from '../components/analytics/AnalyticsKPIs';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';

export const AnalyticsView = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Performance Metrics */}
      <AnalyticsKPIs />

      {/* Interactive Visualizations & Distributions */}
      <AnalyticsCharts />
    </div>
  );
};
