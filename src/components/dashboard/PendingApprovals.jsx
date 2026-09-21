import React from 'react';
import { Check, X, Eye, Receipt, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export const PendingApprovals = ({ onOpenClaim, onRejectClaim }) => {
  const { pendingClaims, approveClaim, setCurrentView } = useApp();

  const recentPending = pendingClaims.slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Receipt size={18} color="var(--color-primary)" />
          Pending Approvals
          <span className="badge badge-pending" style={{ marginLeft: 6 }}>
            {pendingClaims.length} Action Required
          </span>
        </div>
        {pendingClaims.length > 5 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentView('claims')}
          >
            View all ({pendingClaims.length})
            <ArrowRight size={14} />
          </Button>
        )}
      </div>

      {recentPending.length === 0 ? (
        <EmptyState
          title="All caught up!"
          description="There are currently no reimbursement claims awaiting your review."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-responsive desktop-table-view">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>Claim Details</th>
                  <th>Amount</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPending.map((claim) => (
                  <tr key={claim.id}>
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
                      <CategoryBadge category={claim.category} />
                    </td>

                    <td>
                      <div style={{ maxWidth: 220 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {claim.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {claim.project || claim.id}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="amount-cell">₹{(claim.amount || 0).toLocaleString('en-IN')}</span>
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          className="icon-btn"
                          onClick={() => onOpenClaim(claim)}
                          title="View Details & Receipt"
                        >
                          <Eye size={15} />
                        </button>
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
                          onClick={() => onRejectClaim(claim)}
                          title="Reject with Reason"
                          style={{ color: 'var(--status-rejected-text)' }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="mobile-card-list" style={{ padding: 12 }}>
            {recentPending.map((claim) => (
              <div key={claim.id} className="mobile-data-card">
                <div className="mobile-card-header">
                  <div className="user-cell">
                    <div className="avatar-initials">{claim.employeeAvatar}</div>
                    <div className="user-cell-meta">
                      <span className="user-cell-name">{claim.employeeName}</span>
                      <span className="user-cell-sub">{claim.department}</span>
                    </div>
                  </div>
                  <span className="amount-cell">₹{(claim.amount || 0).toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{claim.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <CategoryBadge category={claim.category} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{claim.submissionDate}</span>
                  </div>
                </div>

                <div className="mobile-card-actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onOpenClaim(claim)}
                    style={{ flex: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => approveClaim(claim.id)}
                    style={{ flex: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onRejectClaim(claim)}
                    style={{ flex: 1 }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
