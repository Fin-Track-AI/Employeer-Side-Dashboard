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
  HelpCircle,
  Tag,
  ZoomIn,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { Modal } from '../common/Modal';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { RequestInfoModal } from './RequestInfoModal';
import { api } from '../../services/api';

export const ClaimDrawer = ({
  claim,
  isOpen,
  onClose,
  onOpenRejectModal,
}) => {
  const { approveClaim, markClaimAsPaid, requestInfoOnClaim, setSelectedEmployeeId, setCurrentView } = useApp();
  const [adminNote, setAdminNote] = useState('');
  const [showReceiptZoom, setShowReceiptZoom] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!claim) return null;

  const apiBase = api.getBaseUrl();
  const rawImgUrl = claim.receipt?.imageUrl;
  let receiptImageUrl = null;
  if (rawImgUrl) {
    receiptImageUrl = rawImgUrl.startsWith('http')
      ? rawImgUrl
      : `${apiBase.replace(/\/$/, '')}${rawImgUrl.startsWith('/') ? '' : '/'}${rawImgUrl}`;
  } else if (claim.claimId || claim.id) {
    receiptImageUrl = `${apiBase.replace(/\/$/, '')}/claims/${claim.claimId || claim.id}/receipt-image`;
  }

  const isPending = claim.status === 'Pending' || claim.status === 'Submitted' || claim.status === 'In Review';
  const isApproved = claim.status === 'Approved';
  const isRejected = claim.status === 'Rejected';
  const isPaid = claim.status === 'Paid' || claim.status === 'Reimbursed';
  const isInfoRequested = claim.status === 'Info Requested';

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

  // Lifecycle steps for BR-14 timeline
  const lifecycleSteps = [
    { label: 'Submitted', key: 'Submitted', done: true },
    { label: 'In Review', key: 'In Review', done: ['In Review', 'Approved', 'Paid', 'Reimbursed', 'Rejected', 'Info Requested'].includes(claim.status) },
    { label: 'Approved', key: 'Approved', done: ['Approved', 'Paid', 'Reimbursed'].includes(claim.status) },
    { label: 'Reimbursed', key: 'Reimbursed', done: ['Paid', 'Reimbursed'].includes(claim.status) },
  ];

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={claim.id}
        subtitle={`Submitted on ${claim.submissionDate}`}
        footer={
          <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>

            {isPending && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsRequestInfoModalOpen(true)}
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  <HelpCircle size={15} style={{ marginRight: 4 }} />
                  Request Info (BR-13)
                </Button>

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
              <Button variant="primary" icon={CheckCircle2} onClick={handleMarkPaid}>
                Mark Payment Done (Reimbursed)
              </Button>
            )}
          </div>

        }
      >
        {/* BR-14 Claim Status Lifecycle Timeline Bar */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            BR-14 Claim Status Lifecycle Timeline
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {lifecycleSteps.map((step, idx) => {
              const isCurrent =
                claim.status === step.key ||
                (step.key === 'In Review' && claim.status === 'Pending') ||
                (step.key === 'Reimbursed' && claim.status === 'Paid');

              return (
                <React.Fragment key={step.key}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: step.done
                          ? 'var(--color-primary)'
                          : isCurrent
                          ? 'var(--color-primary-100)'
                          : 'var(--bg-surface-subtle)',
                        color: step.done ? '#ffffff' : 'var(--text-muted)',
                        border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? 'var(--color-primary)' : 'var(--text-secondary)',
                        marginTop: 6,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < lifecycleSteps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 3,
                        background: lifecycleSteps[idx + 1].done ? 'var(--color-primary)' : 'var(--border-color)',
                        margin: '0 4px',
                        marginBottom: 18,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

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

        {/* Info Requested Banner */}
        {isInfoRequested && (
          <div
            style={{
              padding: '14px 16px',
              background: '#FFF7ED',
              border: '1px solid #FFEDD5',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 12,
            }}
          >
            <HelpCircle size={18} color="#EA580C" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#9A3412' }}>
                Question / Clarification Requested:
              </div>
              <div style={{ fontSize: 12.5, color: '#C2410C', marginTop: 2 }}>
                {claim.requestedInfoNote || 'Reviewer requested additional documentation.'}
              </div>
            </div>
          </div>
        )}

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

              {/* Actual Attached Bill / Receipt Image Preview */}
              {receiptImageUrl && !imgError ? (
                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    background: '#0B1120',
                    marginBottom: 12,
                  }}
                >
                  {/* Image Viewport */}
                  <div
                    style={{
                      position: 'relative',
                      maxHeight: '260px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#090D16',
                    }}
                    onClick={() => setIsImageModalOpen(true)}
                    title="Click to view full receipt image"
                  >
                    <img
                      src={receiptImageUrl}
                      alt={claim.receipt?.merchant || 'Bill Receipt'}
                      onError={() => setImgError(true)}
                      style={{
                        width: '100%',
                        maxHeight: '260px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.45)',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <ZoomIn size={18} />
                      <span>Click to Enlarge Receipt</span>
                    </div>
                  </div>

                  {/* Image Card Footer with Details & Actions */}
                  <div
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface-subtle)',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                      <ImageIcon size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {claim.receipt?.fileName || 'Bill.jpeg'}
                        </strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>
                          • {claim.receipt?.fileSize || '305 KB'} • Verified Bill Photo
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <ZoomIn size={13} />
                        Zoom
                      </button>
                      <a
                        href={receiptImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                        title="Open image in new window"
                      >
                        <ExternalLink size={13} />
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback Document File Box */
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-subtle)',
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={20} color="var(--color-primary)" />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {claim.receipt?.fileName || 'Attached_Receipt.pdf'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {claim.receipt?.fileSize || 'PDF Invoice • Stored encrypted'}
                      </div>
                    </div>
                  </div>

                  {receiptImageUrl && (
                    <a
                      href={receiptImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      title="Open file"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
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

      {/* Request Info Modal */}
      <RequestInfoModal
        isOpen={isRequestInfoModalOpen}
        onClose={() => setIsRequestInfoModalOpen(false)}
        claim={claim}
        onConfirmRequestInfo={(claimId, question) => {
          requestInfoOnClaim(claimId, question);
          onClose();
        }}
      />

      {/* Fullscreen / High-Res Receipt Image Zoom Modal */}
      {isImageModalOpen && receiptImageUrl && (
        <Modal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          title={`Bill Attachment — ${claim.receipt?.merchant || claim.title} (${claim.receipt?.fileName || 'Bill.jpeg'})`}
          maxWidth="900px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Billed Amount: <strong>₹{claim.amount?.toLocaleString('en-IN')}</strong> • Date: {claim.receipt?.date || claim.expenseDate}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={receiptImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                >
                  <ExternalLink size={14} />
                  Open in New Tab
                </a>
                <Button variant="secondary" onClick={() => setIsImageModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#090D16',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              maxHeight: '75vh',
              overflow: 'auto',
            }}
          >
            <img
              src={receiptImageUrl}
              alt={claim.receipt?.merchant || 'Receipt Full View'}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '4px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

