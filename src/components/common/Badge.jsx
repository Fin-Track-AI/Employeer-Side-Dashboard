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

  if (normStatus === 'pending') {
    return (
      <span className="badge badge-pending">
        <span className="badge-dot" />
        Pending Review
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

  if (normStatus === 'paid') {
    return (
      <span className="badge badge-paid">
        <span className="badge-dot" />
        Paid / Reimbursed
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
