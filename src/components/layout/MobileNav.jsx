import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav = () => {
  const { currentView, setCurrentView, pendingClaims } = useApp();

  const mobileTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'claims', label: 'Claims', icon: Receipt, badge: pendingClaims.length },
    { id: 'employees', label: 'Staff', icon: Users },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;

        return (
          <button
            key={tab.id}
            className={`mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentView(tab.id)}
            style={{ position: 'relative' }}
          >
            <Icon />
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 14,
                  background: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '1px 5px',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
