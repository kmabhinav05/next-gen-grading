/**
 * Academic Resources & Notes Service
 * Manages Staff Lecture Notes & Student's Personal Uploaded Resources Locker
 */

const DEFAULT_STAFF_NOTES = [
  {
    id: 'sn-1',
    title: 'Unit 1 & 2: Relational Data Model & Advanced SQL Optimization',
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    staffName: 'Prof. Ramesh Sharma',
    semester: 5,
    section: 'A',
    fileType: 'PDF',
    fileSize: '4.6 MB',
    pages: 48,
    date: 'Nov 6, 2026',
    downloadCount: 42,
    description: 'Complete lecture notes on ER modeling, functional dependencies, BCNF decomposition, and indexing strategies with solved exam problems.',
    topics: ['ER Diagram to Relational Schema', 'Normal Forms (1NF, 2NF, 3NF, BCNF)', 'B+ Tree Index Calculations', 'Query Optimization Cost Models'],
    isStaffNote: true
  },
  {
    id: 'sn-2',
    title: 'Process Synchronization, Semaphores & Deadlock Avoidance',
    subjectCode: 'CS502',
    subjectName: 'Operating Systems',
    staffName: 'Prof. Priya Verma',
    semester: 5,
    section: 'A',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    pages: 36,
    date: 'Nov 4, 2026',
    downloadCount: 38,
    description: 'Detailed lecture slides and code walkthroughs for Peterson algorithm, Dining Philosophers problem, Banker algorithm, and page replacement benchmarks.',
    topics: ['Critical Section Problem', 'Semaphores & Mutex Locks', 'Banker Algorithm for Deadlocks', 'LRU vs FIFO Page Fault Tracing'],
    isStaffNote: true
  },
  {
    id: 'sn-3',
    title: 'Subnetting, CIDR & Transport Layer TCP Congestion Controls',
    subjectCode: 'CS503',
    subjectName: 'Computer Networks',
    staffName: 'Prof. Ramesh Sharma',
    semester: 5,
    section: 'A',
    fileType: 'PDF',
    fileSize: '5.2 MB',
    pages: 54,
    date: 'Oct 28, 2026',
    downloadCount: 47,
    description: 'Comprehensive network layer routing protocols (OSPF, BGP), TCP flow control sliding windows, and Wireshark packet capture lab walkthroughs.',
    topics: ['IPv4 Subnetting & Supernetting', 'Distance Vector vs Link State Routing', 'TCP 3-Way Handshake & Teardown', 'Congestion Window AIMD Equations'],
    isStaffNote: true
  },
  {
    id: 'sn-4',
    title: 'Turing Machines, Decidability & P vs NP Complexity Guide',
    subjectCode: 'CS504',
    subjectName: 'Theory of Computation',
    staffName: 'Prof. Priya Verma',
    semester: 5,
    section: 'A',
    fileType: 'PDF',
    fileSize: '2.9 MB',
    pages: 28,
    date: 'Oct 24, 2026',
    downloadCount: 29,
    description: 'Handwritten and LaTeX compiled notes covering context-free grammars, pushdown automata reductions, and halting problem diagonalization proofs.',
    topics: ['Deterministic vs Non-Deterministic TM', 'Chomsky Normal Form Conversions', 'Halting Problem Proof by Reduction', 'Cook-Levin Theorem Overview'],
    isStaffNote: true
  },
  {
    id: 'sn-5',
    title: 'Semester 5 IA2 Question Bank with Marking Scheme',
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    staffName: 'Prof. Ramesh Sharma',
    semester: 5,
    section: 'A',
    fileType: 'DOCX',
    fileSize: '1.4 MB',
    pages: 12,
    date: 'Nov 8, 2026',
    downloadCount: 56,
    description: 'Curated bank of 50 short and long-answer questions for IA2 preparation with previous university question paper blueprint mapping.',
    topics: ['Transactions & ACID Properties', 'Two-Phase Locking (2PL)', 'ARIES Recovery Algorithm', 'Distributed Database Architectures'],
    isStaffNote: true
  }
];

const DEFAULT_STUDENT_RESOURCES = [
  {
    id: 'sr-1',
    title: 'My B+ Tree Indexing & Hash Join Handwritten Summary',
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    category: 'Lecture Notes',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploadDate: 'Nov 9, 2026, 10:20 PM',
    notes: 'Quick revision formulas for calculating B+ tree order, maximum keys per internal node, node split conditions, and leaf node pointer chains.',
    uploadedBy: 'Aarav Patel (Student)'
  },
  {
    id: 'sr-2',
    title: 'OS Lab Exam Shell Scripts & Semaphore Program Cheatsheet',
    subjectCode: 'CS502',
    subjectName: 'Operating Systems',
    category: 'Lab Assignment',
    fileType: 'TXT',
    fileSize: '180 KB',
    uploadDate: 'Nov 7, 2026, 03:45 PM',
    notes: 'Tested C implementations for POSIX threads, sem_wait, sem_post, and fork() process tree generators with clean comments.',
    uploadedBy: 'Aarav Patel (Student)'
  },
  {
    id: 'sr-3',
    title: 'Computer Networks Subnetting Rapid Calculation Table',
    subjectCode: 'CS503',
    subjectName: 'Computer Networks',
    category: 'Revision Cheatsheet',
    fileType: 'PNG',
    fileSize: '850 KB',
    uploadDate: 'Nov 5, 2026, 06:10 PM',
    notes: 'Slash notation powers of 2 table (/24 to /30) for fast IP subnet allocation during the IA exam without manual binary conversion.',
    uploadedBy: 'Aarav Patel (Student)'
  }
];

