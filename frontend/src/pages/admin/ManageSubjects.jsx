import React, { useState, useEffect, useRef } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Filter,
  Save,
  Hash,
  Award,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const editFormRef = useRef(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    semester: '',
    staff: '',
    max_internal_marks: 50,
  });

  const [editFormData, setEditFormData] = useState({
    code: '',
    name: '',
    semester: '',
    staff: '',
    max_internal_marks: 50,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjRes, semRes, staffRes] = await Promise.all([
        academicsService.getSubjects(),
        academicsService.getSemesters(),
        academicsService.getStaff(),
      ]);
      setSubjects(Array.isArray(subjRes) ? subjRes : []);
      setSemesters(Array.isArray(semRes) ? semRes : []);
      setStaffList(Array.isArray(staffRes?.results) ? staffRes.results : (Array.isArray(staffRes) ? staffRes : []));
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData({
      code: '',
      name: '',
      semester: semesters[0]?.id || '',
      staff: '',
      max_internal_marks: 50,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await academicsService.createSubject(formData);
      toast.success(`Course ${formData.code} created successfully!`);
      setIsModalOpen(false);
      setFormData({
        code: '',
        name: '',
        semester: '',
        staff: '',
        max_internal_marks: 50,
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (subj) => {
    setEditTarget(subj);
    setEditFormData({
      code: subj.code || '',
      name: subj.name || '',
      semester: subj.semester || subj.semester_number || 1,
      staff: subj.staff || '',
      max_internal_marks: subj.max_internal_marks || 50,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      await academicsService.updateSubject(editTarget.id, editFormData);
      toast.success(`Course ${editFormData.code} updated successfully!`);
      setIsEditModalOpen(false);
      setEditTarget(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicsService.deleteSubject(deleteTarget.id);
      toast.success('Course deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete course.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredSubjects = selectedSemester
    ? subjects.filter((s) => String(s.semester_number || s.semester) === String(selectedSemester))
    : subjects;

  const columns = [
    {
      header: 'Course Code',
      accessor: 'code',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-xs">
          {row.code}
        </span>
      ),
    },
    {
      header: 'Course Title',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-[11px] text-slate-400">Max IA Marks: {row.max_internal_marks}</p>
        </div>
      ),
    },
    {
      header: 'Semester',
      accessor: 'semester_number',
      sortable: true,
      render: (row) => <span>Semester {row.semester_number || row.semester}</span>,
    },
    {
      header: 'Assigned Faculty',
      accessor: 'staff_name',
      render: (row) => (
        <span className="text-slate-700 font-medium">
          {row.staff_name || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit course"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete course"
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Courses & Curriculum</h1>
          <p className="text-xs text-slate-500 mt-1">Configure subjects, semester syllabi, and assign course instructors</p>
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
            <span>Add Course</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSubjects}
        searchPlaceholder="Search courses by code or title..."
        keyField="id"
      />

      {/* Add Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Course"
        subtitle="Define course code, full title, academic semester, and assign faculty instructor."
        icon={<BookOpen className="w-5 h-5 text-blue-600" />}
        maxWidth="max-w-xl"
      >
        <form ref={formRef} onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Course Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS505"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm uppercase font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-semibold placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Max Internal Marks <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    required
                    min="10"
                    max="100"
                    value={formData.max_internal_marks}
                    onChange={(e) => setFormData({ ...formData, max_internal_marks: Number(e.target.value) })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Course Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Computing & Microservices"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Semester <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium cursor-pointer"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assign Faculty</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.staff}
                    onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.first_name || st.user?.first_name} {st.last_name || st.user?.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

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
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Course Details"
        subtitle={`Update course specifications, credits, or assigned faculty for ${editFormData.code}`}
        icon={<Edit2 className="w-5 h-5 text-blue-600" />}
        maxWidth="max-w-xl"
      >
        <form ref={editFormRef} onSubmit={handleEditSubmit} autoComplete="off" className="space-y-4">
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Course Code *</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={editFormData.code}
                    onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm uppercase font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max Internal Marks *</label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    required
                    min="10"
                    max="100"
                    value={editFormData.max_internal_marks}
                    onChange={(e) => setEditFormData({ ...editFormData, max_internal_marks: Number(e.target.value) })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Course Title *</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Semester *</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    value={editFormData.semester}
                    onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium cursor-pointer"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assign Faculty</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={editFormData.staff}
                    onChange={(e) => setEditFormData({ ...editFormData, staff: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all font-medium cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.first_name || st.user?.first_name} {st.last_name || st.user?.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

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
        title="Delete Course?"
        message={`Are you sure you want to remove ${deleteTarget?.code} (${deleteTarget?.name})?`}
      />
    </div>
  );
};
