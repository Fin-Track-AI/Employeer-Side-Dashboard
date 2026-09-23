import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  Briefcase,
  Layers,
  Check,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './AuthView.css';

const PRESET_COMPANIES = [
  {
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
    totalEmployees: 14,
    plan: 'Enterprise Pro',
  },
  {
    id: 'COMP-IN-002',
    name: 'Infosys Enterprise Systems',
    code: 'INFY-BLR-09',
    cin: 'L85110KA1981PLC013115',
    gstin: '29AAACI4740D1ZY',
    domain: 'infosys.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Electronics City, Hosur Road, Bengaluru 560100',
    currency: 'INR',
    currencySymbol: '₹',
    logoText: 'INFY',
    totalEmployees: 42,
    plan: 'Enterprise Pro',
  },
  {
    id: 'COMP-IN-003',
    name: 'Tata Consultancy Services',
    code: 'TCS-CORP-44',
    cin: 'L22210MH1995PLC084781',
    gstin: '27AAACT2879F1ZS',
    domain: 'tcs.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'TCS House, Raveline Street, Fort, Mumbai 400001',
    currency: 'INR',
    currencySymbol: '₹',
    logoText: 'TCS',
    totalEmployees: 65,
    plan: 'Enterprise Max',
  },
  {
    id: 'COMP-IN-004',
    name: 'Wipro Technologies Ltd',
    code: 'WIPRO-ENT-88',
    cin: 'L32102KA1945PLC020800',
    gstin: '29AAACW0387R1Z5',
    domain: 'wipro.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Doddakannelli, Sarjapur Road, Bengaluru 560035',
    currency: 'INR',
    currencySymbol: '₹',
    logoText: 'WP',
    totalEmployees: 28,
    plan: 'Enterprise Pro',
  },
];

