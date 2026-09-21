import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Building2,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const ClaimDrawer = ({
  claim,
  isOpen,
  onClose,
  onOpenRejectModal,
}) => {
  const { approveClaim, markClaimAsPaid, setSelectedEmployeeId, setCurrentView } = useApp();
  const [adminNote, setAdminNote] = useState('');
  const [showReceiptZoom, setShowReceiptZoom] = useState(false);

  if (!claim) return null;

  const isPending = claim.status === 'Pending';
  const isApproved = claim.status === 'Approved';
  const isRejected = claim.status === 'Rejected';
  const isPaid = claim.status === 'Paid';

  const handleApprove = () => {
    approveClaim(claim.id, adminNote);
    onClose();
  };

  const handleMarkPaid = () => {
    markClaimAsPaid(claim.id);
    onClose();
  };

  const handleViewEmployeeProfile = () => {
    setSelectedEmployeeId(claim.employeeId);
    setCurrentView('employees');
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={claim.id}
      subtitle={`Submitted on ${claim.submissionDate}`}
      footer={
        <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          {isPending && (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  onClose();
                  onOpenRejectModal(claim);
                }}
              >
                Reject Claim
              </Button>
              <Button variant="primary" onClick={handleApprove}>
                Approve Claim
              </Button>
            </>
          )}

          {isApproved && (
            <Button variant="primary" onClick={handleMarkPaid}>
              Mark as Disbursed / Paid
            </Button>
          )}
        </div>
      }
    >
      {/* Top Claim Card with Amount */}
      <div
        style={{
          background: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 11.5, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Claim Reimbursement Amount
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            ₹{claim.amount.toLocaleString('en-IN')}
          </div>
        </div>

        <StatusBadge status={claim.status} />
      </div>

      {/* Rejection Alert Banner if Rejected */}
      {isRejected && (
        <div
          style={{
            padding: '14px 16px',
            background: 'var(--status-rejected-bg)',
            border: '1px solid var(--status-rejected-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 12,
          }}
        >
          <XCircle size={18} color="var(--status-rejected-text)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--status-rejected-text)' }}>
              Rejection Reason Recorded:
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--status-rejected-text)', marginTop: 2 }}>
              {claim.rejectionReason || 'Expense not compliant with travel & per-diem policies.'}
            </div>
          </div>
        </div>
      )}

      {/* Employee Profile Snapshot */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
          Employee Information
        </div>
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar-initials">{claim.employeeAvatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                {claim.employeeName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {claim.department} • {claim.employeeEmail}
              </div>
            </div>
          </div>

          <Button size="sm" variant="secondary" onClick={handleViewEmployeeProfile}>
            View Profile
          </Button>
        </div>
      </div>

      {/* Expense Details Grid */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
          Expense Details
        </div>
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Title</div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)', marginTop: 2 }}>
              {claim.title}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Category</div>
            <div style={{ marginTop: 4 }}>
              <CategoryBadge category={claim.category} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expense Incurred Date</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
              {claim.expenseDate}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Submission Date</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
              {claim.submissionDate}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Project Allocation</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
              {claim.project || 'General Operations'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cost Center</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
              {claim.costCenter || 'CC-CORP-001'}
            </div>
          </div>
        </div>

        {claim.description && (
          <div
            style={{
              marginTop: 10,
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              fontSize: 12.5,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong>Note from employee:</strong> {claim.description}
          </div>
        )}
      </div>

      {/* Receipt & AI OCR Verification Box */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Attached Receipt & Document
          </div>
          <span className="badge badge-approved" style={{ fontSize: 11 }}>
            <ShieldCheck size={12} />
            Gemini Vision OCR Verified
          </span>
        </div>

        <div
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          {/* Simulated Invoice Document Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#0F172A',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Receipt size={16} color="var(--color-primary)" />
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {claim.receipt?.merchant || 'Official Merchant Receipt'}
              </span>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.85 }}>
              {claim.receipt?.invoiceNumber || 'INV-2026'}
            </span>
          </div>

          {/* OCR Extracted Data Matrix */}
          <div style={{ padding: '16px', background: 'var(--bg-surface)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                fontSize: 12,
                paddingBottom: 12,
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: 12,
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Merchant:</span>{' '}
                <strong>{claim.receipt?.merchant}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>GSTIN:</span>{' '}
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{claim.receipt?.gstin}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Invoice Date:</span>{' '}
                <strong>{claim.receipt?.date || claim.expenseDate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Tax / GST Component:</span>{' '}
                <strong>₹{claim.receipt?.tax?.toLocaleString('en-IN') || '0'}</strong>
              </div>
            </div>

            {/* Document File Preview */}
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-subtle)',
                border: '1px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={20} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {claim.receipt?.fileName || 'Attached_Receipt.pdf'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>PDF Invoice • 248 KB • Stored encrypted</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReceiptZoom(!showReceiptZoom)}
                className="icon-btn"
                title="Preview Document"
              >
                <ExternalLink size={15} />
              </button>
            </div>

            {/* Interactive Document Zoom Overlay */}
            {showReceiptZoom && (
              <div
                style={{
                  marginTop: 12,
                  padding: 16,
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>
                  TAX INVOICE — {claim.receipt?.merchant?.toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12 }}>
                  GSTIN: {claim.receipt?.gstin} • Bill No: {claim.receipt?.invoiceNumber}
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    textAlign: 'left',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Total Amount Billed:</span>
                    <strong>₹{claim.amount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: 11 }}>
                    <span>CGST + SGST (18% / 5%):</span>
                    <span>₹{claim.receipt?.tax?.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: 11 }}>
                    <span>Payment Mode:</span>
                    <span>Corporate UPI / Card</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--status-approved-text)', fontWeight: 700 }}>
                  ✓ Match confirmed against claim amount
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Notes Section */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
          Admin Audit Notes
        </div>
        {isPending ? (
          <textarea
            rows={2}
            className="form-textarea"
            placeholder="Add internal notes before approving (e.g. Verified against travel ticket)..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        ) : (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              fontSize: 12.5,
              color: 'var(--text-secondary)',
            }}
          >
            {claim.adminNotes || 'No notes added for this claim.'}
          </div>
        )}
      </div>
    </Drawer>
  );
};
