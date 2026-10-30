import api from './axios';

// Offline demo credentials fallback for standalone Vercel preview
const DEMO_USERS = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'admin@college.edu',
    full_name: 'Meera Nair',
    role: 'ADMIN',
    phone_number: '+91 9876543210'
  },
  staff1: {
    id: 2,
    username: 'staff1',
    email: 'staff1@college.edu',
    full_name: 'Arjun Menon',
    role: 'STAFF',
    phone_number: '+91 9876500099',
    staff: { id: 1, department: 'Computer Science & Engineering', designation: 'Senior Teacher' }
  },
  staff_sharma: {
    id: 2,
    username: 'staff_sharma',
    email: 'staff1@college.edu',
    full_name: 'Arjun Menon',
    role: 'STAFF',
    phone_number: '+91 9876500099',
    staff: { id: 1, department: 'Computer Science & Engineering', designation: 'Senior Teacher' }
  },
  student1: {
    id: 3,
    username: 'student1',
    email: 'student1@college.edu',
    full_name: 'Ayaan Khan',
    role: 'STUDENT',
    phone_number: '+91 990001001',
    student: { id: 1, reg_no: '21CS001', department: 'Computer Science & Engineering', semester: 5, section: 'A' }
  },
  student: {
    id: 3,
    username: 'student1',
    email: 'student1@college.edu',
    full_name: 'Ayaan Khan',
    role: 'STUDENT',
    phone_number: '+91 990001001',
    student: { id: 1, reg_no: '21CS001', department: 'Computer Science & Engineering', semester: 5, section: 'A' }
  },
  '21cs001': {
    id: 3,
    username: 'student1',
    email: 'student1@college.edu',
    full_name: 'Ayaan Khan',
    role: 'STUDENT',
    phone_number: '+91 990001001',
    student: { id: 1, reg_no: '21CS001', department: 'Computer Science & Engineering', semester: 5, section: 'A' }
  },
  parent1: {
    id: 4,
    username: 'parent1',
    email: 'parent1@college.edu',
    full_name: 'Nadia Khan',
    role: 'PARENT',
    phone_number: '+91 9822114499',
    parent: { id: 1 }
  },
  parent_patel: {
    id: 4,
    username: 'parent_patel',
    email: 'parent1@college.edu',
    full_name: 'Nadia Khan',
    role: 'PARENT',
    phone_number: '+91 9822114499',
    parent: { id: 1 }
  }
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      return response.data;
    } catch (err) {
      // If backend is not available or returned an error, check demo fallback
      const { username, password } = credentials || {};
      const demoUser = DEMO_USERS[username?.toLowerCase()];
      const isValidPassword = password === 'admin123' || password === 'staff123' || password === 'student123' || password === 'parent123';

      if (demoUser && isValidPassword) {
        const mockAccess = 'demo-access-token-' + demoUser.role;
        const mockRefresh = 'demo-refresh-token-' + demoUser.role;
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        return {
          access: mockAccess,
          refresh: mockRefresh,
          user: demoUser
        };
      }
      throw err;
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me/');
      return response.data;
    } catch (err) {
      const saved = localStorage.getItem('demo_user');
      if (saved) {
        return JSON.parse(saved);
      }
      throw err;
    }
  },
  refreshToken: async (refresh) => {
    try {
      const response = await api.post('/auth/refresh/', { refresh });
      return response.data;
    } catch (err) {
      return { access: 'demo-refreshed-token' };
    }
  },
};

