import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const RequestInfoModal = ({
  isOpen,
  onClose,
  claim,
  onConfirmRequestInfo,
}) => {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const quickQuestions = [
    'Please upload a clearer image of the tax invoice / GST bill.',
    'Please attach itemized break-up for this expense.',
    'Clarify business purpose or client meeting attendees.',
    'Provide pre-approval email or travel ticket verification.',
  ];

  const handleConfirm = () => {
    if (!question.trim()) {
      setError('Please provide specific questions or clarification instructions for the employee.');
      return;
    }
    setError('');
    const success = onConfirmRequestInfo(claim.id, question.trim());
    if (success !== false) {
      setQuestion('');
      onClose();
    }
  };

  if (!claim) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Additional Information (BR-13)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Send Question to Employee
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            padding: '12px 14px',
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <HelpCircle size={18} color="var(--color-primary-600)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12.5, color: 'var(--color-primary-700)' }}>
            You are requesting more information for claim <strong>{claim.id}</strong> (₹
            {claim.amount?.toLocaleString('en-IN')}) from <strong>{claim.employeeName}</strong>. The claim status will update to <strong>Info Requested</strong>.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Quick Request Template</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  setError('');
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: question === q ? 'var(--color-primary-100)' : 'var(--bg-surface)',
                  color: question === q ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                  fontSize: 11.5,
                  cursor: 'pointer',
                  fontWeight: question === q ? 700 : 500,
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
            Specific Question / Missing Info Description <span style={{ color: 'var(--color-primary)' }}>*</span>
          </label>
          <textarea
            rows={3}
            className="form-textarea"
            placeholder="State clearly what information or updated document the employee needs to provide..."
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError('');
            }}
          />
          {error && <span className="form-error">{error}</span>}
        </div>
      </div>
    </Modal>
  );
};
