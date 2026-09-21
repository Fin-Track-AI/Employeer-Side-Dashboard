import React, { useState } from 'react';
import {
  Menu,
  Bell,
  UserPlus,
  RotateCcw,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SearchInput } from '../common/SearchInput';
import { Button } from '../common/Button';

export const Header = ({ onOpenAddEmployee }) => {
  const {
    currentView,
    globalSearch,
    setGlobalSearch,
    pendingClaims,
    company,
    setIsMobileMenuOpen,
    resetDemoData,
    setCurrentView,
    setSelectedClaimId,
    isBackendConnected,
    loadingClaims,
    lastSyncTime,
    fetchRealClaims,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const getPageMeta = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Executive Overview', breadcrumb: `${company.name} / Dashboard` };
      case 'claims':
        return { title: 'Reimbursement Claims', breadcrumb: `${company.name} / Claims Review` };
      case 'employees':
        return { title: 'Employee Directory', breadcrumb: `${company.name} / Employees` };
      case 'budget':
        return { title: 'Budget & Spending Limits', breadcrumb: `${company.name} / Budget` };
      case 'analytics':
        return { title: 'Expense Intelligence', breadcrumb: `${company.name} / Analytics` };
      case 'settings':
        return { title: 'Company Settings & Policy', breadcrumb: `${company.name} / Settings` };
      default:
        return { title: 'Dashboard', breadcrumb: company.name };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-title-group">
          <h1 className="header-page-title">{meta.title}</h1>
          <span className="header-breadcrumb">{meta.breadcrumb}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Global Search Bar on Desktop */}
        <div style={{ width: 220 }} className="desktop-table-view">
          <SearchInput
            value={globalSearch}
            onChange={setGlobalSearch}
            placeholder="Search claims, people..."
          />
        </div>

        <div className="header-actions">
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {pendingClaims.length > 0 && <span className="indicator-dot" />}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  width: 320,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 50,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 8,
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                  <span className="badge badge-pending">{pendingClaims.length} Actionable</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                  {pendingClaims.length === 0 ? (
                    <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                      <CheckCircle2 size={24} color="var(--status-approved-dot)" style={{ margin: '0 auto 6px' }} />
                      All claims reviewed! No pending items.
                    </div>
                  ) : (
                    pendingClaims.slice(0, 4).map((claim) => (
                      <div
                        key={claim.id}
                        onClick={() => {
                          setShowNotifications(false);
                          setCurrentView('claims');
                          setSelectedClaimId(claim.id);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-surface-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                        }}
                      >
                        <Receipt size={16} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {claim.employeeName} submitted ₹{claim.amount.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {claim.title}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {pendingClaims.length > 0 && (
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setCurrentView('claims');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 0',
                      marginTop: 8,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-primary)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    View all pending claims →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Live MongoDB Status Badge */}
          <div
            className="desktop-table-view"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: isBackendConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              fontSize: 11,
              fontWeight: 600,
              color: isBackendConnected ? '#10b981' : '#ef4444',
            }}
            title={lastSyncTime ? `Last synced with MongoDB at ${lastSyncTime}` : 'Live Backend Sync'}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: isBackendConnected ? '#10b981' : '#ef4444',
                boxShadow: isBackendConnected ? '0 0 8px #10b981' : 'none',
                display: 'inline-block',
              }}
            />
            {loadingClaims ? 'Syncing...' : isBackendConnected ? 'MongoDB Live' : 'Backend Offline'}
          </div>

          {/* Sync Real Claims Button */}
          <button
            className="icon-btn"
            onClick={() => fetchRealClaims(true)}
            title="Sync Real Claims from MongoDB"
            aria-label="Sync Real Claims"
            style={{
              transform: loadingClaims ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.4s ease',
            }}
          >
            <RotateCcw size={16} />
          </button>

          {/* Quick Add Employee CTA */}
          <Button
            size="sm"
            icon={UserPlus}
            onClick={onOpenAddEmployee}
            className="desktop-table-view"
          >
            Add Employee
          </Button>
        </div>
      </div>
    </header>
  );
};
