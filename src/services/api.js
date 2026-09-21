/**
 * FinTrack AI — Employer Dashboard Real Backend API Client
 * Connects directly to Node/Express/MongoDB backend with dynamic fallback to Cloud Run.
 */

const LOCAL_URL = 'http://localhost:5001/api/v1';
const CLOUD_RUN_URL = 'https://fintrack-backend-api-335711726164.asia-south1.run.app/api/v1';

let activeBaseUrl = LOCAL_URL;

export const resolveApiBaseUrl = async () => {
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

export const api = {
  getBaseUrl: () => activeBaseUrl,

  /**
   * Fetch all real claims submitted by employees from MongoDB
   */
  getClaims: async () => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/claims`);
    if (!res.ok) {
      throw new Error(`Failed to fetch claims: ${res.status}`);
    }
    const json = await res.json();
    return json.data?.claims || [];
  },

  /**
   * Update claim status (Approve, Reject with reason, or Mark as Paid)
   */
  updateClaimStatus: async (claimId, { status, adminNotes, rejectionReason }) => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/claims/${claimId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        adminNotes,
        rejectionReason,
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
   * Fetch all company employees registered in database
   */
  getEmployees: async () => {
    await resolveApiBaseUrl();
    const res = await fetch(`${activeBaseUrl}/employer/employees`);
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
};
