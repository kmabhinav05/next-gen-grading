import React, { useState, useEffect } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
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
      setSubjects(subjRes);
      setSemesters(semRes);
      setStaffList(staffRes.results || staffRes);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const columns = [
    {
      header: 'Course Code',
      accessor: 'code',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-slate-900">{row.code}</span>,
    },
    {
      header: 'Course Name',
      accessor: 'name',
      sortable: true,
      render: (row) => <span className="font-semibold text-slate-800">{row.name}</span>,
    },
    {
      header: 'Semester',
      accessor: 'semester_number',
      sortable: true,
      render: (row) => <span>Semester {row.semester_number}</span>,
    },
    {
      header: 'Assigned Faculty',
      accessor: 'staff_name',
      render: (row) => (
        <span className="font-medium text-slate-700">
          {row.staff_name || <span className="text-slate-400 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      header: 'Max IA Marks',
      accessor: 'max_internal_marks',
      render: (row) => <span className="font-mono text-slate-600">{row.max_internal_marks} Marks</span>,
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Courses & Curriculum</h1>
          <p className="text-xs text-slate-500 mt-1">Configure subjects, semester associations, and teaching assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        searchPlaceholder="Search courses by code or title..."
        keyField="id"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS505"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max IA Marks</label>
              <input
                type="number"
                required
                value={formData.max_internal_marks}
                onChange={(e) => setFormData({ ...formData, max_internal_marks: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Course Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud Computing & Microservices"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <select
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    Semester {s.number} ({s.academic_year})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assign Faculty</label>
              <select
                value={formData.staff}
                onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Unassigned</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.first_name} {st.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-xs"
            >
              Save Course
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
