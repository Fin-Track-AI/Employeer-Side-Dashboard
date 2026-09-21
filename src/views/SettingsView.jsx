import React from 'react';
import { CompanySettings, PolicySettings } from '../components/settings/CompanySettings';
import { AdminTeamSettings } from '../components/settings/AdminTeamSettings';
import { Button } from '../components/common/Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView = () => {
  const { admin, resetDemoData } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Company Identity */}
      <CompanySettings />

      {/* Admin Profile Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Logged In Admin Profile
          </div>
          <span className="badge badge-approved">Active Session</span>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div
              className="avatar-initials"
              style={{ width: 48, height: 48, fontSize: 16, background: '#FED7AA', color: '#9A3412' }}
            >
              {admin.avatar || 'RJ'}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                {admin.name}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                {admin.role} • {admin.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Admin Name</label>
              <input type="text" className="form-input" defaultValue={admin.name} readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Corporate Email</label>
              <input type="text" className="form-input" defaultValue={admin.email} readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Mobile</label>
              <input type="text" className="form-input" defaultValue={admin.phone} readOnly />
            </div>

            <div className="form-group">
              <label className="form-label">Designated Authority</label>
              <input type="text" className="form-input" defaultValue={admin.role} readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Reimbursement Policy Rules */}
      <PolicySettings />

      {/* Admin Team Members & Roles */}
      <AdminTeamSettings />

      {/* System Governance & Demo Reset */}
      <div className="card" style={{ border: '1px dashed var(--border-color)' }}>
        <div className="card-header">
          <div className="card-title" style={{ color: 'var(--status-rejected-text)' }}>
            <AlertTriangle size={18} />
            Data Management & System Reset
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              Restore Default TechCorp Solutions Dataset
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Reset all local approvals, newly enrolled employees, and modified budget limits to default demo state.
            </div>
          </div>

          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data back to the default demo state?')) {
                resetDemoData();
              }
            }}
          >
            Reset Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
};
