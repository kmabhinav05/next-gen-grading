/**
 * Parent Communications, PTM Bookings & Absence Intimations Store
 */

const DEFAULT_COMMUNICATIONS = [
  {
    id: 1,
    type: 'PTM',
    title: 'Faculty Consultation Request',
    parentName: 'Suresh Patel (Father)',
    studentName: 'Aarav Patel',
    regNo: '21CS001',
    faculty: 'Prof. Ramesh Sharma',
    subject: 'CS501 - Database Management',
    date: '2026-11-05',
    timeSlot: '11:00 am - 11:30 am',
    mode: 'Google Meet (Video Call)',
    notes: 'Discussion regarding IA2 indexing performance and elective choices for Semester 6.',
    status: 'Pending',
    createdAt: 'Today, 04:30 PM'
  },
  {
    id: 2,
    type: 'LEAVE',
    title: 'Ward Medical Absence Intimation',
    parentName: 'Alok Sen (Father)',
    studentName: 'Ananya Sen',
    regNo: '21CS004',
    faculty: 'Prof. Priya Verma',
    subject: 'All Classes (Semester 5)',
    leaveType: 'Medical Leave (Viral Fever)',
    startDate: '2026-10-29',
    endDate: '2026-10-31',
    reason: 'Ananya was diagnosed with viral fever and advised 3 days complete rest by Dr. Rao. Medical certificate will be submitted on return.',
    status: 'Acknowledged',
    createdAt: 'Yesterday, 09:15 AM'
  }
];

const getStored = () => {
  try {
    const raw = localStorage.getItem('demo_parent_communications');
    return raw ? JSON.parse(raw) : DEFAULT_COMMUNICATIONS;
  } catch (e) {
    return DEFAULT_COMMUNICATIONS;
  }
};

const setStored = (list) => {
  try {
    localStorage.setItem('demo_parent_communications', JSON.stringify(list));
    window.dispatchEvent(new Event('communications-updated'));
  } catch (e) {}
};

export const communicationsService = {
  getAll: () => {
    return getStored();
  },

  getForStaff: (facultyName) => {
    const all = getStored();
    return all;
  },

  sendConsultation: (data) => {
    const all = getStored();
    const newItem = {
      id: Date.now(),
      type: 'PTM',
      title: 'Faculty Consultation Request',
      parentName: data.parentName || 'Parent Guardian',
      studentName: data.studentName || 'Student Ward',
      regNo: data.regNo || '21CS001',
      faculty: data.faculty || 'Prof. Ramesh Sharma',
      subject: data.subject || 'Course Assessment',
      date: data.date,
      timeSlot: data.timeSlot,
      mode: data.mode,
      notes: data.notes || 'Routine academic progress review.',
      status: 'Pending',
      createdAt: 'Just now'
    };
    const updated = [newItem, ...all];
    setStored(updated);
    return newItem;
  },

  sendAbsenceNote: (data) => {
    const all = getStored();
    const newItem = {
      id: Date.now(),
      type: 'LEAVE',
      title: 'Ward Medical Absence Intimation',
      parentName: data.parentName || 'Parent Guardian',
      studentName: data.studentName || 'Student Ward',
      regNo: data.regNo || '21CS001',
      faculty: data.faculty || 'All Course Faculty',
      subject: 'All Classes (Semester 5)',
      leaveType: data.type || 'Medical Leave',
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'Pending',
      createdAt: 'Just now'
    };
    const updated = [newItem, ...all];
    setStored(updated);
    return newItem;
  },

  updateStatus: (id, newStatus) => {
    const all = getStored();
    const updated = all.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    setStored(updated);
    return updated;
  }
};