const getStoredStaffNotes = () => {
  try {
    const raw = localStorage.getItem('demo_staff_notes');
    return raw ? JSON.parse(raw) : DEFAULT_STAFF_NOTES;
  } catch (e) {
    return DEFAULT_STAFF_NOTES;
  }
};

const setStoredStaffNotes = (list) => {
  try {
    localStorage.setItem('demo_staff_notes', JSON.stringify(list));
    window.dispatchEvent(new Event('resources-updated'));
  } catch (e) {}
};

const getStoredStudentResources = () => {
  try {
    const raw = localStorage.getItem('demo_student_resources');
    return raw ? JSON.parse(raw) : DEFAULT_STUDENT_RESOURCES;
  } catch (e) {
    return DEFAULT_STUDENT_RESOURCES;
  }
};

const setStoredStudentResources = (list) => {
  try {
    localStorage.setItem('demo_student_resources', JSON.stringify(list));
    window.dispatchEvent(new Event('resources-updated'));
  } catch (e) {}
};

export const resourcesService = {
  // Staff Notes (Notes from Faculty)
  getStaffNotes: (subjectFilter = '') => {
    const notes = getStoredStaffNotes();
    if (!subjectFilter) return notes;
    return notes.filter((n) => n.subjectCode === subjectFilter || n.subjectName.toLowerCase().includes(subjectFilter.toLowerCase()));
  },

  addStaffNote: (noteData) => {
    const notes = getStoredStaffNotes();
    const newNote = {
      id: `sn-${Date.now()}`,
      title: noteData.title,
      subjectCode: noteData.subjectCode || 'CS501',
      subjectName: noteData.subjectName || 'Database Management Systems',
      staffName: noteData.staffName || 'Prof. Ramesh Sharma',
      semester: noteData.semester || 5,
      section: noteData.section || 'A',
      fileType: noteData.fileType || 'PDF',
      fileSize: noteData.fileSize || '3.2 MB',
      pages: noteData.pages || 24,
      date: 'Just now',
      downloadCount: 0,
      description: noteData.description || 'Lecture material uploaded by faculty.',
      topics: noteData.topics || ['Chapter Overview', 'Key Concepts', 'Review Questions'],
      isStaffNote: true
    };
    const updated = [newNote, ...notes];
    setStoredStaffNotes(updated);
    return newNote;
  },

  incrementDownloadCount: (noteId) => {
    const notes = getStoredStaffNotes();
    const updated = notes.map((n) => (n.id === noteId ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n));
    setStoredStaffNotes(updated);
  },

  // Student Resources (Personal notes uploaded by student)
  getStudentResources: () => {
    return getStoredStudentResources();
  },

  addStudentResource: (resourceData) => {
    const resources = getStoredStudentResources();
    const newResource = {
      id: `sr-${Date.now()}`,
      title: resourceData.title,
      subjectCode: resourceData.subjectCode || 'CS501',
      subjectName: resourceData.subjectName || 'Database Management Systems',
      category: resourceData.category || 'Lecture Notes',
      fileType: resourceData.fileType || 'PDF',
      fileSize: resourceData.fileSize || '1.8 MB',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      notes: resourceData.notes || '',
      uploadedBy: resourceData.uploadedBy || 'Aarav Patel (Student)',
      fileContent: resourceData.fileContent || null
    };
    const updated = [newResource, ...resources];
    setStoredStudentResources(updated);
    return newResource;
  },

  deleteStudentResource: (id) => {
    const resources = getStoredStudentResources();
    const updated = resources.filter((r) => r.id !== id);
    setStoredStudentResources(updated);
    return true;
  },

  // File Download Helper
  downloadResource: (item) => {
    try {
      const filename = `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${item.fileType.toLowerCase()}`;
      const sampleContent = `# ${item.title}
Subject: ${item.subjectCode} - ${item.subjectName}
Author / Provider: ${item.staffName || item.uploadedBy || 'Academic Faculty'}
Date: ${item.date || item.uploadDate}

============================================================
NEXT GEN GRADING ACADEMIC RESOURCE SYSTEM
============================================================

Overview:
${item.description || item.notes || 'Academic course material and notes.'}

${item.topics && item.topics.length > 0 ? `Topics Covered:\n${item.topics.map((t, idx) => `  ${idx + 1}. ${t}`).join('\n')}\n` : ''}
${item.notes ? `Personal Memo:\n${item.notes}\n` : ''}
Verified by Next Gen Autonomous Academy Assessment Portal.
`;
      const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('Download error:', e);
      return false;
    }
  }
};
