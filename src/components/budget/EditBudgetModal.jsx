import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const EditBudgetModal = ({
  isOpen,
  onClose,
  currentBudget,
  onSaveBudget,
}) => {
  const [monthlyBudget, setMonthlyBudget] = useState(
    currentBudget?.monthlyBudget?.toString() || '250000'
  );
  const [annualBudget, setAnnualBudget] = useState(
    currentBudget?.annualBudget?.toString() || '1800000'
  );
  const [categories, setCategories] = useState(
    currentBudget?.categories || []
  );

  const [step, setStep] = useState('edit'); // 'edit' | 'confirm'
  const [error, setError] = useState('');

  const handleCategoryLimitChange = (index, newLimit) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], limit: Number(newLimit) || 0 };
    setCategories(updated);
  };

  const handleProceedToConfirm = () => {
    const monthlyNum = Number(monthlyBudget);
    const annualNum = Number(annualBudget);

    if (!monthlyNum || monthlyNum <= 0) {
      setError('Please provide a valid positive monthly budget.');
      return;
    }
    if (!annualNum || annualNum <= 0) {
      setError('Please provide a valid annual budget.');
      return;
    }

    setError('');
    setStep('confirm');
  };

  const handleFinalSave = () => {
    onSaveBudget({
      monthlyBudget: Number(monthlyBudget),
      annualBudget: Number(annualBudget),
      categories,
    });
    setStep('edit');
    onClose();
  };

  const handleClose = () => {
    setStep('edit');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'edit' ? 'Configure Corporate Budget' : 'Confirm Budget Revision'}
      footer={
        step === 'edit' ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProceedToConfirm}>
              Review & Confirm
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setStep('edit')}>
              Back to Edit
            </Button>
            <Button variant="primary" onClick={handleFinalSave}>
              Confirm & Apply Changes
            </Button>
          </>
        )
      }
    >
      {step === 'edit' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Monthly Corporate Cap (₹)</label>
              <input
                type="number"
                className="form-input"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Annual Allocation (₹)</label>
              <input
                type="number"
                className="form-input"
                value={annualBudget}
                onChange={(e) => setAnnualBudget(e.target.value)}
              />
            </div>
          </div>

          {error && <span className="form-error">{error}</span>}

          {/* Category-Specific Caps */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
              Category Specific Monthly Caps
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map((cat, idx) => (
                <div
                  key={cat.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                    {cat.name}
                  </span>
                  <div style={{ width: 140 }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ padding: '6px 10px', fontSize: 13 }}
                      value={cat.limit}
                      onChange={(e) => handleCategoryLimitChange(idx, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Confirmation Step */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              padding: '14px',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={20} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--color-primary-900)' }}>
                Please review changes carefully
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-primary-900)', marginTop: 2 }}>
                Updating the monthly budget will immediately alter department limits and trigger automated alerts if spending approaches thresholds.
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-secondary)' }}>New Monthly Budget:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)' }}>
                ₹{Number(monthlyBudget).toLocaleString('en-IN')}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-secondary)' }}>New Annual Allocation:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)' }}>
                ₹{Number(annualBudget).toLocaleString('en-IN')}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Categories Tuned:</span>
              <strong>{categories.length} categories</strong>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
