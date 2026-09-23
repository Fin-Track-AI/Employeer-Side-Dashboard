import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
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
  const { loginWithPassword, loginWithOtp, signup, sendOtp } = useApp();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);
  const [loginCompanyId, setLoginCompanyId] = useState(PRESET_COMPANIES[0].id);

  // Signup Form State
  const [signupStep, setSignupStep] = useState(1); // 1: Profile & Company, 2: OTP Verification
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupRole, setSignupRole] = useState('Head of Finance & Admin');
  const [selectedCompanyId, setSelectedCompanyId] = useState(PRESET_COMPANIES[0].id);
  const [isCustomCompany, setIsCustomCompany] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customGstin, setCustomGstin] = useState('');
  const [signupOtp, setSignupOtp] = useState('');


  // Loading States
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

  // Quick autofill demo admin
  const handleAutofillDemo = () => {
    setActiveTab('login');
    setLoginMethod('password');
    setLoginEmail('jadhavritesh283@gmail.com');
    setLoginPassword('TechCorp@2026');
    setLoginCompanyId(PRESET_COMPANIES[0].id);
    addToast({
      title: 'Demo Credentials Loaded',
      message: 'Email and password populated for TechCorp India',
      type: 'info',
    });
  };

  // Handle Login Send OTP
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
      // Toast already handled in context
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login Submit
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
      // Error toast already surfaced
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Step 1 Next -> Request OTP
  const handleSignupNextStep = async (e) => {
    e.preventDefault();
    if (!signupName.trim()) {
      addToast({ title: 'Name Required', message: 'Please enter your full name', type: 'warning' });
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      addToast({ title: 'Work Email Required', message: 'Please provide a valid work email', type: 'warning' });
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      addToast({ title: 'Password Insecure', message: 'Password must be at least 6 characters', type: 'warning' });
      return;
    }
    if (isCustomCompany && !customCompanyName.trim()) {
      addToast({ title: 'Company Name Required', message: 'Please enter what company you work for', type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      await sendOtp(signupEmail);
      setIsSignupOtpSent(true);
      setSignupStep(2);
      startOtpTimer();
    } catch (_) {
      // Fallback: proceed to step 2 so user is not blocked
      setIsSignupOtpSent(true);
      setSignupStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Final Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupOtp || signupOtp.length < 4) {
      addToast({ title: 'Verification Code Required', message: 'Please enter the 6-digit OTP code', type: 'warning' });
      return;
    }

    let companyData;
    if (isCustomCompany) {
      companyData = {
        id: 'COMP-CUSTOM-' + Date.now().toString().slice(-4),
        name: customCompanyName.trim(),
        code: customCompanyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) + '-2026',
        cin: 'U72900MH2024PTC' + Math.floor(100000 + Math.random() * 900000),
        gstin: customGstin.trim() || '27AAACC' + Math.floor(1000 + Math.random() * 9000) + 'Q1Z1',
        domain: signupEmail.split('@')[1] || 'enterprise.in',
        city: customCity.trim() || 'Mumbai',
        state: 'Maharashtra',
        address: `${customCompanyName.trim()} Corporate Office, ${customCity.trim() || 'Mumbai'}`,
        currency: 'INR',
        currencySymbol: '₹',
        logoText: customCompanyName.trim().slice(0, 2).toUpperCase(),
        totalEmployees: 1,
        plan: 'Enterprise Pro',
      };
    } else {
      companyData = PRESET_COMPANIES.find((c) => c.id === selectedCompanyId) || PRESET_COMPANIES[0];
    }

    setIsLoading(true);
    try {
      await signup({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        companyData,
        department: 'Finance & Accounts',
        role: signupRole,
      });
    } catch (_) {
      // Toast handled
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-portal-container">
      {/* Background ambient lighting */}
      <div className="auth-ambient-glow glow-top" />
      <div className="auth-ambient-glow glow-bottom" />

      <div className="auth-portal-card">
        {/* Left Column: Enterprise Branding & Key Features */}
        <div className="auth-brand-pane">
          <div className="auth-brand-header">
            <div className="auth-brand-logo">
              <span className="auth-logo-text">F</span>
            </div>
            <div>
              <div className="auth-brand-name">
                FinTrack <span className="auth-brand-badge">EMPLOYER</span>
              </div>
              <div className="auth-brand-tagline">AI Corporate Expense & Audit Suite</div>
            </div>
          </div>

          <div className="auth-brand-content">
            <h2 className="auth-hero-title">
              Automated Expense <br />
              Audit for India’s <br />
              <span className="auth-highlight">Modern Workplaces.</span>
            </h2>
            <p className="auth-hero-subtitle">
              Verify employee tax invoices via multimodal OCR, enforce budget caps, and settle peer-to-peer claims seamlessly under the DPDP Act 2023.
            </p>

            <div className="auth-value-props">
              <div className="auth-prop-item">
                <div className="auth-prop-icon">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="auth-prop-title">Multimodal Tax OCR</div>
                  <div className="auth-prop-desc">Instantly parses GSTIN, HSN codes, and CGST/SGST splits</div>
                </div>
              </div>

              <div className="auth-prop-item">
                <div className="auth-prop-icon">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="auth-prop-title">DPDP Act & RBI Compliant</div>
                  <div className="auth-prop-desc">256-bit encrypted audit logs and statutory consent controls</div>
                </div>
              </div>

              <div className="auth-prop-item">
                <div className="auth-prop-icon">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="auth-prop-title">Department Budget Safeguards</div>
                  <div className="auth-prop-desc">Real-time alerts preventing allowance overruns before payout</div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-demo-helper">
            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleAutofillDemo}
            >
              <Sparkles size={14} /> Quick Demo: Fill TechCorp Admin Credentials
            </button>
          </div>

          <div className="auth-footer-note">
            <span>© 2026 FinTrack Technologies India Pvt Ltd</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Right Column: Interactive Login / Signup Form */}
        <div className="auth-form-pane">
          {/* Tab Selector */}
          <div className="auth-tabs-header">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setSignupStep(1);
              }}
            >
              Sign In to Portal
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setSignupStep(1);
              }}
            >
              Create Employer Account
            </button>
          </div>

          {/* LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="auth-pane-heading">
                <h3>Welcome Back</h3>
                <p>Access your corporate expense management console</p>
              </div>

              {/* Login Method Toggle */}
              <div className="auth-method-toggle">
                <button
                  type="button"
                  className={`auth-method-pill ${loginMethod === 'password' ? 'active' : ''}`}
                  onClick={() => setLoginMethod('password')}
                >
                  <Lock size={13} /> Password
                </button>
                <button
                  type="button"
                  className={`auth-method-pill ${loginMethod === 'otp' ? 'active' : ''}`}
                  onClick={() => setLoginMethod('otp')}
                >
                  <KeyRound size={13} /> 6-Digit OTP
                </button>
              </div>

              {/* Company Context */}
              <div className="auth-input-group">
                <label className="auth-label">
                  <Building2 size={14} /> Company Portal
                </label>
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

              {/* Work Email */}
              <div className="auth-input-group">
                <label className="auth-label">
                  <Mail size={14} /> Corporate Email Address
                </label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="admin@techcorp.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Method Fields */}
              {loginMethod === 'password' && (
                <div className="auth-input-group">
                  <div className="auth-label-row">
                    <label className="auth-label">
                      <Lock size={14} /> Password
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

              {/* OTP Method Fields */}
              {loginMethod === 'otp' && (
                <div className="auth-input-group">
                  <div className="auth-label-row">
                    <label className="auth-label">
                      <KeyRound size={14} /> 6-Digit OTP Verification Code
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
                      placeholder="123456"
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
                  <div className="auth-helper-text">
                    For local testing, verification code is <strong>123456</strong> or <strong>000000</strong>.
                  </div>
                </div>
              )}

              {/* Submit Button */}
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
                    Sign In to Corporate Portal <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP TAB */}
          {activeTab === 'signup' && (
            <div className="auth-form">
              <div className="auth-pane-heading">
                <h3>Create Corporate Account</h3>
                <p>Set up an expense administration portal for your company</p>
              </div>

              {/* Signup Step Indicators */}
              <div className="auth-steps-tracker">
                <div className={`auth-step-pill ${signupStep === 1 ? 'active' : 'completed'}`}>
                  <span className="auth-step-num">1</span>
                  <span>Company & Profile</span>
                </div>
                <div className="auth-step-divider" />
                <div className={`auth-step-pill ${signupStep === 2 ? 'active' : ''}`}>
                  <span className="auth-step-num">2</span>
                  <span>OTP Verification</span>
                </div>
              </div>

              {/* STEP 1: Admin Profile + Company Selection */}
              {signupStep === 1 && (
                <form onSubmit={handleSignupNextStep} className="auth-step-body">
                  <div className="auth-input-group">
                    <label className="auth-label">
                      <User size={14} /> Your Full Name
                    </label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="e.g. Ritesh Jadhav"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-grid-2">
                    <div className="auth-input-group">
                      <label className="auth-label">
                        <Mail size={14} /> Corporate Work Email
                      </label>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="ritesh@company.in"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="auth-input-group">
                      <label className="auth-label">
                        <Phone size={14} /> Mobile Phone
                      </label>
                      <input
                        type="tel"
                        className="auth-input"
                        placeholder="+91 98201 44829"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-label">
                      <Lock size={14} /> Secure Password
                    </label>
                    <div className="auth-password-wrapper">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        className="auth-input auth-password-input"
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        tabIndex={-1}
                      >
                        {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* What Company You Work For Section */}
                  <div className="auth-company-section">
                    <div className="auth-section-title">
                      <Building2 size={15} color="var(--color-primary)" />
                      <span>What Company Do You Work For?</span>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-label">Select Company</label>
                      <select
                        className="auth-select"
                        value={isCustomCompany ? 'custom' : selectedCompanyId}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomCompany(true);
                          } else {
                            setIsCustomCompany(false);
                            setSelectedCompanyId(e.target.value);
                          }
                        }}
                      >
                        {PRESET_COMPANIES.map((comp) => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} — {comp.city}
                          </option>
                        ))}
                        <option value="custom">+ Enter New / Other Company...</option>
                      </select>
                    </div>

                    {isCustomCompany && (
                      <div className="auth-custom-company-box">
                        <div className="auth-input-group">
                          <label className="auth-label">Company Legal Name</label>
                          <input
                            type="text"
                            className="auth-input"
                            placeholder="e.g. Apex Technologies India Pvt Ltd"
                            value={customCompanyName}
                            onChange={(e) => setCustomCompanyName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="auth-grid-2">
                          <div className="auth-input-group">
                            <label className="auth-label">City / Headquarters</label>
                            <input
                              type="text"
                              className="auth-input"
                              placeholder="e.g. Pune, Bengaluru"
                              value={customCity}
                              onChange={(e) => setCustomCity(e.target.value)}
                            />
                          </div>
                          <div className="auth-input-group">
                            <label className="auth-label">GSTIN (Optional)</label>
                            <input
                              type="text"
                              className="auth-input"
                              placeholder="27AABCT3518Q1Z9"
                              value={customGstin}
                              onChange={(e) => setCustomGstin(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="auth-input-group" style={{ marginTop: '12px' }}>
                      <label className="auth-label">
                        <Briefcase size={14} /> Your Role / Designation
                      </label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Head of Finance & Admin"
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="auth-btn-content">
                        <RefreshCw size={16} className="auth-spinner" /> Generating Code...
                      </span>
                    ) : (
                      <span className="auth-btn-content">
                        Continue to OTP Verification <ArrowRight size={16} />
                      </span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: 6-Digit OTP Verification */}
              {signupStep === 2 && (
                <form onSubmit={handleSignupSubmit} className="auth-step-body">
                  <div className="auth-otp-verify-banner">
                    <div className="auth-verify-icon">
                      <Mail size={22} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div className="auth-verify-title">Verify Work Email</div>
                      <div className="auth-verify-subtitle">
                        We dispatched a 6-digit confirmation code to <strong>{signupEmail}</strong>.
                      </div>
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <div className="auth-label-row">
                      <label className="auth-label">
                        <KeyRound size={14} /> Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        className="auth-resend-link"
                        disabled={otpCountdown > 0 || isLoading}
                        onClick={async () => {
                          await sendOtp(signupEmail);
                          startOtpTimer();
                        }}
                      >
                        {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend Code'}
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      className="auth-input auth-otp-large"
                      placeholder="••••••"
                      value={signupOtp}
                      onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                      required
                    />
                    <div className="auth-helper-text">
                      Development bypass: Enter <strong>123456</strong> or <strong>000000</strong> to verify immediately.
                    </div>
                  </div>

                  <div className="auth-company-summary-card">
                    <div className="auth-summary-label">Selected Company:</div>
                    <div className="auth-summary-value">
                      <Building2 size={15} color="var(--color-primary)" />
                      <span>{isCustomCompany ? customCompanyName : PRESET_COMPANIES.find(c => c.id === selectedCompanyId)?.name}</span>
                    </div>
                  </div>

                  <div className="auth-step-buttons">
                    <button
                      type="button"
                      className="auth-back-btn"
                      onClick={() => setSignupStep(1)}
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="auth-submit-btn auth-flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="auth-btn-content">
                          <RefreshCw size={16} className="auth-spinner" /> Verifying...
                        </span>
                      ) : (
                        <span className="auth-btn-content">
                          Verify & Launch Portal <CheckCircle2 size={16} />
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
