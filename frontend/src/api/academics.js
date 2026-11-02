import api from './axios';
import { registerCustomUser, removeCustomUser } from './auth';

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
    const rawUsername = (data.username || 'staff').trim().toLowerCase();
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || rawUsername;
    const dept = data.department || 'Computer Science & Engineering';
    const designation = data.designation || 'Faculty Member';
    const email = data.email?.trim() || `${rawUsername}@college.edu`;
    const password = data.password?.trim() || 'staff123';
    const phone = data.phone_number?.trim() || '';
    const newId = Date.now();

    const staffRecord = {
      id: newId,
      user: { id: newId, username: rawUsername, email, first_name: firstName, last_name: lastName, phone_number: phone },
      username: rawUsername,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      department: dept,
      designation,
      email,
      phone_number: phone,
      password
    };

    const userAccount = {
      id: newId,
      username: rawUsername,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone_number: phone,
      role: 'STAFF',
      password,
      staff: {
        id: newId,
        department: dept,
        designation
      }
    };

    registerCustomUser(userAccount);

    try {
      const res = await api.post('/staff/', data);
      return res.data;
    } catch (err) {
      const list = getStored('staff', DEFAULT_STAFF);
      const updatedList = list.filter((s) => (s.user?.username || s.username)?.toLowerCase() !== rawUsername);
      updatedList.push(staffRecord);
      setStored('staff', updatedList);
      return staffRecord;
    }
  },
  updateStaff: async (id, data) => {
    const rawUsername = (data.username || 'staff').trim().toLowerCase();
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || rawUsername;
    const dept = data.department || 'Computer Science & Engineering';
    const designation = data.designation || 'Faculty Member';
    const email = data.email?.trim() || `${rawUsername}@college.edu`;
    const phone = data.phone_number?.trim() || '';

    const userAccount = {
      id,
      username: rawUsername,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone_number: phone,
      role: 'STAFF',
      ...(data.password ? { password: data.password.trim() } : {}),
      staff: {
        id,
        department: dept,
        designation
      }
    };
    registerCustomUser(userAccount);

    try {
      const res = await api.put(`/staff/${id}/`, data);
      return res.data;
    } catch (err) {
      const list = getStored('staff', DEFAULT_STAFF);
      const updated = list.map((i) =>
        i.id === id
          ? {
              ...i,
              ...data,
              full_name: fullName,
              user: { ...(i.user || {}), username: rawUsername, first_name: firstName, last_name: lastName, email, phone_number: phone }
            }
          : i
      );
      setStored('staff', updated);
      return { id, ...data };
    }
  },
  deleteStaff: async (id) => {
    removeCustomUser({ id });
    try {
      const res = await api.delete(`/staff/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('staff', DEFAULT_STAFF);
      const staffMember = list.find((s) => s.id === id);
      if (staffMember) {
        removeCustomUser({ username: staffMember.username || staffMember.user?.username, id });
      }
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
    const rawUsername = (data.username || data.reg_no || 'student').trim().toLowerCase();
    const regNo = (data.reg_no || '').trim().toUpperCase();
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || data.username || regNo;
    const semNum = Number(data.semester_number || data.semester) || 5;
    const sec = (data.section || 'A').toUpperCase().trim();
    const dept = data.department || 'Computer Science & Engineering';
    const email = data.email?.trim() || `${rawUsername}@student.edu`;
    const password = data.password?.trim() || 'student123';
    const phone = data.phone_number?.trim() || '';
    const newId = Date.now();

    const studentRecord = {
      id: newId,
      username: rawUsername,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      reg_no: regNo,
      department: dept,
      semester: Number(data.semester) || 1,
      semester_number: semNum,
      section: sec,
      email,
      phone_number: phone,
      password
    };

    const userAccount = {
      id: newId,
      username: rawUsername,
      reg_no: regNo,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone_number: phone,
      role: 'STUDENT',
      password,
      student: {
        id: newId,
        reg_no: regNo,
        department: dept,
        semester: Number(data.semester) || 1,
        semester_number: semNum,
        section: sec,
      }
    };

    // Always register in custom users store for demo credentials
    registerCustomUser(userAccount);

    try {
      const res = await api.post('/students/', data);
      if (res.data?.id) {
        studentRecord.id = res.data.id;
        userAccount.id = res.data.user_id || res.data.id;
        if (userAccount.student) userAccount.student.id = res.data.id;
        registerCustomUser(userAccount);
      }
      return res.data;
    } catch (err) {
      const list = getStored('students', DEFAULT_STUDENTS);
      const updatedList = list.filter((s) => s.reg_no?.toUpperCase() !== regNo);
      updatedList.push(studentRecord);
      setStored('students', updatedList);
      return studentRecord;
    }
  },
  updateStudent: async (id, data) => {
    const rawUsername = (data.username || data.reg_no || 'student').trim().toLowerCase();
    const regNo = (data.reg_no || '').trim().toUpperCase();
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || data.username || regNo;
    const semNum = Number(data.semester_number || data.semester) || 5;
    const sec = (data.section || 'A').toUpperCase().trim();
    const dept = data.department || 'Computer Science & Engineering';
    const email = data.email?.trim() || `${rawUsername}@student.edu`;
    const phone = data.phone_number?.trim() || '';

    const userAccount = {
      id,
      username: rawUsername,
      reg_no: regNo,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone_number: phone,
      role: 'STUDENT',
      ...(data.password ? { password: data.password.trim() } : {}),
      student: {
        id,
        reg_no: regNo,
        department: dept,
        semester: Number(data.semester) || 1,
        semester_number: semNum,
        section: sec,
      }
    };
    registerCustomUser(userAccount);

    try {
      const res = await api.put(`/students/${id}/`, data);
      return res.data;
    } catch (err) {
      const list = getStored('students', DEFAULT_STUDENTS);
      const updated = list.map((i) =>
        i.id === id
          ? {
              ...i,
              ...data,
              reg_no: regNo,
              username: rawUsername,
              first_name: firstName,
              last_name: lastName,
              full_name: fullName,
              department: dept,
              semester: Number(data.semester) || i.semester || 1,
              semester_number: semNum,
              section: sec,
              email,
              phone_number: phone,
              ...(data.password ? { password: data.password.trim() } : {})
            }
          : i
      );
      setStored('students', updated);
      return { id, ...data };
    }
  },
  deleteStudent: async (id) => {
    removeCustomUser({ id });
    try {
      const res = await api.delete(`/students/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('students', DEFAULT_STUDENTS);
      const student = list.find((s) => s.id === id);
      if (student) {
        removeCustomUser({ reg_no: student.reg_no, username: student.username, id });
      }
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
    const rawUsername = (data.username || 'parent').trim().toLowerCase();
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || rawUsername;
    const relationship = data.relationship || 'Guardian';
    const email = data.email?.trim() || `${rawUsername}@gmail.com`;
    const password = data.password?.trim() || 'parent123';
    const phone = data.phone_number?.trim() || '';
    const newId = Date.now();

    const parentRecord = {
      id: newId,
      full_name: fullName,
      relationship,
      user: { id: newId, username: rawUsername, email, first_name: firstName, last_name: lastName, phone_number: phone },
      username: rawUsername,
      email,
      phone_number: phone,
      password,
      linked_children: []
    };

    const userAccount = {
      id: newId,
      username: rawUsername,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone_number: phone,
      role: 'PARENT',
      password,
      parent: {
        id: newId,
        relationship
      }
    };

    registerCustomUser(userAccount);

    try {
      const res = await api.post('/parents/', data);
      return res.data;
    } catch (err) {
      const list = getStored('parents', DEFAULT_PARENTS);
      const updatedList = list.filter((p) => (p.user?.username || p.username)?.toLowerCase() !== rawUsername);
      updatedList.push(parentRecord);
      setStored('parents', updatedList);
      return parentRecord;
    }
  },
  updateParent: async (id, data) => {
    const rawUsername = (data.username || 'parent').trim().toLowerCase();
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || rawUsername;
    const relationship = data.relationship || 'Guardian';
    const email = data.email?.trim() || `${rawUsername}@gmail.com`;
    const phone = data.phone_number?.trim() || '';

    const userAccount = {
      id,
      username: rawUsername,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone_number: phone,
      role: 'PARENT',
      ...(data.password ? { password: data.password.trim() } : {}),
      parent: {
        id,
        relationship
      }
    };
    registerCustomUser(userAccount);

    try {
      const res = await api.put(`/parents/${id}/`, data);
      return res.data;
    } catch (err) {
      const list = getStored('parents', DEFAULT_PARENTS);
      const updated = list.map((i) =>
        i.id === id
          ? {
              ...i,
              ...data,
              full_name: fullName,
              relationship,
              user: { ...(i.user || {}), username: rawUsername, first_name: firstName, last_name: lastName, email, phone_number: phone }
            }
          : i
      );
      setStored('parents', updated);
      return { id, ...data };
    }
  },
  deleteParent: async (id) => {
    removeCustomUser({ id });
    try {
      const res = await api.delete(`/parents/${id}/`);
      return res.data;
    } catch (err) {
      const list = getStored('parents', DEFAULT_PARENTS);
      const parentItem = list.find((p) => p.id === id);
      if (parentItem) {
        removeCustomUser({ username: parentItem.username || parentItem.user?.username, id });
      }
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
