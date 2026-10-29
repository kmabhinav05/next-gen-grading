import api from './axios';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats/');
    return res.data;
  },
};
