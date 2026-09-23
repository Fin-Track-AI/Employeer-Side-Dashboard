import React, { useState } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  Building2,
  Sparkles,
  Share2,
  RefreshCw,
  Layers,
  IndianRupee,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const AddEmployeeModal = ({
  isOpen,
  onClose,
}) => {
  const { company, generateInviteCode } = useApp();
  const { addToast } = useToast();

  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Senior Software Engineer');
  const [monthlyAllowance, setMonthlyAllowance] = useState('25000');
  const [employeeName, setEmployeeName] = useState('');

  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const departments = [
    'Engineering',
    'Product & Design',
    'Sales & BD',
    'Marketing',
    'Finance & Legal',
    'HR & People',
    'Operations & Supply',
  ];

  const allowancePresets = [15000, 25000, 35000, 50000];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!monthlyAllowance || Number(monthlyAllowance) <= 0) {
      addToast({
        title: 'Valid Allowance Required',
        message: 'Please enter a valid monthly allowance in INR',
        type: 'warning',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const invite = await generateInviteCode({
        department,
        role: role.trim() || 'Team Member',
        monthlyAllowance: Number(monthlyAllowance),
      });
      setGeneratedInvite(invite);
    } catch {
      // Toast handled in context
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedInvite?.code) return;
    navigator.clipboard.writeText(generatedInvite.code);
    setCopied(true);
    addToast({
      title: 'Code Copied to Clipboard',
      message: `Invite code ${generatedInvite.code} copied!`,
      type: 'info',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!generatedInvite?.code) return;
    const text = encodeURIComponent(
      `Hello! You have been invited to join ${company?.name || 'FinTrack Enterprise'}.\n\n` +
      `Your Unique Enrollment Code is: *${generatedInvite.code}*\n` +
      `Department: ${generatedInvite.department}\n` +
      `Monthly Expense Allowance: ₹${Number(generatedInvite.monthlyAllowance).toLocaleString()}\n\n` +
      `To join, open the FinTrack mobile app -> Go to Claims -> Tap "Enter Company Code" and enter your code.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleResetModal = () => {
    setGeneratedInvite(null);
    setEmployeeName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetModal}
      title={generatedInvite ? 'Employee Invite Code Created' : 'Invite Employee & Generate Code'}
      footer={
        <>
          <Button variant="secondary" onClick={handleResetModal}>
            {generatedInvite ? 'Close' : 'Cancel'}
          </Button>
          {!generatedInvite ? (
            <Button
              variant="primary"
              icon={KeyRound}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Code...' : 'Generate Invite Code'}
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={Copy}
              onClick={handleCopyCode}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          )}
        </>
      }
    >
      {!generatedInvite ? (
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Org Header Note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              background: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-100)',
            }}
          >
            <Building2 size={20} color="var(--color-primary)" />
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
              Inviting to <strong>{company?.name || 'FinTrack Enterprise'}</strong>.
              Employees will link via their mobile app using this unique code.
            </div>
          </div>

          {/* Department Selection */}
          <div className="form-group">
            <label className="form-label">
              Department <span style={{ color: 'var(--status-rejected-text)' }}>*</span>
            </label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Role / Designation */}
          <div className="form-group">
            <label className="form-label">Role / Designation</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior Backend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Monthly Allowance Limit */}
          <div className="form-group">
            <label className="form-label">
              Monthly Expense Allowance (₹) <span style={{ color: 'var(--status-rejected-text)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                className="form-input"
                placeholder="25000"
                value={monthlyAllowance}
                onChange={(e) => setMonthlyAllowance(e.target.value)}
                style={{ paddingLeft: 30 }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                ₹
              </span>
            </div>

            {/* Allowance Preset Pills */}
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {allowancePresets.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setMonthlyAllowance(amt.toString())}
                  style={{
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: Number(monthlyAllowance) === amt ? 'var(--color-primary-100)' : 'var(--bg-surface)',
                    color: Number(monthlyAllowance) === amt ? 'var(--color-primary-900)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Reference Employee Name */}
          <div className="form-group">
            <label className="form-label">Target Employee Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Aniket Sharma"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Used for your internal reference. The employee's real account name will be verified when claimed.
            </span>
          </div>
        </form>
      ) : (
        /* CODE GENERATED VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              padding: '24px 20px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              borderRadius: 'var(--radius-lg)',
              color: '#FFFFFF',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Official Employee Invite Code
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: 4,
                color: 'var(--color-primary)',
                margin: '12px 0',
                fontFamily: 'monospace',
              }}
            >
              {generatedInvite.code}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 12, color: '#E2E8F0' }}>
              <span>🏢 {generatedInvite.department}</span>
              <span>•</span>
              <span>💰 ₹{Number(generatedInvite.monthlyAllowance).toLocaleString()}/mo</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 14px',
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
              {copied ? 'Copied Code!' : 'Copy Code'}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 14px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                fontWeight: 600,
                color: '#047857',
                cursor: 'pointer',
              }}
            >
              <Share2 size={16} /> Share via WhatsApp
            </button>
          </div>

          {/* Joining Instructions Note */}
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong>How the employee joins:</strong>
            <ol style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Open the FinTrack Mobile App.</li>
              <li>Go to the <strong>Claims / Reimbursement</strong> tab.</li>
              <li>Tap <strong>"Enter Company Invite Code"</strong> and paste <code>{generatedInvite.code}</code>.</li>
              <li>They will automatically join <strong>{company?.name}</strong> and can immediately submit receipt claims!</li>
            </ol>
          </div>
        </div>
      )}
    </Modal>
  );
};
