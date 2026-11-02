import api from './axios';

// Built-in demo accounts for instant offline / cloud preview
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
    email: 'r.sharma@college.edu',
    full_name: 'Prof. Ramesh Sharma',
    role: 'STAFF',
    phone_number: '+91 9876500001',
    staff: { id: 1, department: 'Computer Science & Engineering', designation: 'Associate Professor' }
  },
  staff_verma: {
    id: 5,
    username: 'staff_verma',
    email: 'p.verma@college.edu',
    full_name: 'Prof. Priya Verma',
    role: 'STAFF',
    phone_number: '+91 9876500002',
    staff: { id: 2, department: 'Computer Science & Engineering', designation: 'Assistant Professor' }
  },
  student1: {
    id: 3,
    username: 'student1',
    reg_no: '21CS001',
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
    id: 7,
    username: 'parent_patel',
    email: 'suresh.patel@gmail.com',
    full_name: 'Suresh Patel',
    role: 'PARENT',
    phone_number: '+91 9822114455',
    parent: { id: 1 }
  },
  parent_sen: {
    id: 8,
    username: 'parent_sen',
    email: 'alok.sen@gmail.com',
    full_name: 'Alok Sen',
    role: 'PARENT',
    phone_number: '+91 9822114466',
    parent: { id: 2 }
  }
};

// Default mock students roster
const DEFAULT_STUDENT_USERS = [
  { id: 1, reg_no: '21CS001', username: 'student1', full_name: 'Aarav Patel', email: 'aarav@student.edu' },
  { id: 2, reg_no: '21CS002', username: 'student2', full_name: 'Diya Sharma', email: 'diya@student.edu' },
  { id: 3, reg_no: '21CS003', username: 'student3', full_name: 'Rohan Iyer', email: 'rohan@student.edu' },
  { id: 4, reg_no: '21CS004', username: 'student4', full_name: 'Ananya Sen', email: 'ananya@student.edu' },
  { id: 5, reg_no: '21CS005', username: 'student5', full_name: 'Vikram Singh', email: 'vikram@student.edu' },
  { id: 6, reg_no: '21CS006', username: 'student6', full_name: 'Neha Reddy', email: 'neha@student.edu' },
];

/**
 * Custom Registered Users management (stored in localStorage)
 */
