import api from './axios';

export const academicsService = {
  // Semesters
  getSemesters: async () => {
    const res = await api.get('/semesters/');
    return res.data;
  },
  createSemester: async (data) => {
    const res = await api.post('/semesters/', data);
    return res.data;
  },
  deleteSemester: async (id) => {
    const res = await api.delete(`/semesters/${id}/`);
    return res.data;
  },

  // Subjects
  getSubjects: async (params) => {
    const res = await api.get('/subjects/', { params });
    return res.data;
  },
  createSubject: async (data) => {
    const res = await api.post('/subjects/', data);
    return res.data;
  },
  updateSubject: async (id, data) => {
    const res = await api.put(`/subjects/${id}/`, data);
    return res.data;
  },
  deleteSubject: async (id) => {
    const res = await api.delete(`/subjects/${id}/`);
    return res.data;
  },

  // Staff
  getStaff: async (params) => {
    const res = await api.get('/staff/', { params });
    return res.data;
  },
  createStaff: async (data) => {
    const res = await api.post('/staff/', data);
    return res.data;
  },
  updateStaff: async (id, data) => {
    const res = await api.put(`/staff/${id}/`, data);
    return res.data;
  },
  deleteStaff: async (id) => {
    const res = await api.delete(`/staff/${id}/`);
    return res.data;
  },

  // Students
  getStudents: async (params) => {
    const res = await api.get('/students/', { params });
    return res.data;
  },
  createStudent: async (data) => {
    const res = await api.post('/students/', data);
    return res.data;
  },
  updateStudent: async (id, data) => {
    const res = await api.put(`/students/${id}/`, data);
    return res.data;
  },
  deleteStudent: async (id) => {
    const res = await api.delete(`/students/${id}/`);
    return res.data;
  },

  // Parents
  getParents: async (params) => {
    const res = await api.get('/parents/', { params });
    return res.data;
  },
  createParent: async (data) => {
    const res = await api.post('/parents/', data);
    return res.data;
  },
  deleteParent: async (id) => {
    const res = await api.delete(`/parents/${id}/`);
    return res.data;
  },

  // Parent-Student Link
  getParentStudentLinks: async (params) => {
    const res = await api.get('/parent-student/', { params });
    return res.data;
  },
  linkParentStudent: async (data) => {
    const res = await api.post('/parent-student/', data);
    return res.data;
  },
  unlinkParentStudent: async (id) => {
    const res = await api.delete(`/parent-student/${id}/`);
    return res.data;
  },
};
