import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
  BarChart3,
  Settings,
  Building2,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    currentView,
    setCurrentView,
    company,
    admin,
    pendingClaims,
    employees,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    logout,
  } = useApp();


  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'claims',
      label: 'Reimbursement Claims',
      icon: Receipt,
      badge: pendingClaims.length > 0 ? pendingClaims.length : null,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      badge: employees.length,
      badgeNeutral: true,
    },
    {
      id: 'budget',
      label: 'Budget & Limits',
      icon: Wallet,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings & Policy',
      icon: Settings,
    },
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ zIndex: 39 }}
        />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-logo-lockup">
            <div className="brand-icon-box">
              <ShieldCheck size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div className="brand-title">
                FinTrack <span className="brand-badge">ADMIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Card Pill */}
        <div className="company-card-pill" title={`${company.name} (${company.code})`}>
          <div className="company-avatar">
            <Building2 size={16} />
          </div>
          <div className="company-meta">
            <div className="company-name">{company.name}</div>
            <div className="company-sub">{company.code}</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className="nav-badge"
                    style={
                      item.badgeNeutral
                        ? { background: 'var(--bg-surface-subtle)', color: 'var(--text-secondary)' }
                        : {}
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logged in Admin Profile Snippet */}
        <div className="sidebar-footer">
          <div
            className="admin-profile-snippet"
            onClick={() => handleNavClick('settings')}
            style={{ cursor: 'pointer' }}
            title="View Admin Profile in Settings"
          >
            <div className="admin-avatar">{admin.avatar || 'RJ'}</div>
            <div className="admin-info">
              <div className="admin-name">{admin.name}</div>
              <div className="admin-role">{admin.role}</div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={logout}
            title="Sign out of FinTrack Corporate"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

    </>
  );
};
