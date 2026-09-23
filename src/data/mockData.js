/**
 * FinTrack AI — Employer Dashboard Data Definitions
 * Tailored for Indian corporate workflows with INR (₹) formatting and GST compliance.
 */

export const initialCompany = {
  id: 'COMP-IN-001',
  name: 'TechCorp Solutions India Pvt Ltd',
  code: 'TECHCORP-IND-2026',
  cin: 'U72900MH2020PTC349182',
  gstin: '27AABCT3518Q1Z9',
  domain: 'techcorp.in',
  city: 'Mumbai',
  state: 'Maharashtra',
  address: 'Level 8, Godrej BKC, Bandra Kurla Complex, Mumbai 400051',
  currency: 'INR',
  currencySymbol: '₹',
  logoText: 'TC',
  totalEmployees: 0,
  plan: 'Enterprise Pro',
};

export const initialAdmin = {
  id: 'ADM-001',
  name: 'Corporate Admin',
  email: 'admin@company.com',
  role: 'Head of Finance & Admin',
  department: 'Finance',
  phone: '+91 98201 44829',
  avatar: 'CA',
  joinedDate: '2024-03-15',
};

export const initialEmployees = [];

export const initialClaims = [];

export const initialBudget = {
  annualBudget: 1800000,
  monthlyBudget: 250000,
  spentThisMonth: 0,
  remainingThisMonth: 250000,
  projectedMonthEnd: 0,
  categories: [
    { name: 'Travel', limit: 80000, spent: 0, color: '#FF6B00' },
    { name: 'Food', limit: 40000, spent: 0, color: '#10B981' },
    { name: 'Office Equipment', limit: 45000, spent: 0, color: '#6366F1' },
    { name: 'Learning & Development', limit: 30000, spent: 0, color: '#3B82F6' },
    { name: 'Internet', limit: 25000, spent: 0, color: '#F59E0B' },
    { name: 'Medical', limit: 30000, spent: 0, color: '#EC4899' },
  ],
  departments: [
    { name: 'Engineering', limit: 95000, spent: 0, employeesCount: 0 },
    { name: 'Sales', limit: 65000, spent: 0, employeesCount: 0 },
    { name: 'Product', limit: 35000, spent: 0, employeesCount: 0 },
    { name: 'Marketing', limit: 25000, spent: 0, employeesCount: 0 },
    { name: 'Finance', limit: 18000, spent: 0, employeesCount: 0 },
    { name: 'HR & People', limit: 12000, spent: 0, employeesCount: 0 },
  ],
};

export const analyticsTrends = [
  { month: 'Apr 2026', totalSpent: 0, claimCount: 0, approvedCount: 0, rejectedCount: 0 },
  { month: 'May 2026', totalSpent: 0, claimCount: 0, approvedCount: 0, rejectedCount: 0 },
  { month: 'Jun 2026', totalSpent: 0, claimCount: 0, approvedCount: 0, rejectedCount: 0 },
  { month: 'Jul 2026', totalSpent: 0, claimCount: 0, approvedCount: 0, rejectedCount: 0 },
  { month: 'Aug 2026', totalSpent: 0, claimCount: 0, approvedCount: 0, rejectedCount: 0 },
  { month: 'Sep 2026', totalSpent: 0, claimCount: 0, approvedCount: 0, rejectedCount: 0 },
];

export const initialPolicySettings = {
  maxReceiptlessAmount: 500,
  submissionWindowDays: 30,
  autoApprovalThreshold: 1000,
  requireTaxInvoice: true,
  allowForeignCurrency: true,
  requireCostCenter: true,
  budgetAlertThreshold1: 80,
  budgetAlertThreshold2: 95,
  emailNotifications: true,
  dailySummary: true,
  slackAlerts: true,
};

export const initialAdminTeam = [
  {
    id: 'ADM-001',
    name: 'Corporate Admin',
    email: 'admin@company.com',
    role: 'Super Admin',
    status: 'Active',
    lastActive: 'Just now',
  },
];
