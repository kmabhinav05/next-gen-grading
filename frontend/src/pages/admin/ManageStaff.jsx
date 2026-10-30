import React, { useState, useEffect } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    password: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await academicsService.getStaff();
      setStaffList(Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : []));
    } catch (err) {
      toast.error('Failed to load faculty registry');
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
      await academicsService.createStaff(formData);
      toast.success(`Faculty ${formData.first_name} ${formData.last_name} created successfully!`);
      setIsModalOpen(false);
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        password: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create faculty');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicsService.deleteStaff(deleteTarget.id);
      toast.success('Faculty member removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove faculty member.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      header: 'Faculty Name',
      accessor: 'first_name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.first_name} {row.last_name}</p>
          <p className="text-[11px] text-slate-500">{row.email || `@${row.username}`}</p>
        </div>
      ),
    },
    {
      header: 'Designation',
      accessor: 'designation',
      sortable: true,
      render: (row) => <span className="font-medium text-slate-700">{row.designation}</span>,
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Assigned Courses',
      accessor: 'assigned_subject_count',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          {row.assigned_subject_count || 0} subjects
        </span>
      ),
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Faculty Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage teaching staff and course instructors</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={staffList}
        searchPlaceholder="Search faculty by name..."
        keyField="id"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Faculty Staff">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="e.g. staff123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
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
              Save Faculty
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Faculty Member?"
        message={`Are you sure you want to remove ${deleteTarget?.first_name} ${deleteTarget?.last_name}?`}
      />
    </div>
  );
};
