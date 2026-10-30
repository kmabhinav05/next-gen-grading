import React, { useState, useEffect, useRef } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import HoldButton from '../../components/common/HoldButton';
import { Plus, Trash2, Edit2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const formRef = useRef(null);

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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
          <p className="text-xs text-slate-500 mt-1">Enroll and manage department student candidates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search by reg number or student name..."
        keyField="id"
      />

      {/* Add Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Register Number (Unique)</label>
              <input
                type="text"
                required
                placeholder="e.g. 21CS007"
                value={formData.reg_no}
                onChange={(e) => setFormData({ ...formData, reg_no: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg uppercase focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <select
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
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
              <label className="block font-semibold text-slate-700 mb-1">Section</label>
              <input
                type="text"
                required
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg uppercase focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Password</label>
            <input
              type="password"
              required
              placeholder="e.g. student123"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <HoldButton
              onHold={() => {
                if (formRef.current && !formRef.current.checkValidity()) {
                  formRef.current.reportValidity();
                  return;
                }
                handleSubmit();
              }}
              onTap={() => {
                if (formRef.current && !formRef.current.checkValidity()) {
                  formRef.current.reportValidity();
                } else {
                  toast('Hold button to confirm registration', { icon: '👆' });
                }
              }}
              doneLabel="Student Added!"
              backgroundColor="#0f172a"
              fillColor="#06b6d4"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              holdTime={1100}
              radius={10}
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Hold to Add Student
            </HoldButton>
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
