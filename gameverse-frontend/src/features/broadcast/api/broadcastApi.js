import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/broadcast/configs';

export const broadcastApi = {
  getTournamentStreams: async (tournamentId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/tournament/${tournamentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  createStreamConfig: async (configData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(BASE_URL, configData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  getYoutubeIntegration: async (orgId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/v1/organizations/${orgId}/broadcast/youtube`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  connectYoutube: async ({ orgId, authorizationCode, redirectUri }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:8080/api/v1/organizations/${orgId}/broadcast/youtube/connect`, {
      authorizationCode,
      redirectUri
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  disconnectYoutube: async (orgId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:8080/api/v1/organizations/${orgId}/broadcast/youtube/disconnect`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  }
};
