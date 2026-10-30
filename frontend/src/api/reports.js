import api from './axios';

const MOCK_CARD = {
  student: {
    id: 1,
    name: 'Aarav Patel',
    reg_no: '21CS001',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A'
  },
  subjects: [
    {
      id: 1,
      code: 'CS501',
      name: 'Database Management Systems',
      staff_name: 'Prof. Ramesh Sharma',
      ia1: 18.5,
      ia2: 19.0,
      ia3: null,
      total_ia: 37.5,
      max_total_ia: 40,
      classes_held: 38,
      classes_attended: 36,
      attendance_percentage: 94.7
    },
    {
      id: 2,
      code: 'CS502',
      name: 'Operating Systems',
      staff_name: 'Prof. Priya Verma',
      ia1: 17.0,
      ia2: 16.5,
      ia3: null,
      total_ia: 33.5,
      max_total_ia: 40,
      classes_held: 36,
      classes_attended: 32,
      attendance_percentage: 88.9
    },
    {
      id: 3,
      code: 'CS503',
      name: 'Computer Networks',
      staff_name: 'Prof. Ramesh Sharma',
      ia1: 19.0,
      ia2: 20.0,
      ia3: null,
      total_ia: 39.0,
      max_total_ia: 40,
      classes_held: 40,
      classes_attended: 39,
      attendance_percentage: 97.5
    },
    {
      id: 4,
      code: 'CS504',
      name: 'Software Engineering',
      staff_name: 'Prof. Priya Verma',
      ia1: 16.0,
      ia2: 17.5,
      ia3: null,
      total_ia: 33.5,
      max_total_ia: 40,
      classes_held: 34,
      classes_attended: 31,
      attendance_percentage: 91.2
    }
  ],
  summary: {
    total_obtained: 143.5,
    total_max: 160,
    percentage: 89.7,
    overall_attendance_percentage: 93.1,
    overall_attendance_status: 'GOOD',
    remarks: 'Commendable performance across all course assessments. Consistently high attendance maintained.'
  }
};

const MOCK_CLASS_STUDENTS = [
  { id: 1, reg_no: '21CS001', name: 'Aarav Patel', overall_marks_percentage: 89.7, overall_attendance_percentage: 93.1, weak_subjects_count: 0 },
  { id: 2, reg_no: '21CS002', name: 'Diya Sharma', overall_marks_percentage: 84.5, overall_attendance_percentage: 91.4, weak_subjects_count: 0 },
  { id: 3, reg_no: '21CS003', name: 'Rohan Iyer', overall_marks_percentage: 78.2, overall_attendance_percentage: 86.8, weak_subjects_count: 0 },
  { id: 4, reg_no: '21CS004', name: 'Ananya Sen', overall_marks_percentage: 72.0, overall_attendance_percentage: 71.5, weak_subjects_count: 1 },
  { id: 5, reg_no: '21CS005', name: 'Vikram Singh', overall_marks_percentage: 91.2, overall_attendance_percentage: 96.0, weak_subjects_count: 0 },
  { id: 6, reg_no: '21CS006', name: 'Neha Reddy', overall_marks_percentage: 82.5, overall_attendance_percentage: 88.0, weak_subjects_count: 0 },
];

export const reportsService = {
  getProgressCard: async (studentId) => {
    try {
      const res = await api.get(`/reports/progress-card/${studentId}/`);
      return res.data;
    } catch (err) {
      return MOCK_CARD;
    }
  },

  downloadProgressCardPdf: async (studentId) => {
    try {
      const res = await api.get(`/reports/progress-card/${studentId}/pdf/`, {
        responseType: 'blob',
      });
      return res;
    } catch (err) {
      const dummyPdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000097 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF`;
      return { data: new Blob([dummyPdfContent], { type: 'application/pdf' }) };
    }
  },

  getClassReport: async (params) => {
    try {
      const res = await api.get('/reports/class/', { params });
      return res.data;
    } catch (err) {
      return MOCK_CLASS_STUDENTS;
    }
  },

  downloadBulkPdf: async (payload) => {
    try {
      const res = await api.post('/reports/bulk-pdf/', payload, {
        responseType: 'blob',
      });
      return res;
    } catch (err) {
      const dummyPdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000097 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF`;
      return { data: new Blob([dummyPdfContent], { type: 'application/pdf' }) };
    }
  },
};
