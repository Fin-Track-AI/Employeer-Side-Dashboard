import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './views/DashboardView';
import { ClaimsView } from './views/ClaimsView';
import { EmployeesView } from './views/EmployeesView';
import { BudgetView } from './views/BudgetView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';
import { ClaimDrawer } from './components/claims/ClaimDrawer';

import { RejectReasonModal } from './components/claims/RejectReasonModal';
import { EmployeeDrawer } from './components/employees/EmployeeDrawer';
import { AddEmployeeModal } from './components/employees/AddEmployeeModal';
import { useApp } from './context/AppContext';

export const App = () => {
  const {
    isAuthenticated,
    currentView,
    claims,
    employees,
    selectedClaimId,
    setSelectedClaimId,
    selectedEmployeeId,
    setSelectedEmployeeId,
    rejectClaim,
    addEmployee,
  } = useApp();

  // Modals & Drawers State (declared unconditionally per React Rules of Hooks)
  const [rejectModalClaim, setRejectModalClaim] = useState(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  // If user is not authenticated, show corporate Login / Signup portal
  if (!isAuthenticated) {
    return <AuthView />;
  }



  // Lookups for drawers
  const activeClaim = claims.find((c) => c.id === selectedClaimId);
  const activeEmployee = employees.find((e) => e.id === selectedEmployeeId);

  const handleOpenClaim = (claim) => {
    setSelectedClaimId(claim.id);
  };

  const handleCloseClaim = () => {
    setSelectedClaimId(null);
  };

  const handleOpenEmployee = (employee) => {
    setSelectedEmployeeId(employee.id);
  };

  const handleCloseEmployee = () => {
    setSelectedEmployeeId(null);
  };

  const handleTriggerReject = (claim) => {
    setRejectModalClaim(claim);
  };

  const handleCloseRejectModal = () => {
    setRejectModalClaim(null);
  };

  const handleConfirmReject = (claimId, reason) => {
    return rejectClaim(claimId, reason);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header onOpenAddEmployee={() => setIsAddEmployeeModalOpen(true)} />

        {/* Content Area */}
        <main className="content-area">
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenClaim={handleOpenClaim}
              onRejectClaim={handleTriggerReject}
            />
          )}

          {currentView === 'claims' && (
            <ClaimsView
              onOpenClaim={handleOpenClaim}
              onRejectClaim={handleTriggerReject}
            />
          )}

          {currentView === 'employees' && (
            <EmployeesView
              onOpenEmployee={handleOpenEmployee}
              onOpenAddEmployee={() => setIsAddEmployeeModalOpen(true)}
            />
          )}

          {currentView === 'budget' && <BudgetView />}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Claim Inspection & OCR Drawer */}
      <ClaimDrawer
        claim={activeClaim}
        isOpen={Boolean(activeClaim)}
        onClose={handleCloseClaim}
        onOpenRejectModal={handleTriggerReject}
      />

      {/* Employee Profile & History Drawer */}
      <EmployeeDrawer
        employee={activeEmployee}
        isOpen={Boolean(activeEmployee)}
        onClose={handleCloseEmployee}
        onSelectClaim={(claim) => {
          setSelectedClaimId(claim.id);
        }}
      />

      {/* Rejection Confirmation Modal with Mandatory Reason */}
      <RejectReasonModal
        isOpen={Boolean(rejectModalClaim)}
        onClose={handleCloseRejectModal}
        claim={rejectModalClaim}
        onConfirmReject={handleConfirmReject}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAddEmployee={addEmployee}
      />
    </div>
  );
};
