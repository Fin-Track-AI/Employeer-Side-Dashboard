import React, { useState } from 'react';
import { Users, KeyRound, Copy, Check, Clock, CheckCircle2, UserCheck, Plus } from 'lucide-react';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const EmployeesView = ({ onOpenEmployee, onOpenAddEmployee }) => {
  const { employees, inviteCodes } = useApp();
  const { addToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('employees'); // 'employees' | 'invites'
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast({
      title: 'Code Copied',
      message: `Invite code ${code} copied to clipboard`,
      type: 'info',
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Sub-Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
          padding: '10px 16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('employees')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeSubTab === 'employees' ? 'var(--color-primary-100)' : 'transparent',
              color: activeSubTab === 'employees' ? 'var(--color-primary-900)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'employees' ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Users size={16} />
            <span>Enrolled Employees</span>
            <span
              style={{
                background: activeSubTab === 'employees' ? 'var(--color-primary-200)' : 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                fontSize: 11,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {employees.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('invites')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeSubTab === 'invites' ? 'var(--color-primary-100)' : 'transparent',
              color: activeSubTab === 'invites' ? 'var(--color-primary-900)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'invites' ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <KeyRound size={16} />
            <span>Invite Codes & Enrollment Tracker</span>
            <span
              style={{
                background: activeSubTab === 'invites' ? 'var(--color-primary-200)' : 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                fontSize: 11,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {inviteCodes.length}
            </span>
          </button>
        </div>

        <Button
          variant="primary"
          icon={KeyRound}
          onClick={onOpenAddEmployee}
          size="sm"
        >
          Generate Invite Code
        </Button>
      </div>

      {/* View Content */}
      {activeSubTab === 'employees' ? (
        <EmployeeTable
          employees={employees}
          onOpenEmployee={onOpenEmployee}
          onOpenAddModal={onOpenAddEmployee}
        />
      ) : (
        /* Invite Codes Tracker Table */
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Active & Claimed Organization Invite Codes
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Employees must input these codes in their FinTrack mobile app to unlock corporate reimbursement claims.
              </div>
            </div>
          </div>

          {inviteCodes.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <KeyRound size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                No Invite Codes Generated Yet
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, marginBottom: 16 }}>
                Generate your first unique code to invite and onboard employees to your corporate policy.
              </div>
              <Button variant="primary" icon={Plus} onClick={onOpenAddEmployee} size="sm">
                Generate First Invite Code
              </Button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Invite Code</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Department</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Allowance</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Claimed By</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inviteCodes.map((inv) => {
                    const isClaimed = inv.status === 'CLAIMED';
                    return (
                      <tr
                        key={inv.code || inv.id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', fontSize: 14, color: 'var(--color-primary)' }}>
                          {inv.code}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {inv.department}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          ₹{Number(inv.monthlyAllowance || 25000).toLocaleString()}/mo
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: 11,
                              fontWeight: 700,
                              background: isClaimed ? '#ECFDF5' : 'var(--color-primary-50)',
                              color: isClaimed ? '#047857' : 'var(--color-primary-900)',
                              border: `1px solid ${isClaimed ? '#A7F3D0' : 'var(--color-primary-200)'}`,
                            }}
                          >
                            {isClaimed ? <UserCheck size={12} /> : <Clock size={12} />}
                            {isClaimed ? 'Claimed' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                          {isClaimed && inv.claimedBy ? (
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inv.claimedBy.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inv.claimedBy.email || 'Joined via Mobile'}</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Awaiting Employee Entry</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            type="button"
                            onClick={() => handleCopy(inv.code)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '4px 8px',
                              background: 'var(--bg-surface-subtle)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {copiedCode === inv.code ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                            {copiedCode === inv.code ? 'Copied' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
