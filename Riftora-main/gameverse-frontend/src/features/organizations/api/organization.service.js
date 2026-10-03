import { api } from '../../../services/api';

export const organizationService = {
  /**
   * Create a new organization.
   * @param {Object} data - The organization details (org_name, description, logo_url, website_url)
   * @returns {Promise<Object>} The created organization data (org_id, org_slug, etc)
   */
  async createOrganization(data) {
    const response = await api.post('/organizations', data);
    return response.data.data;
  },

  async getOrganization(orgId) {
    const response = await api.get(`/organizations/${orgId}`);
    return response.data.data;
  },

  async getOrganizationBySlug(orgSlug) {
    const response = await api.get(`/organizations/by-slug/${orgSlug}`);
    return response.data.data;
  },

  async getOrganizationBySubdomain(subdomain) {
    const response = await api.get(`/organizations/by-subdomain/${subdomain}`);
    return response.data.data;
  },

  async updateOrganizationSettings(orgId, data) {
    const response = await api.put(`/organizations/${orgId}/settings`, data);
    return response.data.data;
  },

  async updateMemberRole(orgId, userId, role, customRoleName) {
    const response = await api.put(`/organizations/${orgId}/members/${userId}/role`, { role, customRoleName });
    return response.data.data;
  },

  async removeMember(orgId, userId) {
    const response = await api.delete(`/organizations/${orgId}/members/${userId}`);
    return response.data.data;
  },

  async inviteUser(orgId, data) {
    const response = await api.post(`/organizations/${orgId}/invites`, data);
    return response.data.data;
  },

  async createJoinLink(orgId, data) {
    const response = await api.post(`/organizations/${orgId}/join-links`, data);
    return response.data.data;
  },

  async acceptInvite(token) {
    const response = await api.post(`/organizations/join/accept-invite/${token}`);
    return response.data.data;
  },

  async acceptJoinLink(token) {
    const response = await api.post(`/organizations/join/accept-link/${token}`);
    return response.data.data;
  },

  async getAuditLogs(orgId) {
    const response = await api.get(`/organizations/${orgId}/audit/role-changes`);
    return response.data.data;
  },

  async getMembers(orgId) {
    const response = await api.get(`/organizations/${orgId}/members`);
    return response.data.data;
  },

  async initiateOwnershipTransfer(orgId, toUserId) {
    const response = await api.post(`/organizations/${orgId}/ownership/transfer`, { toUserId });
    return response.data.data;
  },

  async acceptOwnershipTransfer(orgId, transferId) {
    const response = await api.post(`/organizations/${orgId}/ownership/transfer/${transferId}/accept`);
    return response.data.data;
  },

  async cancelOwnershipTransfer(orgId, transferId) {
    const response = await api.post(`/organizations/${orgId}/ownership/transfer/${transferId}/cancel`);
    return response.data.data;
  },

  async leaveOrganization(orgId) {
    const response = await api.delete(`/organizations/${orgId}/members/leave`);
    return response.data.data;
  },

  async getPlans() {
    const response = await api.get('/plans');
    return response.data.data;
  },

  async changePlan(orgId, planCode) {
    const response = await api.post(`/organizations/${orgId}/plans/change`, { planCode });
    return response.data.data;
  },

  async updateBrandKit(orgId, data) {
    const response = await api.put(`/organizations/${orgId}/brand-kit`, data);
    return response.data.data;
  },

  async uploadLogo(orgId, type, file) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);
    
    const response = await api.post(`/organizations/${orgId}/brand-kit/logos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  async getDashboardStats(orgId) {
    const { data } = await api.get(`/organizations/${orgId}/dashboard-stats`);
    return data.data;
  }
};
