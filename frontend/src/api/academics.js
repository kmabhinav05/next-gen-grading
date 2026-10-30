import api from './axios';

// Default mock datasets for standalone cloud preview
const DEFAULT_SEMESTERS = [
  { id: 1, number: 5, academic_year: '2026-2027', is_active: true },
  { id: 2, number: 6, academic_year: '2026-2027', is_active: false },
];

const DEFAULT_STAFF = [
  {
    id: 1,
    user: { id: 2, username: 'staff_sharma', first_name: 'Ramesh', last_name: 'Sharma', email: 'r.sharma@college.edu', phone_number: '+91 9876500001' },
    full_name: 'Prof. Ramesh Sharma',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor'
  },
  {
    id: 2,
    user: { id: 5, username: 'staff_verma', first_name: 'Priya', last_name: 'Verma', email: 'p.verma@college.edu', phone_number: '+91 9876500002' },
    full_name: 'Prof. Priya Verma',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor'
  }
];

const DEFAULT_SUBJECTS = [
  { id: 1, code: 'CS501', name: 'Database Management Systems', semester: 1, semester_number: 5, staff: 1, staff_name: 'Prof. Ramesh Sharma', max_internal_marks: 50 },
  { id: 2, code: 'CS502', name: 'Operating Systems', semester: 1, semester_number: 5, staff: 2, staff_name: 'Prof. Priya Verma', max_internal_marks: 50 },
  { id: 3, code: 'CS503', name: 'Computer Networks', semester: 1, semester_number: 5, staff: 1, staff_name: 'Prof. Ramesh Sharma', max_internal_marks: 50 },
  { id: 4, code: 'CS504', name: 'Software Engineering', semester: 1, semester_number: 5, staff: 2, staff_name: 'Prof. Priya Verma', max_internal_marks: 50 },
];

const DEFAULT_STUDENTS = [
  { id: 1, reg_no: '21CS001', full_name: 'Aarav Patel', department: 'Computer Science & Engineering', semester: 1, semester_number: 5, section: 'A', email: 'aarav@student.edu', phone_number: '+91 990001001' },
  { id: 2, reg_no: '21CS002', full_name: 'Diya Sharma', department: 'Computer Science & Engineering', semester: 1, semester_number: 5, section: 'A', email: 'diya@student.edu', phone_number: '+91 990001002' },
  { id: 3, reg_no: '21CS003', full_name: 'Rohan Iyer', department: 'Computer Science & Engineering', semester: 1, semester_number: 5, section: 'A', email: 'rohan@student.edu', phone_number: '+91 990001003' },
  { id: 4, reg_no: '21CS004', full_name: 'Ananya Sen', department: 'Computer Science & Engineering', semester: 1, semester_number: 5, section: 'A', email: 'ananya@student.edu', phone_number: '+91 990001004' },
  { id: 5, reg_no: '21CS005', full_name: 'Vikram Singh', department: 'Computer Science & Engineering', semester: 1, semester_number: 5, section: 'A', email: 'vikram@student.edu', phone_number: '+91 990001005' },
  { id: 6, reg_no: '21CS006', full_name: 'Neha Reddy', department: 'Computer Science & Engineering', semester: 1, semester_number: 5, section: 'A', email: 'neha@student.edu', phone_number: '+91 990001006' },
];

const DEFAULT_PARENTS = [
  { id: 1, user: { id: 7, username: 'parent_patel', email: 'suresh.patel@gmail.com', first_name: 'Suresh', last_name: 'Patel', phone_number: '+91 9822114455' }, full_name: 'Suresh Patel', relationship: 'Father', linked_children: ['Aarav Patel (21CS001)'] },
  { id: 2, user: { id: 8, username: 'parent_sen', email: 'alok.sen@gmail.com', first_name: 'Alok', last_name: 'Sen', phone_number: '+91 9822114466' }, full_name: 'Alok Sen', relationship: 'Father', linked_children: ['Ananya Sen (21CS004)'] },
];

const getStored = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem('demo_' + key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem('demo_' + key, JSON.stringify(val));
  } catch (e) {}
};

