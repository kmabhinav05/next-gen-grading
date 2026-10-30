import React, { useState, useEffect } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const LinkParentStudent = () => {
  const [links, setLinks] = useState([]);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    parent: '',
    student: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [linksRes, pRes, sRes] = await Promise.all([
        academicsService.getParentStudentLinks(),
        academicsService.getParents(),
        academicsService.getStudents(),
      ]);
      setLinks(Array.isArray(linksRes?.results) ? linksRes.results : (Array.isArray(linksRes) ? linksRes : []));
      setParents(Array.isArray(pRes?.results) ? pRes.results : (Array.isArray(pRes) ? pRes : []));
      setStudents(Array.isArray(sRes?.results) ? sRes.results : (Array.isArray(sRes) ? sRes : []));
    } catch (err) {
      toast.error('Failed to load parent-student relationships');
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
      await academicsService.linkParentStudent(formData);
      toast.success('Successfully linked parent with student ward!');
      setIsModalOpen(false);
      setFormData({ parent: '', student: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to establish link');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicsService.unlinkParentStudent(deleteTarget.id);
      toast.success('Linkage removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove linkage.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      header: 'Parent Name',
      accessor: 'parent_name',
      sortable: true,
      render: (row) => <span className="font-semibold text-slate-900">{row.parent_name}</span>,
    },
    {
      header: 'Student Ward',
      accessor: 'student_name',
      sortable: true,
      render: (row) => <span className="font-medium text-slate-800">{row.student_name}</span>,
    },
    {
      header: 'Student Reg No',
      accessor: 'student_reg_no',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-primary-700">{row.student_reg_no}</span>,
    },
    {
      header: 'Linked Date',
      accessor: 'created_at',
      render: (row) => <span className="text-slate-500 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>,
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Parent-Student Linkage</h1>
          <p className="text-xs text-slate-500 mt-1">Associate parents to students for authorized PTM progress card access</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Link</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={links}
        searchPlaceholder="Search linkages..."
        keyField="id"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Link Parent to Student Ward">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Parent</label>
            <select
              required
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="">Choose Parent Account</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} (@{p.username}) - {p.relationship}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Student Ward</label>
            <select
              required
              value={formData.student}
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="">Choose Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.reg_no} - {s.full_name} (Sem {s.semester_number || '?'})
                </option>
              ))}
            </select>
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
              Establish Link
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Parent-Ward Association?"
        message={`Remove linkage between ${deleteTarget?.parent_name} and student ${deleteTarget?.student_name}?`}
      />
    </div>
  );
};