export const AuthView = () => {
  const { loginWithPassword, loginWithOtp, sendOtp } = useApp();
  const { addToast } = useToast();

  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'

  // Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);
  const [loginCompanyId, setLoginCompanyId] = useState(PRESET_COMPANIES[0].id);

  // Loading & Timer States
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Trigger countdown timer
  const startOtpTimer = () => {
    setOtpCountdown(30);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendLoginOtp = async () => {
    if (!loginEmail || !loginEmail.includes('@')) {
      addToast({
        title: 'Work Email Required',
        message: 'Please enter a valid corporate email address',
        type: 'warning',
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendOtp(loginEmail);
      setIsLoginOtpSent(true);
      startOtpTimer();
    } catch (_) {
      // Toast handled in context
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail) {
      addToast({
        title: 'Email Required',
        message: 'Please enter your corporate email address',
        type: 'warning',
      });
      return;
    }

    const companyData = PRESET_COMPANIES.find((c) => c.id === loginCompanyId) || PRESET_COMPANIES[0];
    setIsLoading(true);

    try {
      if (loginMethod === 'password') {
        if (!loginPassword) {
          addToast({
            title: 'Password Required',
            message: 'Please enter your corporate account password',
            type: 'warning',
          });
          setIsLoading(false);
          return;
        }
        await loginWithPassword({
          email: loginEmail,
          password: loginPassword,
          companyData,
        });
      } else {
        if (!loginOtp || loginOtp.length < 4) {
          addToast({
            title: 'OTP Required',
            message: 'Please enter the 6-digit verification code',
            type: 'warning',
          });
          setIsLoading(false);
          return;
        }
        await loginWithOtp({
          email: loginEmail,
          otp: loginOtp,
          companyData,
        });
      }
    } catch (_) {
      // Error toast already shown
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-portal-container">
      {/* Subtle warm orange top ambient lighting */}
      <div className="auth-ambient-glow" />

      {/* Main Elevated Card */}
      <div className="auth-portal-card">
        {/* Left Column: Brand, Trust & Features */}
        <div className="auth-brand-pane">
          {/* Header & Logo */}
          <div className="auth-brand-header">
            <div className="auth-brand-logo">
              <span className="auth-logo-text">F</span>
            </div>
            <div>
              <div className="auth-brand-name">
                FinTrack <span className="auth-brand-badge">EMPLOYER CONSOLE</span>
              </div>
              <div className="auth-brand-tagline">Corporate Expense Governance & AI Reimbursements</div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="auth-brand-body">
            <div className="auth-hero-pill">
              <Sparkles size={14} className="auth-hero-pill-icon" />
              <span>Next-Gen Enterprise Reimbursements</span>
            </div>

            <h1 className="auth-brand-heading">
              Smart Expense Governance for Growing Teams
            </h1>

            <p className="auth-brand-description">
              Generate invite codes for employees, automatically verify receipts with AI OCR, audit GST compliance, and mark bank payouts done in one click.
            </p>

            {/* Feature Cards with Generous Spacing */}
            <div className="auth-features-list">
              <div className="auth-feature-card">
                <div className="auth-feature-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div className="auth-feature-text">
                  <h4 className="auth-feature-title">Corporate Invite Codes</h4>
                  <p className="auth-feature-desc">
                    Issue secure, single-use codes with assigned department limits.
                  </p>
                </div>
              </div>

              <div className="auth-feature-card">
                <div className="auth-feature-icon-box">
                  <Layers size={20} />
                </div>
                <div className="auth-feature-text">
                  <h4 className="auth-feature-title">AI Receipt Ingestion</h4>
                  <p className="auth-feature-desc">
                    Instant expense receipt sync with automated OCR itemization.
                  </p>
                </div>
              </div>

              <div className="auth-feature-card">
                <div className="auth-feature-icon-box">
                  <Briefcase size={20} />
                </div>
                <div className="auth-feature-text">
                  <h4 className="auth-feature-title">1-Click Payout Reconciliation</h4>
                  <p className="auth-feature-desc">
                    Approve claims and mark payment done to complete cycles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="auth-brand-footer">
            <span>FinTrack AI Enterprise v2.4</span>
            <span className="auth-footer-dot">•</span>
            <span>Bank-Grade 256-Bit SSL</span>
          </div>
        </div>

        {/* Right Column: Employer Sign In Form */}
        <div className="auth-form-pane">
          <form onSubmit={handleLoginSubmit} className="auth-form">
            {/* Heading & Badge */}
            <div className="auth-pane-heading">
              <div className="auth-role-pill">
                <Building2 size={13} /> EMPLOYER PORTAL
              </div>
              <h2 className="auth-form-title">Sign In to Dashboard</h2>
              <p className="auth-form-subtitle">
                Access your company console to review claims and invite employees
              </p>
            </div>

            {/* Method Toggle: Password vs OTP */}
            <div className="auth-method-toggle">
              <button
                type="button"
                className={`auth-method-pill ${loginMethod === 'password' ? 'active' : ''}`}
                onClick={() => setLoginMethod('password')}
              >
                <Lock size={14} /> Password
              </button>
              <button
                type="button"
                className={`auth-method-pill ${loginMethod === 'otp' ? 'active' : ''}`}
                onClick={() => setLoginMethod('otp')}
              >
                <KeyRound size={14} /> 6-Digit OTP
              </button>
            </div>

            {/* Company Selection */}
            <div className="auth-input-group">
              <label className="auth-label">
                <Building2 size={14} className="auth-label-icon" /> Company Portal
              </label>
              <div className="auth-select-wrapper">
                <select
                  className="auth-select"
                  value={loginCompanyId}
                  onChange={(e) => setLoginCompanyId(e.target.value)}
                >
                  {PRESET_COMPANIES.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} ({comp.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Corporate Work Email */}
            <div className="auth-input-group">
              <label className="auth-label">
                <Mail size={14} className="auth-label-icon" /> Corporate Work Email
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="admin@company.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Login Field */}
            {loginMethod === 'password' && (
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label className="auth-label">
                    <Lock size={14} className="auth-label-icon" /> Password
                  </label>
                </div>
                <div className="auth-password-wrapper">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="auth-input auth-password-input"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Login Field */}
            {loginMethod === 'otp' && (
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label className="auth-label">
                    <KeyRound size={14} className="auth-label-icon" /> 6-Digit Verification Code
                  </label>
                  {isLoginOtpSent && (
                    <button
                      type="button"
                      className="auth-resend-link"
                      disabled={otpCountdown > 0 || isLoading}
                      onClick={handleSendLoginOtp}
                    >
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend Code'}
                    </button>
                  )}
                </div>

                <div className="auth-otp-row">
                  <input
                    type="text"
                    maxLength={6}
                    className="auth-input auth-otp-input"
                    placeholder="Enter 6-digit code"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  {!isLoginOtpSent ? (
                    <button
                      type="button"
                      className="auth-send-otp-btn"
                      onClick={handleSendLoginOtp}
                      disabled={isLoading || !loginEmail}
                    >
                      Send Code
                    </button>
                  ) : (
                    <div className="auth-code-sent-badge">
                      <Check size={14} /> Sent
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="auth-btn-content">
                  <RefreshCw size={16} className="auth-spinner" /> Signing in...
                </span>
              ) : (
                <span className="auth-btn-content">
                  Sign In to Employer Console <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