export const getCustomUsers = () => {
  try {
    const raw = localStorage.getItem('demo_custom_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const registerCustomUser = (userRecord) => {
  try {
    const users = getCustomUsers();
    const cleanUsername = userRecord.username?.toLowerCase()?.trim();
    const cleanRegNo = userRecord.reg_no?.toUpperCase()?.trim();

    // Replace if existing with same username or reg_no
    const filtered = users.filter((u) => {
      const uUsername = u.username?.toLowerCase()?.trim();
      const uRegNo = (u.reg_no || u.student?.reg_no)?.toUpperCase()?.trim();
      if (cleanUsername && uUsername === cleanUsername) return false;
      if (cleanRegNo && uRegNo === cleanRegNo) return false;
      return true;
    });

    filtered.push(userRecord);
    localStorage.setItem('demo_custom_users', JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to register custom user to localStorage:', e);
  }
};

export const removeCustomUser = ({ id, username, reg_no }) => {
  try {
    const users = getCustomUsers();
    const cleanUsername = username?.toLowerCase()?.trim();
    const cleanRegNo = reg_no?.toUpperCase()?.trim();

    const filtered = users.filter((u) => {
      if (id && u.id === id) return false;
      if (cleanUsername && u.username?.toLowerCase()?.trim() === cleanUsername) return false;
      if (cleanRegNo && (u.reg_no || u.student?.reg_no)?.toUpperCase()?.trim() === cleanRegNo) return false;
      return true;
    });

    localStorage.setItem('demo_custom_users', JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove custom user from localStorage:', e);
  }
};

/**
 * Universal User Matcher: matches by username, register number, full name, first name, last name, or email
 */
const matchUserIdentifier = (u, cleanId) => {
  if (!u || !cleanId) return false;
  const regNo = (u.reg_no || u.student?.reg_no || '')?.toLowerCase()?.trim();
  const username = (u.username || '')?.toLowerCase()?.trim();
  const email = (u.email || '')?.toLowerCase()?.trim();
  const firstName = (u.first_name || '')?.toLowerCase()?.trim();
  const lastName = (u.last_name || '')?.toLowerCase()?.trim();
  const fullName = (u.full_name || '')?.toLowerCase()?.trim();
  const fullNameNoSpace = fullName.replace(/\s+/g, '');
  const emailPrefix = email ? email.split('@')[0]?.toLowerCase() : '';

  return (
    (regNo && regNo === cleanId) ||
    (username && username === cleanId) ||
    (email && email === cleanId) ||
    (emailPrefix && emailPrefix === cleanId) ||
    (fullName && fullName === cleanId) ||
    (fullNameNoSpace && fullNameNoSpace === cleanId) ||
    (firstName && firstName === cleanId) ||
    (lastName && lastName === cleanId) ||
    (fullName && fullName.startsWith(cleanId)) ||
    (regNo && (regNo.includes(cleanId) || cleanId.includes(regNo))) ||
    (username && (username.includes(cleanId) || cleanId.includes(username)))
  );
};

/**
 * Universal Password Validator:
 * - Master/standard passwords ('student123', 'admin123', etc.) always work
 * - If user object has no recorded password (e.g. created before password persistence): accept ANY password they type
 * - If user has a recorded password: match it
 */
const validatePassword = (userObj, cleanPass) => {
  if (!cleanPass) return false;

  const isMasterPass =
    cleanPass === 'student123' ||
    cleanPass === 'admin123' ||
    cleanPass === 'staff123' ||
    cleanPass === 'parent123';
  if (isMasterPass) return true;

  // If user object has no recorded password (e.g. created before password persistence was added):
  // Accept whatever password they entered in the form, and lock it in!
  if (!userObj.password) {
    userObj.password = cleanPass;
    return true;
  }

  // If user has a recorded password, match it
  if (userObj.password === cleanPass) return true;

  return false;
};

/**
 * Match a user from demo fallbacks (custom users, demo_students, default student roster, or DEMO_USERS)
 */
const findDemoUser = (identifier, password) => {
  if (!identifier) return null;
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // 1. Check custom dynamically created users first
  const customUsers = getCustomUsers();
  const matchedCustom = customUsers.find((u) => matchUserIdentifier(u, cleanId));

  if (matchedCustom) {
    if (validatePassword(matchedCustom, cleanPass)) {
      const { password: _, ...cleanProfile } = matchedCustom;
      return cleanProfile;
    }
    const err = new Error('Invalid password');
    err.response = { data: { detail: 'Invalid password' } };
    throw err;
  }

  // 2. Check demo_students registry (for students created through Admin)
  try {
    const rawDemoStudents = localStorage.getItem('demo_students');
    if (rawDemoStudents) {
      const studentsList = JSON.parse(rawDemoStudents);
      const matchedStu = studentsList.find((s) => matchUserIdentifier(s, cleanId));

      if (matchedStu) {
        if (validatePassword(matchedStu, cleanPass)) {
          // If password was missing, persist it back to localStorage
          try {
            localStorage.setItem('demo_students', JSON.stringify(studentsList));
          } catch (e) {}

          const firstName = matchedStu.first_name || matchedStu.full_name?.split(' ')[0] || '';
          const lastName = matchedStu.last_name || matchedStu.full_name?.split(' ').slice(1).join(' ') || '';
          const fullName = matchedStu.full_name || `${firstName} ${lastName}`.trim() || matchedStu.reg_no;
          const regNo = (matchedStu.reg_no || cleanId).toUpperCase();
          const username = matchedStu.username || regNo.toLowerCase();

          const userObj = {
            id: matchedStu.id || Date.now(),
            username,
            reg_no: regNo,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            email: matchedStu.email || `${username}@student.edu`,
            phone_number: matchedStu.phone_number || '',
            role: 'STUDENT',
            student: {
              id: matchedStu.id || Date.now(),
              reg_no: regNo,
              department: matchedStu.department || 'Computer Science & Engineering',
              semester: Number(matchedStu.semester) || 1,
              semester_number: Number(matchedStu.semester_number) || 5,
              section: matchedStu.section || 'A',
            }
          };

          // Cache in custom users store for fast subsequent lookup
          registerCustomUser({ ...userObj, password: matchedStu.password || cleanPass });
          return userObj;
        }

        const err = new Error('Invalid password');
        err.response = { data: { detail: 'Invalid password' } };
        throw err;
      }
    }
  } catch (e) {
    if (e.response?.data?.detail) throw e;
  }

  // 3. Check default student accounts (21CS001 - 21CS006, student1 - student6)
  const matchedDefaultStu = DEFAULT_STUDENT_USERS.find(
    (s) => matchUserIdentifier(s, cleanId) || cleanId === 'student'
  );

  if (matchedDefaultStu) {
    const isPassValid =
      cleanPass === 'student123' ||
      cleanPass === 'admin123' ||
      cleanPass === 'staff123' ||
      cleanPass === 'parent123';

    if (isPassValid) {
      return {
        id: matchedDefaultStu.id,
        username: matchedDefaultStu.username,
        email: matchedDefaultStu.email,
        full_name: matchedDefaultStu.full_name,
        role: 'STUDENT',
        phone_number: '+91 99000100' + matchedDefaultStu.id,
        student: {
          id: matchedDefaultStu.id,
          reg_no: matchedDefaultStu.reg_no,
          department: 'Computer Science & Engineering',
          semester: 5,
          semester_number: 5,
          section: 'A'
        }
      };
    }
    const err = new Error('Invalid password');
    err.response = { data: { detail: 'Invalid password' } };
    throw err;
  }

  // 4. Check DEMO_USERS (admin, staff, parent)
  const demoUser = DEMO_USERS[cleanId] || Object.values(DEMO_USERS).find((u) => matchUserIdentifier(u, cleanId));
  if (demoUser) {
    const isValidPassword =
      cleanPass === 'admin123' ||
      cleanPass === 'staff123' ||
      cleanPass === 'student123' ||
      cleanPass === 'parent123';

    if (isValidPassword) {
      return demoUser;
    }
    const err = new Error('Invalid password');
    err.response = { data: { detail: 'Invalid password' } };
    throw err;
  }

  return null;
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      return response.data;
    } catch (err) {
      // If backend is not available, returned an HTML 404 rewrite, or connection refused,
      // gracefully check demo and dynamic custom user fallback
      const { username, password } = credentials || {};
      const matchedUser = findDemoUser(username, password);

      if (matchedUser) {
        const mockAccess = 'demo-access-token-' + matchedUser.role + '-' + Date.now();
        const mockRefresh = 'demo-refresh-token-' + matchedUser.role + '-' + Date.now();
        localStorage.setItem('demo_user', JSON.stringify(matchedUser));
        return {
          access: mockAccess,
          refresh: mockRefresh,
          user: matchedUser
        };
      }

      // If user not found at all, throw clean error
      throw err;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me/');
      return response.data;
    } catch (err) {
      const saved = localStorage.getItem('demo_user') || localStorage.getItem('user_profile');
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
      return { access: 'demo-refreshed-token-' + Date.now() };
    }
  },
};
