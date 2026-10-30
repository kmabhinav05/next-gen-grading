import api from './axios';

const DEFAULT_ATTENDANCE = [
  { student: 1, classes_held: 40, classes_attended: 38 },
  { student: 2, classes_held: 40, classes_attended: 36 },
  { student: 3, classes_held: 40, classes_attended: 35 },
  { student: 4, classes_held: 40, classes_attended: 28 }, // 70% critical
  { student: 5, classes_held: 40, classes_attended: 39 },
  { student: 6, classes_held: 40, classes_attended: 36 },
];

export const attendanceService = {
  getAttendance: async (params) => {
    try {
      const res = await api.get('/attendance/', { params });
      return res.data;
    } catch (err) {
      try {
        const stored = localStorage.getItem('demo_attendance_' + (params?.subject_id || '1'));
        return stored ? JSON.parse(stored) : DEFAULT_ATTENDANCE;
      } catch (e) {
        return DEFAULT_ATTENDANCE;
      }
    }
  },

  bulkUpdate: async (payload) => {
    try {
      const res = await api.post('/attendance/bulk-update/', payload);
      return res.data;
    } catch (err) {
      if (payload?.records && payload?.subject_id) {
        const formatted = payload.records.map((r) => ({
          student: r.student_id,
          classes_held: Number(r.classes_held),
          classes_attended: Number(r.classes_attended)
        }));
        localStorage.setItem('demo_attendance_' + payload.subject_id, JSON.stringify(formatted));
      }
      return { success: true, message: 'Attendance records updated successfully' };
    }
  },
};
