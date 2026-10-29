import api from './axios';

export const reportsService = {
  getProgressCard: async (studentId) => {
    const res = await api.get(`/reports/progress-card/${studentId}/`);
    return res.data;
  },

  downloadProgressCardPdf: async (studentId) => {
    const res = await api.get(`/reports/progress-card/${studentId}/pdf/`, {
      responseType: 'blob',
    });
    return res;
  },

  getClassReport: async (params) => {
    const res = await api.get('/reports/class/', { params });
    return res.data;
  },

  downloadBulkPdf: async (payload) => {
    const res = await api.post('/reports/bulk-pdf/', payload, {
      responseType: 'blob',
    });
    return res;
  },
};
