import api from './axios';

export const marksService = {
  downloadTemplate: async (subjectId, assessment) => {
    const response = await api.get('/marks/template/', {
      params: { subject_id: subjectId, assessment },
      responseType: 'blob',
    });
    return response;
  },

  uploadPreview: async (formData) => {
    const response = await api.post('/marks/upload-preview/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadConfirm: async (payload) => {
    const response = await api.post('/marks/upload-confirm/', payload);
    return response.data;
  },

  getUploadLogs: async (params) => {
    const response = await api.get('/marks/logs/', { params });
    return response.data;
  },
};
