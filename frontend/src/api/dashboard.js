import api from './axios';

const MOCK_STUDENT_CARD = {
  student: {
    id: 3,
    name: 'Ayaan Khan',
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
    overall_attendance_percentage: 93.1
  }
};

export const dashboardService = {
  getStats: async () => {
    try {
      const res = await api.get('/dashboard/stats/');
      return res.data;
    } catch (err) {
      // Fallback based on logged-in user role
      const rawUser = localStorage.getItem('demo_user');
      const role = rawUser ? JSON.parse(rawUser).role : 'ADMIN';

      if (role === 'STAFF') {
        return {
          role: 'STAFF',
          staff_name: 'Arjun Menon',
          department: 'Computer Science & Engineering',
          assigned_subjects: [
            {
              id: 1,
              code: 'CS501',
              name: 'Database Management Systems',
              semester: 5,
              enrolled_students: 6,
              marks_status: { IA1: 'Completed', IA2: 'Completed', IA3: 'Pending' }
            },
            {
              id: 3,
              code: 'CS503',
              name: 'Computer Networks',
              semester: 5,
              enrolled_students: 6,
              marks_status: { IA1: 'Completed', IA2: 'Completed', IA3: 'Pending' }
            }
          ],
          recent_logs: [
            { id: 1, subject_code: 'CS501', assessment: 'IA1', status: 'SUCCESS', valid_rows: 6, timestamp: '28 Oct, 14:30' },
            { id: 2, subject_code: 'CS501', assessment: 'IA2', status: 'SUCCESS', valid_rows: 6, timestamp: '29 Oct, 11:15' },
            { id: 3, subject_code: 'CS503', assessment: 'IA1', status: 'SUCCESS', valid_rows: 6, timestamp: '29 Oct, 15:40' }
          ]
        };
      }

      if (role === 'STUDENT') {
        return {
          role: 'STUDENT',
          progress_card: MOCK_STUDENT_CARD
        };
      }

      if (role === 'PARENT') {
        return {
          role: 'PARENT',
          children: [MOCK_STUDENT_CARD]
        };
      }

      // Default: ADMIN
      return {
        role: 'ADMIN',
        counts: {
          students: 6,
          staff: 2,
          subjects: 4,
          semesters: 2,
          critical_attendance_records: 1
        },
        recent_uploads: [
          { id: 1, subject_code: 'CS501', assessment: 'IA1', staff_name: 'Ramesh Sharma', status: 'SUCCESS', valid_rows: 6, timestamp: '28 Oct 2026, 02:30 PM' },
          { id: 2, subject_code: 'CS502', assessment: 'IA1', staff_name: 'Priya Verma', status: 'SUCCESS', valid_rows: 6, timestamp: '28 Oct 2026, 04:15 PM' },
          { id: 3, subject_code: 'CS503', assessment: 'IA2', staff_name: 'Ramesh Sharma', status: 'SUCCESS', valid_rows: 6, timestamp: '29 Oct 2026, 11:00 AM' }
        ]
      };
    }
  },
};

