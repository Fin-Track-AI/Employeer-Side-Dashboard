/**
 * FinTrack AI — Employer Dashboard Real Backend API Client
 * Connects directly to Node/Express/MongoDB backend with dynamic fallback to Cloud Run.
 */

const LOCAL_URL = 'http://localhost:5001/api/v1';
const CLOUD_RUN_URL = 'https://fintrack-backend-api-335711726164.asia-south1.run.app/api/v1';

const ENV_API_URL = import.meta.env?.VITE_API_URL;
const FORCE_DEPLOYED = import.meta.env?.VITE_USE_DEPLOYED_BACKEND === 'true';

let activeBaseUrl = ENV_API_URL || (FORCE_DEPLOYED ? CLOUD_RUN_URL : LOCAL_URL);

export const resolveApiBaseUrl = async () => {
  if (ENV_API_URL) {
    activeBaseUrl = ENV_API_URL;
    return activeBaseUrl;
  }
  if (FORCE_DEPLOYED) {
    activeBaseUrl = CLOUD_RUN_URL;
    return activeBaseUrl;
  }
  try {
    const res = await fetch(`${LOCAL_URL}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      activeBaseUrl = LOCAL_URL;
      return activeBaseUrl;
    }
  } catch (_) {
    // Local unavailable, use Cloud Run
  }
  activeBaseUrl = CLOUD_RUN_URL;
  return activeBaseUrl;
};

export const getAuthHeaders = () => {
  try {
    const raw =
      localStorage.getItem('fintrack_employer_auth_v1') ||
      localStorage.getItem('fintrack_employer_auth_session');
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.token) {
        return {
          Authorization: `Bearer ${session.token}`,
          ...(session.company?.id ? { 'X-Company-Id': session.company.id } : {}),
        };
      }
    }
  } catch (_) {}
  return {};
};

export const api = {
  getBaseUrl: () => activeBaseUrl,

  /**
   * Fetch real claims submitted by employees from MongoDB, filtered by company tenant
   */
  getClaims: async (companyId, companyName) => {
    await resolveApiBaseUrl();
    const queryParams = new URLSearchParams();
    if (companyId) queryParams.set('companyId', companyId);
    if (companyName) queryParams.set('companyName', companyName);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const res = await fetch(`${activeBaseUrl}/claims${queryString}`, {
      headers: {
        ...getAuthHeaders(),
        ...(companyId ? { 'X-Company-Id': companyId } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch claims: ${res.status}`);
    }
    const json = await res.json();
    return json.data?.claims || [];
  },

  /**
   * Update claim status (Approve, Reject with reason, or Mark as Paid)
   */
  updateClaimStatus: async (claimId, { status, adminNotes, rejectionReason, note }) => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/claims/${claimId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        status,
        adminNotes: adminNotes || note,
        rejectionReason,
        note: note || adminNotes || rejectionReason,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Failed to update claim ${claimId}`);
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch company employees registered in database, filtered by company tenant
   */
  getEmployees: async (companyId, companyName) => {
    await resolveApiBaseUrl();
    const queryParams = new URLSearchParams();
    if (companyId) queryParams.set('companyId', companyId);
    if (companyName) queryParams.set('companyName', companyName);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const res = await fetch(`${activeBaseUrl}/employer/employees${queryString}`, {
      headers: {
        ...getAuthHeaders(),
        ...(companyId ? { 'X-Company-Id': companyId } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch employees: ${res.status}`);
    }
    const json = await res.json();
    return json.data?.employees || [];
  },

  /**
   * Submit a new claim (direct API bridge from mobile / web)
   */
  submitClaim: async (claimData, authToken) => {
    await resolveApiBaseUrl();
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${activeBaseUrl}/claims`, {
      method: 'POST',
      headers,
      body: JSON.stringify(claimData),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to submit claim');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Generate employee invite code from Employer Dashboard
   */
  generateInviteCode: async (inviteData) => {
    await resolveApiBaseUrl();
    try {
      const res = await fetch(`${activeBaseUrl}/employer/invites/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(inviteData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate invite code');
      }
      return data.data;
    } catch (err) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      console.warn('Backend generateInviteCode fallback:', err.message);
      // Fallback local code generation if backend unreachable
      const prefix = (inviteData.companyName || 'TC').slice(0, 3).toUpperCase();
      const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      return {
        code,
        companyId: inviteData.companyId || 'COMP-01',
        companyName: inviteData.companyName || 'TechCorp Solutions India',
        department: inviteData.department || 'Engineering',
        monthlyAllowance: Number(inviteData.monthlyAllowance) || 25000,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
  },

  /**
   * Fetch invite codes for company
   */
  getInviteCodes: async (companyId) => {
    await resolveApiBaseUrl();
    try {
      const url = companyId
        ? `${activeBaseUrl}/employer/invites?companyId=${encodeURIComponent(companyId)}`
        : `${activeBaseUrl}/employer/invites`;
      const res = await fetch(url, {
        headers: {
          ...getAuthHeaders(),
          ...(companyId ? { 'X-Company-Id': companyId } : {}),
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch invite codes');
      }
      const data = await res.json();
      return data.data?.invites || [];
    } catch (err) {
      console.warn('Backend getInviteCodes notice:', err.message);
      return [];
    }
  },

  /**
   * Send 6-digit OTP to work email
   */
  sendOtp: async (email) => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to dispatch verification code');
    }
    return data;
  },

  /**
   * Verify email OTP
   */
  verifyOtp: async (email, otp, name, phone) => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        otp: otp.toString().trim(),
        name,
        phone,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Invalid or expired verification code');
    }
    return data.data;
  },

  /**
   * Sign in with email and password
   */
  login: async ({ email, password, name, phone }) => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Invalid email or password');
    }
    return data.data;
  },

  /**
   * Register new employer account
   */
  register: async (userData) => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data.data;
  },
};
