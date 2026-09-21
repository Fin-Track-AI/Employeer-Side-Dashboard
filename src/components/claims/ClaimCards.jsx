import React from 'react';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const ClaimCards = ({
  claims,
  onOpenClaim,
  onOpenRejectModal,
}) => {
  const { approveClaim } = useApp();

  return (
    <div className="mobile-card-list">
      {claims.map((claim) => {
        const isPending = claim.status === 'Pending';

        return (
          <div
            key={claim.id}
            className="mobile-data-card"
            onClick={() => onOpenClaim(claim)}
            style={{ cursor: 'pointer' }}
          >
            <div className="mobile-card-header">
              <div className="user-cell">
                <div className="avatar-initials">{claim.employeeAvatar}</div>
                <div className="user-cell-meta">
                  <span className="user-cell-name">{claim.employeeName}</span>
                  <span className="user-cell-sub">{claim.department}</span>
                </div>
              </div>
              <StatusBadge status={claim.status} />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)', marginBottom: 2 }}>
                {claim.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {claim.project ? `${claim.id} • ${claim.project}` : claim.id}
              </div>
            </div>

            <div className="mobile-card-row">
              <CategoryBadge category={claim.category} />
              <span className="amount-cell" style={{ fontSize: 16 }}>
                ₹{(claim.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mobile-card-row" style={{ fontSize: 11.5 }}>
              <span>Submitted: {claim.submissionDate}</span>
              <span>Incurred: {claim.expenseDate}</span>
            </div>

            {isPending && (
              <div
                className="mobile-card-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onOpenClaim(claim)}
                  style={{ flex: 1 }}
                >
                  Details
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
                  onClick={() => onOpenRejectModal(claim)}
                  style={{ flex: 1 }}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
