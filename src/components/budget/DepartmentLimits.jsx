import React from 'react';
import { Building2 } from 'lucide-react';

export const DepartmentLimits = ({ departments = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Building2 size={18} color="var(--color-primary)" />
          Department Quotas & Utilization
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Assigned Budgets
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Team Size</th>
              <th>Allocated Limit</th>
              <th>Spent This Month</th>
              <th>Remaining</th>
              <th>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => {
              const spent = dept.spent || 0;
              const limit = dept.limit || 1;
              const remaining = Math.max(0, limit - spent);
              const percent = Math.min(100, Math.round((spent / limit) * 100));

              return (
                <tr key={dept.name}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {dept.name}
                    </span>
                  </td>

                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {dept.employeesCount} employees
                    </span>
                  </td>

                  <td>
                    <span className="amount-cell">₹{limit.toLocaleString('en-IN')}</span>
                  </td>

                  <td>
                    <span className="amount-cell" style={{ color: 'var(--color-primary)' }}>
                      ₹{spent.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td>
                    <span className="amount-cell" style={{ color: 'var(--status-approved-text)' }}>
                      ₹{remaining.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 80,
                          height: 6,
                          background: 'var(--bg-surface-subtle)',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: '100%',
                            background:
                              percent >= 90
                                ? 'var(--status-rejected-dot)'
                                : percent >= 75
                                ? 'var(--status-pending-dot)'
                                : 'var(--status-approved-dot)',
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {percent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