export const academicsService = {
  // Semesters
  getSemesters: async () => {
    try {
      const res = await api.get('/semesters/');
      return res.data;
    } catch (err) {
      return getStored('semesters', DEFAULT_SEMESTERS);
    }
  },
  createSemester: async (data) => {
    try {
      const res = await api.post('/semesters/', data);
      return res.data;
    } catch (err) {
      const list = getStored('semesters', DEFAULT_SEMESTERS);
      const newItem = { id: Date.now(), ...data };
      setStored('semesters', [...list, newItem]);
      return newItem;
    }
  },
  deleteSemester: async (id) => {
    try {
      const res = await api.delete(`/semesters/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('semesters', DEFAULT_SEMESTERS);
      setStored('semesters', list.filter((i) => i.id !== id));
      return { success: true };
    }
  },

  // Subjects
  getSubjects: async (params) => {
    try {
      const res = await api.get('/subjects/', { params });
      return res.data;
    } catch (err) {
      return getStored('subjects', DEFAULT_SUBJECTS);
    }
  },
  createSubject: async (data) => {
    try {
      const res = await api.post('/subjects/', data);
      return res.data;
    } catch (err) {
      const list = getStored('subjects', DEFAULT_SUBJECTS);
      const newItem = { id: Date.now(), ...data };
      setStored('subjects', [...list, newItem]);
      return newItem;
    }
  },
  updateSubject: async (id, data) => {
    try {
      const res = await api.put(`/subjects/${id}/`, data);
      return res.data;
    } catch (err) {
      const list = getStored('subjects', DEFAULT_SUBJECTS);
      const updated = list.map((i) => (i.id === id ? { ...i, ...data } : i));
      setStored('subjects', updated);
      return { id, ...data };
    }
  },
  deleteSubject: async (id) => {
    try {
      const res = await api.delete(`/subjects/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('subjects', DEFAULT_SUBJECTS);
      setStored('subjects', list.filter((i) => i.id !== id));
      return { success: true };
    }
  },

  // Staff
  getStaff: async (params) => {
    try {
      const res = await api.get('/staff/', { params });
      return res.data;
    } catch (err) {
      return getStored('staff', DEFAULT_STAFF);
    }
  },
  createStaff: async (data) => {
    try {
      const res = await api.post('/staff/', data);
      return res.data;
    } catch (err) {
      const list = getStored('staff', DEFAULT_STAFF);
      const newItem = {
        id: Date.now(),
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username,
        department: data.department || 'Computer Science & Engineering',
        designation: data.designation || 'Faculty Member',
        user: { id: Date.now(), ...data }
      };
      setStored('staff', [...list, newItem]);
      return newItem;
    }
  },
  updateStaff: async (id, data) => {
    try {
      const res = await api.put(`/staff/${id}/`, data);
      return res.data;
    } catch (err) {
      const list = getStored('staff', DEFAULT_STAFF);
      const updated = list.map((i) => (i.id === id ? { ...i, ...data } : i));
      setStored('staff', updated);
      return { id, ...data };
    }
  },
  deleteStaff: async (id) => {
    try {
      const res = await api.delete(`/staff/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('staff', DEFAULT_STAFF);
      setStored('staff', list.filter((i) => i.id !== id));
      return { success: true };
    }
  },

  // Students
  getStudents: async (params) => {
    try {
      const res = await api.get('/students/', { params });
      return res.data;
    } catch (err) {
      const students = getStored('students', DEFAULT_STUDENTS);
      return { count: students.length, results: students };
    }
  },
  createStudent: async (data) => {
    try {
      const res = await api.post('/students/', data);
      return res.data;
    } catch (err) {
      const list = getStored('students', DEFAULT_STUDENTS);
      const newItem = {
        id: Date.now(),
        reg_no: data.reg_no,
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username,
        department: data.department || 'Computer Science & Engineering',
        semester: Number(data.semester) || 1,
        semester_number: 5,
        section: data.section || 'A',
        email: data.email,
        phone_number: data.phone_number
      };
      setStored('students', [...list, newItem]);
      return newItem;
    }
  },
  updateStudent: async (id, data) => {
    try {
      const res = await api.put(`/students/${id}/`, data);
      return res.data;
    } catch (err) {
      const list = getStored('students', DEFAULT_STUDENTS);
      const updated = list.map((i) => (i.id === id ? { ...i, ...data } : i));
      setStored('students', updated);
      return { id, ...data };
    }
  },
  deleteStudent: async (id) => {
    try {
      const res = await api.delete(`/students/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('students', DEFAULT_STUDENTS);
      setStored('students', list.filter((i) => i.id !== id));
      return { success: true };
    }
  },

  // Parents
  getParents: async (params) => {
    try {
      const res = await api.get('/parents/', { params });
      return res.data;
    } catch (err) {
      return getStored('parents', DEFAULT_PARENTS);
    }
  },
  createParent: async (data) => {
    try {
      const res = await api.post('/parents/', data);
      return res.data;
    } catch (err) {
      const list = getStored('parents', DEFAULT_PARENTS);
      const newItem = {
        id: Date.now(),
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username,
        relationship: data.relationship || 'Guardian',
        user: { id: Date.now(), ...data },
        linked_children: []
      };
      setStored('parents', [...list, newItem]);
      return newItem;
    }
  },
  deleteParent: async (id) => {
    try {
      const res = await api.delete(`/parents/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('parents', DEFAULT_PARENTS);
      setStored('parents', list.filter((i) => i.id !== id));
      return { success: true };
    }
  },

  // Parent-Student Link
  getParentStudentLinks: async (params) => {
    try {
      const res = await api.get('/parent-student/', { params });
      return res.data;
    } catch (err) {
      return [
        { id: 1, parent: 1, parent_name: 'Suresh Patel', student: 1, student_name: 'Aarav Patel', student_reg: '21CS001' },
        { id: 2, parent: 2, parent_name: 'Alok Sen', student: 4, student_name: 'Ananya Sen', student_reg: '21CS004' }
      ];
    }
  },
  linkParentStudent: async (data) => {
    try {
      const res = await api.post('/parent-student/', data);
      return res.data;
    } catch (err) {
      return { id: Date.now(), ...data };
    }
  },
  unlinkParentStudent: async (id) => {
    try {
      const res = await api.delete(`/parent-student/${id}/`);
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },
};
