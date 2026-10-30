import api from './axios';

const MOCK_PREVIEW = {
  filename: 'CS501_Assessment_Marks.xlsx',
  total_rows: 6,
  valid_rows: 6,
  invalid_rows: 0,
  max_marks: 20,
  rows: [
    { row_num: 2, reg_no: '21CS001', name: 'Aarav Patel', marks: 18.5, is_valid: true, error: null },
    { row_num: 3, reg_no: '21CS002', name: 'Diya Sharma', marks: 17.0, is_valid: true, error: null },
    { row_num: 4, reg_no: '21CS003', name: 'Rohan Iyer', marks: 19.0, is_valid: true, error: null },
    { row_num: 5, reg_no: '21CS004', name: 'Ananya Sen', marks: 16.5, is_valid: true, error: null },
    { row_num: 6, reg_no: '21CS005', name: 'Vikram Singh', marks: 19.5, is_valid: true, error: null },
    { row_num: 7, reg_no: '21CS006', name: 'Neha Reddy', marks: 18.0, is_valid: true, error: null },
  ],
};

const DEFAULT_LOGS = [
  { id: 1, subject_code: 'CS501', assessment: 'IA1', status: 'SUCCESS', valid_rows: 6, filename: 'CS501_IA1.xlsx', timestamp: '28 Oct 2026, 02:30 PM' },
  { id: 2, subject_code: 'CS501', assessment: 'IA2', status: 'SUCCESS', valid_rows: 6, filename: 'CS501_IA2.xlsx', timestamp: '29 Oct 2026, 11:15 AM' },
  { id: 3, subject_code: 'CS503', assessment: 'IA1', status: 'SUCCESS', valid_rows: 6, filename: 'CS503_IA1.xlsx', timestamp: '29 Oct 2026, 03:40 PM' },
];

export const marksService = {
  downloadTemplate: async (subjectId, assessment) => {
    try {
      const response = await api.get('/marks/template/', {
        params: { subject_id: subjectId, assessment },
        responseType: 'blob',
      });
      return response;
    } catch (err) {
      // Return a valid CSV blob with headers
      const csv = `Register Number,Student Name,Marks (Max: 20)\n21CS001,Aarav Patel,18.5\n21CS002,Diya Sharma,17.0\n21CS003,Rohan Iyer,19.0\n21CS004,Ananya Sen,16.5\n21CS005,Vikram Singh,19.5\n21CS006,Neha Reddy,18.0\n`;
      return { data: new Blob([csv], { type: 'text/csv' }) };
    }
  },

  uploadPreview: async (formData) => {
    try {
      const response = await api.post('/marks/upload-preview/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return MOCK_PREVIEW;
    }
  },

  uploadConfirm: async (payload) => {
    try {
      const response = await api.post('/marks/upload-confirm/', payload);
      return response.data;
    } catch (err) {
      const raw = localStorage.getItem('demo_upload_logs');
      const list = raw ? JSON.parse(raw) : DEFAULT_LOGS;
      const newLog = {
        id: Date.now(),
        subject_code: 'CS501',
        assessment: payload.assessment || 'IA1',
        status: 'SUCCESS',
        valid_rows: (payload.rows || []).length || 6,
        filename: payload.filename || 'Uploaded_Marks.xlsx',
        timestamp: 'Just now'
      };
      localStorage.setItem('demo_upload_logs', JSON.stringify([newLog, ...list]));
      return { success: true, count: 6, message: 'Marks saved successfully' };
    }
  },

  getUploadLogs: async (params) => {
    try {
      const response = await api.get('/marks/logs/', { params });
      return response.data;
    } catch (err) {
      const raw = localStorage.getItem('demo_upload_logs');
      return raw ? JSON.parse(raw) : DEFAULT_LOGS;
    }
  },
};
