import api from './axios';

export const attendanceService = {
  getAttendance: async (params) => {
    const res = await api.get('/attendance/', { params });
    return res.data;
  },

  bulkUpdate: async (payload) => {
    const res = await api.post('/attendance/bulk-update/', payload);
    return res.data;
  },
};
