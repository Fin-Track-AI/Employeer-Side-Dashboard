import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const RejectReasonModal = ({
  isOpen,
  onClose,
  claim,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const quickReasons = [
    'Missing official tax invoice / GST receipt',
    'Exceeds company per-diem expense policy',
    'Personal expense without business justification',
    'Receipt image is blurry or unreadable',
    'Submitted past the 30-day corporate deadline',
  ];

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a specific rejection reason for the employee.');
      return;
    }
    setError('');
    const success = onConfirmReject(claim.id, reason.trim());
    if (success !== false) {
      setReason('');
      onClose();
    }
  };

  if (!claim) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Reimbursement Claim"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger-solid" onClick={handleConfirm}>
            Confirm Rejection
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            padding: '12px 14px',
            background: 'var(--status-rejected-bg)',
            border: '1px solid var(--status-rejected-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={18} color="var(--status-rejected-text)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12.5, color: 'var(--status-rejected-text)' }}>
            You are rejecting claim <strong>{claim.id}</strong> (₹{claim.amount.toLocaleString('en-IN')}) for{' '}
            <strong>{claim.employeeName}</strong>. The employee will receive this feedback on their mobile app.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Quick Reason (Optional)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {quickReasons.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setReason(q);
                  setError('');
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: reason === q ? 'var(--color-primary-100)' : 'var(--bg-surface)',
                  color: reason === q ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                  fontSize: 11.5,
                  cursor: 'pointer',
                  fontWeight: reason === q ? 700 : 500,
                  transition: 'all 0.12s ease',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Rejection Reason <span style={{ color: 'var(--status-rejected-text)' }}>*</span>
          </label>
          <textarea
            rows={3}
            className="form-textarea"
            placeholder="Explain specifically why this claim was not approved..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
          />
          {error && <span className="form-error">{error}</span>}
        </div>
      </div>
    </Modal>
  );
};
