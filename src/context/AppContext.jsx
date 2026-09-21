import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCompany,
  initialAdmin,
  initialEmployees,
  initialClaims,
  initialBudget,
  initialPolicySettings,
  initialAdminTeam,
} from '../data/mockData';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const AppContext = createContext(null);
const STORAGE_KEY = 'fintrack_employer_state_v1';

export const AppProvider = ({ children }) => {
  const { addToast } = useToast();

  // Load from LocalStorage if available
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_company`);
    return saved ? JSON.parse(saved) : initialCompany;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_admin`);
    return saved ? JSON.parse(saved) : initialAdmin;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_claims`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Exclude any legacy mock claims (CLM-100x)
        if (Array.isArray(parsed) && !parsed.some(c => c.id && c.id.startsWith('CLM-100'))) {
          return parsed;
        }
      } catch (_) {}
    }
    return [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
    return saved ? JSON.parse(saved) : initialBudget;
  });

  const [policySettings, setPolicySettings] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_policy`);
    return saved ? JSON.parse(saved) : initialPolicySettings;
  });

  const [adminTeam, setAdminTeam] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_adminTeam`);
    return saved ? JSON.parse(saved) : initialAdminTeam;
  });

  // UI Navigation State
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Backend Sync State
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Fetch real claims from MongoDB backend
  const fetchRealClaims = async (showNotification = false) => {
    try {
      setLoadingClaims(true);
      const backendClaims = await api.getClaims();
      if (Array.isArray(backendClaims)) {
        setClaims(backendClaims);
        localStorage.setItem(`${STORAGE_KEY}_claims`, JSON.stringify(backendClaims));
        setIsBackendConnected(true);
        setLastSyncTime(new Date().toLocaleTimeString());

        // Update company stats based on real data
        const approvedSum = backendClaims
          .filter((c) => ['Approved', 'Paid'].includes(c.status))
          .reduce((sum, c) => sum + (c.amount || 0), 0);

        setBudget((prev) => ({
          ...prev,
          spentThisMonth: approvedSum,
          remainingThisMonth: Math.max(0, prev.monthlyBudget - approvedSum),
        }));

        if (showNotification) {
          addToast({
            type: 'success',
            title: 'Claims Synchronized',
            message: `Fetched ${backendClaims.length} real claims directly from MongoDB backend.`,
          });
        }
      }
    } catch (err) {
      console.warn('Real backend claims fetch failed, operating in resilient mode:', err.message);
      setIsBackendConnected(false);
    } finally {
      setLoadingClaims(false);
    }
  };

  // Fetch real registered employees from backend
  const fetchRealEmployees = async () => {
    try {
      const backendEmployees = await api.getEmployees();
      if (Array.isArray(backendEmployees) && backendEmployees.length > 0) {
        setEmployees(backendEmployees);
        localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(backendEmployees));
        setCompany((prev) => ({
          ...prev,
          totalEmployees: backendEmployees.length,
        }));
      }
    } catch (err) {
      console.warn('Employees fetch failed:', err.message);
    }
  };

  // Initial load & periodic background sync every 10s
  useEffect(() => {
    // Purge any stale mock claims immediately
    const saved = localStorage.getItem(`${STORAGE_KEY}_claims`);
    if (saved && saved.includes('CLM-100')) {
      localStorage.removeItem(`${STORAGE_KEY}_claims`);
      setClaims([]);
    }

    fetchRealClaims();
    fetchRealEmployees();

    const interval = setInterval(() => {
      fetchRealClaims(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_company`, JSON.stringify(company));
    localStorage.setItem(`${STORAGE_KEY}_admin`, JSON.stringify(admin));
    localStorage.setItem(`${STORAGE_KEY}_claims`, JSON.stringify(claims));
    localStorage.setItem(`${STORAGE_KEY}_budget`, JSON.stringify(budget));
    localStorage.setItem(`${STORAGE_KEY}_policy`, JSON.stringify(policySettings));
    localStorage.setItem(`${STORAGE_KEY}_adminTeam`, JSON.stringify(adminTeam));
  }, [company, admin, claims, budget, policySettings, adminTeam]);

  // Derive counts & stats dynamically
  const pendingClaims = claims.filter((c) => c.status === 'Pending');
  const approvedClaims = claims.filter((c) => c.status === 'Approved' || c.status === 'Paid');
  const rejectedClaims = claims.filter((c) => c.status === 'Rejected');

  // Helper to validate state transitions in web app (BR-14)
  const validateTransition = (currentStatus, targetStatus) => {
    if (currentStatus === 'Paid' || currentStatus === 'Reimbursed') {
      addToast({
        type: 'error',
        title: 'Transition Blocked (BR-14)',
        message: `Claim status '${currentStatus}' is in a terminal state and cannot be altered.`,
      });
      return false;
    }

    if (currentStatus === 'Rejected' && (targetStatus === 'Paid' || targetStatus === 'Reimbursed' || targetStatus === 'Approved')) {
      addToast({
        type: 'error',
        title: 'Transition Blocked (BR-14)',
        message: `Cannot transition from '${currentStatus}' directly to '${targetStatus}'.`,
      });
      return false;
    }

    return true;
  };

  // Approve Claim Handler (Direct MongoDB Backend sync)
  const approveClaim = async (claimId, adminNotes = '') => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (targetClaim && !validateTransition(targetClaim.status, 'Approved')) {
      return false;
    }

    const defaultNotes = adminNotes || 'Approved per company reimbursement policy guidelines.';

    // Optimistic UI update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'Approved',
              adminNotes: defaultNotes,
              approvedAt: new Date().toISOString(),
              approvedBy: admin.name,
            }
          : c
      )
    );

    try {
      await api.updateClaimStatus(claimId, {
        status: 'Approved',
        adminNotes: defaultNotes,
      });

      addToast({
        type: 'success',
        title: 'Claim Approved (BR-13)',
        message: `Claim ${claimId} approved successfully and updated in employee mobile app.`,
      });

      fetchRealClaims();
      return true;
    } catch (err) {
      console.error('Error updating claim status:', err);
      addToast({
        type: 'error',
        title: 'Sync Failed',
        message: err.message || 'Could not update claim status in backend.',
      });
      fetchRealClaims();
      return false;
    }
  };

  // Reject Claim Handler (Requires mandatory reason, Direct MongoDB Backend sync)
  const rejectClaim = async (claimId, rejectionReason) => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (targetClaim && !validateTransition(targetClaim.status, 'Rejected')) {
      return false;
    }

    if (!rejectionReason || !rejectionReason.trim()) {
      addToast({
        type: 'error',
        title: 'Rejection Failed',
        message: 'A mandatory reason is required to reject a reimbursement claim.',
      });
      return false;
    }

    const reason = rejectionReason.trim();

    // Optimistic UI update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'Rejected',
              rejectionReason: reason,
              adminNotes: `Rejected: ${reason}`,
              rejectedAt: new Date().toISOString(),
              rejectedBy: admin.name,
            }
          : c
      )
    );

    try {
      await api.updateClaimStatus(claimId, {
        status: 'Rejected',
        rejectionReason: reason,
      });

      addToast({
        type: 'error',
        title: 'Claim Rejected (BR-13)',
        message: `Claim ${claimId} rejected. Reason synced to employee mobile app.`,
      });

      fetchRealClaims();
      return true;
    } catch (err) {
      console.error('Error rejecting claim:', err);
      addToast({
        type: 'error',
        title: 'Rejection Sync Failed',
        message: err.message || 'Could not update rejection in backend.',
      });
      fetchRealClaims();
      return false;
    }
  };

  // BR-13: Request Additional Info Handler
  const requestInfoOnClaim = async (claimId, questionNote) => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (targetClaim && !validateTransition(targetClaim.status, 'Info Requested')) {
      return false;
    }

    if (!questionNote || !questionNote.trim()) {
      addToast({
        type: 'error',
        title: 'Request Info Failed',
        message: 'A note specifying the requested information is required.',
      });
      return false;
    }

    const question = questionNote.trim();

    // Optimistic UI update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'Info Requested',
              requestedInfoNote: question,
              adminNotes: `Info Requested: ${question}`,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    try {
      await api.updateClaimStatus(claimId, {
        status: 'Info Requested',
        requestedInfoNote: question,
        note: question,
      });

      addToast({
        type: 'info',
        title: 'Info Requested (BR-13)',
        message: `Question sent to employee for claim ${claimId}. Mobile app updated.`,
      });

      fetchRealClaims();
      return true;
    } catch (err) {
      console.error('Error requesting info:', err);
      addToast({
        type: 'error',
        title: 'Sync Failed',
        message: err.message || 'Could not update request info in backend.',
      });
      fetchRealClaims();
      return false;
    }
  };

  // Mark Claim as Paid / Reimbursed (Disbursement sync)
  const markClaimAsPaid = async (claimId) => {
    const targetClaim = claims.find((c) => c.id === claimId);
    if (targetClaim && !validateTransition(targetClaim.status, 'Paid')) {
      return false;
    }

    // Optimistic update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'Paid',
              paidAt: new Date().toISOString(),
              paidBy: admin.name,
            }
          : c
      )
    );

    try {
      await api.updateClaimStatus(claimId, {
        status: 'Paid',
      });

      addToast({
        type: 'success',
        title: 'Claim Settled & Reimbursed (BR-14)',
        message: `Claim ${claimId} marked as Reimbursed. Status updated for employee.`,
      });

      fetchRealClaims();
      return true;
    } catch (err) {
      console.error('Error marking claim as paid:', err);
      addToast({
        type: 'error',
        title: 'Payment Sync Failed',
        message: err.message || 'Could not update payment in backend.',
      });
      fetchRealClaims();
      return false;
    }
  };

  // Add Employee Handler
  const addEmployee = (newEmpData) => {
    const newId = `EMP-${100 + employees.length + 1}`;
    const initials = newEmpData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newEmployee = {
      id: newId,
      name: newEmpData.name.trim(),
      email: newEmpData.email.trim().toLowerCase(),
      phone: newEmpData.phone.trim() || '+91 98000 00000',
      department: newEmpData.department || 'Engineering',
      role: newEmpData.role || 'Associate',
      status: 'Active',
      monthlyAllowance: Number(newEmpData.monthlyAllowance) || 25000,
      totalReimbursed: 0,
      claimsCount: 0,
      avatar: initials,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    setCompany((prev) => ({ ...prev, totalEmployees: prev.totalEmployees + 1 }));

    addToast({
      type: 'success',
      title: 'Employee Added',
      message: `${newEmployee.name} has been enrolled in ${company.name}.`,
    });

    return newEmployee;
  };

  // Update Budget Configuration
  const updateBudget = (newBudgetValues) => {
    const monthlyBudget = Number(newBudgetValues.monthlyBudget);
    const annualBudget = Number(newBudgetValues.annualBudget);

    setBudget((prev) => {
      const remainingThisMonth = Math.max(0, monthlyBudget - prev.spentThisMonth);
      return {
        ...prev,
        monthlyBudget,
        annualBudget,
        remainingThisMonth,
        categories: newBudgetValues.categories || prev.categories,
        departments: newBudgetValues.departments || prev.departments,
      };
    });

    addToast({
      type: 'success',
      title: 'Budget Updated',
      message: `Monthly reimbursement budget set to ₹${monthlyBudget.toLocaleString('en-IN')}.`,
    });
  };

  // Update Policy Settings
  const updatePolicySettings = (newSettings) => {
    setPolicySettings((prev) => ({ ...prev, ...newSettings }));
    addToast({
      type: 'success',
      title: 'Policy Settings Saved',
      message: 'Company reimbursement rules have been updated.',
    });
  };

  // Force Refresh Live Data from MongoDB
  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_claims`);
    setClaims([]);
    fetchRealClaims(true);
    fetchRealEmployees();
  };

  return (
    <AppContext.Provider
      value={{
        company,
        admin,
        employees,
        claims,
        budget,
        policySettings,
        adminTeam,
        currentView,
        setCurrentView,
        selectedClaimId,
        setSelectedClaimId,
        selectedEmployeeId,
        setSelectedEmployeeId,
        globalSearch,
        setGlobalSearch,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        pendingClaims,
        approvedClaims,
        rejectedClaims,
        approveClaim,
        rejectClaim,
        requestInfoOnClaim,
        markClaimAsPaid,
        addEmployee,
        updateBudget,
        updatePolicySettings,
        resetDemoData,
        loadingClaims,
        isBackendConnected,
        lastSyncTime,
        fetchRealClaims,
        fetchRealEmployees,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
