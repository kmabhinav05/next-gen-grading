import React, { useState, useEffect, useRef } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  Filter,
  Save,
  User,
  UserPlus,
  Hash,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Layers,
  Mail,
  Phone,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const formRef = useRef(null);
  const editFormRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    reg_no: '',
    semester: '',
    section: 'A',
    department: 'Computer Science & Engineering',
    password: '',
  });

  const [editFormData, setEditFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    reg_no: '',
    semester: '',
    section: 'A',
    department: 'Computer Science & Engineering',
    password: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, semRes] = await Promise.all([
        academicsService.getStudents(),
        academicsService.getSemesters(),
      ]);
      setStudents(Array.isArray(stuRes?.results) ? stuRes.results : (Array.isArray(stuRes) ? stuRes : []));
      setSemesters(Array.isArray(semRes) ? semRes : []);
    } catch (err) {
      toast.error('Failed to load student registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      reg_no: '',
      semester: semesters[0]?.id || '',
      section: 'A',
      department: 'Computer Science & Engineering',
      password: '',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await academicsService.createStudent(formData);
      toast.success(`Student ${formData.reg_no} registered successfully!`);
      setIsModalOpen(false);
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        reg_no: '',
        semester: '',
        section: 'A',
        department: 'Computer Science & Engineering',
        password: '',
      });
      fetchData();
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to register student';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student) => {
    setEditTarget(student);
    const names = (student.full_name || '').split(' ');
    setEditFormData({
      first_name: student.first_name || names[0] || '',
      last_name: student.last_name || names.slice(1).join(' ') || '',
      username: student.username || student.reg_no?.toLowerCase() || '',
      reg_no: student.reg_no || '',
      semester: student.semester || student.semester_number || 1,
      section: student.section || 'A',
      department: student.department || 'Computer Science & Engineering',
      email: student.email || '',
      phone_number: student.phone_number || '',
      password: '',
    });
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      await academicsService.updateStudent(editTarget.id, editFormData);
      toast.success(`Student ${editFormData.reg_no} updated successfully!`);
      setIsEditModalOpen(false);
      setEditTarget(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update student';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicsService.deleteStudent(deleteTarget.id);
      toast.success(`Student ${deleteTarget.reg_no} removed successfully.`);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete student.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredStudents = selectedSemester
    ? students.filter((s) => String(s.semester_number || s.semester) === String(selectedSemester))
    : students;

  const columns = [
    {
      header: 'Register No',
      accessor: 'reg_no',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-slate-900">{row.reg_no}</span>,
    },
    {
      header: 'Student Name',
      accessor: 'full_name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.full_name}</p>
          <p className="text-[11px] text-slate-500">@{row.username || row.reg_no?.toLowerCase() || 'student'}</p>
        </div>
      ),
    },
    {
      header: 'Semester',
      accessor: 'semester_number',
      sortable: true,
      render: (row) => <span>Semester {row.semester_number || row.semester || 5}</span>,
    },
    {
      header: 'Section',
      accessor: 'section',
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 font-bold rounded bg-slate-100 text-slate-700">
          Sec {row.section}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit student"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-xs text-slate-500 mt-1">Enroll, filter by semester, and manage department student candidates</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Semester Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="">All Semesters</option>
              {semesters.length > 0 ? (
                semesters.map((s) => (
                  <option key={s.id} value={s.number || s.id}>
                    Semester {s.number} ({s.academic_year})
                  </option>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>Semester {num}</option>
                ))
              )}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        searchPlaceholder="Search by reg number or student name..."
        keyField="id"
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Student"
        subtitle="Enroll a candidate, assign academic semester/section, and configure portal credentials."
        icon={<UserPlus className="w-5 h-5 text-blue-600" />}
        maxWidth="max-w-xl"
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          className="space-y-4"
        >
          {/* Invisible inputs to block aggressive browser autofill */}
          <input type="text" name="fake_user_autofill_guard" className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />
          <input type="password" name="fake_pass_autofill_guard" className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="new-password" />

          {/* Section 1: Candidate Identity */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Candidate Identity</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    name="student_first_name_input"
                    autoComplete="off"
                    placeholder="e.g. Abhinav"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    name="student_last_name_input"
                    autoComplete="off"
                    placeholder="e.g. Kumar"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Assignment */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Academic Placement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Register No <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    name="student_reg_number_input"
                    autoComplete="off"
                    placeholder="e.g. 21CS007"
                    value={formData.reg_no}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setFormData((prev) => ({
                        ...prev,
                        reg_no: val,
                        username: !prev.username || prev.username === prev.reg_no.toLowerCase() ? val.toLowerCase() : prev.username,
                      }));
                    }}
                    className="w-full pl-9 pr-2.5 py-2.5 text-sm uppercase font-mono tracking-wider bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-semibold placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Semester <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    name="student_sem_choice"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        Semester {s.number} ({s.academic_year})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Section <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    name="student_section_choice"
                    autoComplete="off"
                    placeholder="e.g. A"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                    className="w-full pl-9 pr-3 py-2.5 text-sm uppercase font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-semibold placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Portal Authentication & Access */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Portal Authentication & Access</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Login Username <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">For student portal</span>
                </div>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    name="student_portal_account_name"
                    autoComplete="off"
                    placeholder="e.g. siaxbca29"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Initial Password <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    Default: student123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="student_portal_account_password"
                    autoComplete="new-password"
                    placeholder="e.g. student123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Student'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Profile"
        subtitle={`Update academic records, contact info, or modify portal credentials for ${editFormData.reg_no || 'student'}`}
        icon={<Edit2 className="w-5 h-5 text-blue-600" />}
        maxWidth="max-w-xl"
      >
        <form
          ref={editFormRef}
          onSubmit={handleEditSubmit}
          autoComplete="off"
          className="space-y-4"
        >
          {/* Section 1: Candidate Identity */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Candidate Identity</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Academic Placement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Register No *</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={editFormData.reg_no}
                    onChange={(e) => setEditFormData({ ...editFormData, reg_no: e.target.value.toUpperCase() })}
                    className="w-full pl-9 pr-2.5 py-2.5 text-sm uppercase font-mono tracking-wider bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Semester *</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    value={editFormData.semester}
                    onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        Semester {s.number} ({s.academic_year})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Section *</label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={editFormData.section}
                    onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value.toUpperCase() })}
                    className="w-full pl-9 pr-3 py-2.5 text-sm uppercase font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Security */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact & Portal Credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={editFormData.phone_number}
                    onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Update Password</label>
                <span className="text-[10px] text-slate-400">Leave blank to keep unchanged</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  placeholder="Enter new password if modifying"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                >
                  {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Student?"
        message={`Are you sure you want to permanently delete student ${deleteTarget?.reg_no} (${deleteTarget?.full_name})? This will also remove their marks and attendance records.`}
      />
    </div>
  );
};
