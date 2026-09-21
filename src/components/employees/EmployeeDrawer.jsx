import React from 'react';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Wallet,
  Receipt,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const EmployeeDrawer = ({
  employee,
  isOpen,
  onClose,
  onSelectClaim,
}) => {
  const { claims } = useApp();

  if (!employee) return null;

  const empClaims = claims.filter((c) => c.employeeId === employee.id);
  const pendingCount = empClaims.filter((c) => c.status === 'Pending').length;
  const approvedCount = empClaims.filter((c) => c.status === 'Approved' || c.status === 'Paid').length;

  const allowance = employee.monthlyAllowance || 25000;
  const utilizedPercent = Math.min(100, Math.round((employee.totalReimbursed / (allowance * 3)) * 100));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={employee.name}
      subtitle={`${employee.role} • ${employee.department}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Profile
        </Button>
      }
    >
      {/* Top Profile Header Card */}
      <div
        style={{
          background: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          className="avatar-initials"
          style={{ width: 52, height: 52, fontSize: 18 }}
        >
          {employee.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
              {employee.name}
            </span>
            <span
              className={`badge ${employee.status === 'Active' ? 'badge-approved' : 'badge-neutral'}`}
              style={{ fontSize: 11 }}
            >
              <span className="badge-dot" />
              {employee.status}
            </span>
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {employee.role} • {employee.department}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            ID: {employee.id}
          </div>
        </div>
      </div>

      {/* Contact & Meta Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          fontSize: 12.5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mail size={16} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{employee.email}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Phone size={16} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-primary)' }}>{employee.phone}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={16} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-primary)' }}>{employee.department}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-primary)' }}>Joined {employee.joinedDate}</span>
        </div>
      </div>

      {/* Reimbursement Allowance & Cap */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ fontSize: 13 }}>
            <Wallet size={16} color="var(--color-primary)" />
            Reimbursement Allowance & Status
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Reimbursed to Date
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                ₹{employee.totalReimbursed.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Monthly Policy Allowance
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                ₹{allowance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                {empClaims.length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Claims Filed</div>
            </div>

            <div
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--status-pending-bg)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--status-pending-text)' }}>
                {pendingCount}
              </div>
              <div style={{ fontSize: 11, color: 'var(--status-pending-text)' }}>Pending</div>
            </div>

            <div
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--status-approved-bg)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--status-approved-text)' }}>
                {approvedCount}
              </div>
              <div style={{ fontSize: 11, color: 'var(--status-approved-text)' }}>Approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reimbursement Claims History */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
          Recent Claims by {employee.name.split(' ')[0]} ({empClaims.length})
        </div>

        {empClaims.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 12.5,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)',
            }}
          >
            No reimbursement claims filed yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {empClaims.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onClose();
                  onSelectClaim(c);
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <CategoryBadge category={c.category} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.expenseDate}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="amount-cell">₹{c.amount.toLocaleString('en-IN')}</span>
                  <StatusBadge status={c.status} />
                  <ExternalLink size={14} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};
