import React, { useState } from 'react';
import { Building2, ShieldCheck, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export const CompanySettings = () => {
  const { company } = useApp();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(company.code);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Company Code Copied',
      message: `Share "${company.code}" with employees to link their mobile app.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Building2 size={18} color="var(--color-primary)" />
          Company Information & Employer Identity
        </div>
        <span className="badge badge-approved">
          <ShieldCheck size={12} />
          GST & CIN Verified
        </span>
      </div>

      <div className="card-body">
        <div
          style={{
            padding: '16px',
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary-900)', textTransform: 'uppercase' }}>
              Employee Onboarding Company Code
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {company.code}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-primary-900)', marginTop: 2 }}>
              Employees enter this code in the FinTrack mobile app to link expenses directly to your dashboard.
            </div>
          </div>

          <Button size="sm" variant="secondary" onClick={handleCopyCode}>
            {copied ? <Check size={14} color="var(--status-approved-text)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Code'}
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Registered Legal Entity Name</label>
            <input type="text" className="form-input" defaultValue={company.name} readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">GSTIN (India GST Registration)</label>
            <input type="text" className="form-input" defaultValue={company.gstin} readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Corporate Identification Number (CIN)</label>
            <input type="text" className="form-input" defaultValue={company.cin} readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Authorized Domain</label>
            <input type="text" className="form-input" defaultValue={company.domain} readOnly />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 8 }}>
          <label className="form-label">Registered Headquarters Address</label>
          <input type="text" className="form-input" defaultValue={company.address} readOnly />
        </div>
      </div>
    </div>
  );
};

export const PolicySettings = () => {
  const { policySettings, updatePolicySettings } = useApp();
  const [formData, setFormData] = useState(policySettings);

  const handleSave = (e) => {
    e.preventDefault();
    updatePolicySettings(formData);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          Reimbursement Policy & Auto-Approval Controls
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Receipt-less Threshold (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.maxReceiptlessAmount}
                onChange={(e) =>
                  setFormData({ ...formData, maxReceiptlessAmount: Number(e.target.value) })
                }
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Expenses below this amount do not strictly require a tax invoice receipt.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Claim Submission Window (Days)</label>
              <input
                type="number"
                className="form-input"
                value={formData.submissionWindowDays}
                onChange={(e) =>
                  setFormData({ ...formData, submissionWindowDays: Number(e.target.value) })
                }
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Days after transaction date within which employee must file.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Auto-Approval Cap (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.autoApprovalThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, autoApprovalThreshold: Number(e.target.value) })
                }
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Claims under this amount with valid OCR match can auto-clear.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="submit" variant="primary">
              Save Policy Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
