import React from 'react';
import { Eye, Check, X } from 'lucide-react';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const ClaimTable = ({
  claims,
  onOpenClaim,
  onOpenRejectModal,
}) => {
  const { approveClaim } = useApp();

  return (
    <div className="card desktop-table-view">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Claim Title / ID</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Expense Date</th>
              <th>Submitted</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => {
              const isPending = claim.status === 'Pending';

              return (
                <tr
                  key={claim.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onOpenClaim(claim)}
                >
                  <td>
                    <div className="user-cell">
                      <div className="avatar-initials">{claim.employeeAvatar}</div>
                      <div className="user-cell-meta">
                        <span className="user-cell-name">{claim.employeeName}</span>
                        <span className="user-cell-sub">{claim.department}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ maxWidth: 220 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {claim.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {claim.project ? `${claim.id} • ${claim.project}` : claim.id}
                      </div>
                    </div>
                  </td>

                  <td>
                    <CategoryBadge category={claim.category} />
                  </td>

                  <td>
                    <span className="amount-cell">₹{(claim.amount || 0).toLocaleString('en-IN')}</span>
                  </td>

                  <td>
                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {claim.expenseDate}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {claim.submissionDate}
                    </span>
                  </td>

                  <td>
                    <StatusBadge status={claim.status} />
                  </td>

                  <td>
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="icon-btn"
                        onClick={() => onOpenClaim(claim)}
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>

                      {isPending && (
                        <>
                          <button
                            className="icon-btn"
                            onClick={() => approveClaim(claim.id)}
                            title="Quick Approve"
                            style={{ color: 'var(--status-approved-text)' }}
                          >
                            <Check size={15} />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => onOpenRejectModal(claim)}
                            title="Reject Claim"
                            style={{ color: 'var(--status-rejected-text)' }}
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
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
