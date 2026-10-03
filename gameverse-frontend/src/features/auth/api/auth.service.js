import { api } from '../../../services/api';

export const authService = {
  /**
   * Register a new user using email and password.
   * @param {Object} data 
   * @param {string} data.email
   * @param {string} data.password
   * @returns {Promise<Object>} The API response
   */
  async registerWithEmail({ email, password }) {
    const response = await api.post('/auth/register/email', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Login an existing user using email and password.
   * @param {Object} data
   * @param {string} data.email
   * @param {string} data.password
   * @returns {Promise<Object>} The API response containing tokens and user data
   */
  async loginWithEmail({ email, password }) {
    const response = await api.post('/auth/login/email', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Verify TOTP code during login if 2FA is required.
   * @param {Object} data
   * @param {string} data.tempToken
   * @param {string} data.code
   * @returns {Promise<Object>}
   */
  async verifyTotpLogin({ tempToken, code }) {
    const response = await api.post('/auth/login/totp-verify', {
      tempToken,
      code
    });
    return response.data;
  },

  /**
   * Request an OTP for a mobile number.
   * @param {Object} data
   * @param {string} data.mobileNumber
   * @param {string} data.countryCode
   * @returns {Promise<Object>}
   */
  async requestMobileOtp({ mobileNumber, countryCode }) {
    const response = await api.post('/auth/mobile/send-otp', {
      mobile_number: mobileNumber,
      country_code: countryCode
    });
    return response.data;
  },

  /**
   * Verify an OTP for a mobile number.
   * @param {Object} data
   * @param {string} data.mobileNumber
   * @param {string} data.otp
   * @returns {Promise<Object>}
   */
  async verifyMobileOtp({ mobileNumber, otp }) {
    const response = await api.post('/auth/mobile/verify-otp', {
      mobile_number: mobileNumber,
      otp
    });
    return response.data;
  },

  /**
   * Login using Google OAuth ID token.
   * @param {Object} data
   * @param {string} data.idToken
   * @returns {Promise<Object>}
   */
  async loginWithGoogle({ idToken }) {
    const response = await api.post('/auth/oauth/google', {
      provider: 'google',
      id_token: idToken
    });
    return response.data;
  },

  /**
   * Link Google OAuth ID token to an existing account.
   * @param {Object} data
   * @param {string} data.idToken
   * @returns {Promise<Object>}
   */
  async linkGoogleAccount({ idToken }) {
    const response = await api.post('/auth/oauth/google/link', {
      provider: 'google',
      id_token: idToken
    });
    return response.data;
  },

  /**
   * Logout user and invalidate refresh token.
   * @param {string} refreshToken 
   * @returns {Promise<void>}
   */
  async logout(refreshToken) {
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
    }
  },

  /**
   * Verify email using a token.
   * ⚠️ MISSING BACKEND REQUIREMENT: There is currently no API endpoint defined for this 
   * in the official API Specification, Sitemap & Route.md. 
   * It defaults to hitting `POST /v1/auth/verify-email` which will 404 until implemented.
   * @param {string} token - The verification token from the URL
   * @returns {Promise<Object>}
   */
  async verifyEmailToken(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Check if a username is available.
   * @param {string} username - The username to check
   * @returns {Promise<{ available: boolean, username: string }>}
   */
  async checkUsername(username) {
    const response = await api.get('/auth/check-username', { params: { username } });
    return response.data.data; // { available: boolean, username: string }
  },

  /**
   * Update the current user's profile (including username).
   * @param {Object} data - Profile data to update (e.g. { username: "newUsername" })
   * @returns {Promise<Object>} Updated user object
   */
  async updateProfile(data) {
    const response = await api.put('/auth/me', data);
    return response.data.data;
  },

  /**
   * Complete the onboarding process.
   * @param {Object} data - Requires username, display_name, and onboarding_path
   * @returns {Promise<Object>} Contains redirect_to and onboarding_completed status
   */
  async completeOnboarding(data) {
    const response = await api.post('/auth/me/complete-onboarding', data);
    return response.data.data;
  },

  /**
   * Get all active sessions for the current user.
   */
  async getSessions() {
    const response = await api.get('/auth/sessions');
    return response.data.data;
  },

  /**
   * Terminate a specific session.
   */
  async terminateSession(sessionId) {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data.data;
  },

  /**
   * Terminate all other sessions except the current one.
   */
  async terminateOtherSessions(currentSessionId) {
    const response = await api.delete('/auth/sessions', {
      data: { current_session_id: currentSessionId }
    });
    return response.data.data;
  }
};
