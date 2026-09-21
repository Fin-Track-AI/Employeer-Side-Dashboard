import React from 'react';

export const StatusBadge = ({ status }) => {
  const normStatus = (status || '').toLowerCase();

  if (normStatus === 'approved') {
    return (
      <span className="badge badge-approved">
        <span className="badge-dot" />
        Approved
      </span>
    );
  }

  if (normStatus === 'pending' || normStatus === 'submitted' || normStatus === 'in review') {
    return (
      <span className="badge badge-pending">
        <span className="badge-dot" />
        {normStatus === 'in review' ? 'In Review' : normStatus === 'submitted' ? 'Submitted' : 'Pending Review'}
      </span>
    );
  }

  if (normStatus === 'info requested' || normStatus === 'action required') {
    return (
      <span className="badge badge-pending" style={{ background: '#FFF7ED', color: '#C2410C', borderColor: '#FFEDD5' }}>
        <span className="badge-dot" style={{ background: '#EA580C' }} />
        Info Requested
      </span>
    );
  }

  if (normStatus === 'rejected') {
    return (
      <span className="badge badge-rejected">
        <span className="badge-dot" />
        Rejected
      </span>
    );
  }

  if (normStatus === 'paid' || normStatus === 'reimbursed') {
    return (
      <span className="badge badge-paid">
        <span className="badge-dot" />
        Reimbursed
      </span>
    );
  }

  return (
    <span className="badge badge-neutral">
      <span className="badge-dot" />
      {status || 'Unknown'}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  return <span className="badge badge-category">{category}</span>;
};
