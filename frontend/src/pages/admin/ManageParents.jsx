import React, { useState, useEffect, useRef } from 'react';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import HoldButton from '../../components/common/HoldButton';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageParents = () => {
  const [parents, setParents] = useState([]);
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
    relationship: 'Father',
    password: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await academicsService.getParents();
      setParents(Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : []));
    } catch (err) {
      toast.error('Failed to load parents registry');
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
      await academicsService.createParent(formData);
      toast.success('Parent account created successfully!');
      setIsModalOpen(false);
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        relationship: 'Father',
        password: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create parent');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicsService.deleteParent(deleteTarget.id);
      toast.success('Parent account deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete parent account.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      header: 'Parent Name',
      accessor: 'first_name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.first_name} {row.last_name}</p>
          <p className="text-[11px] text-slate-500">@{row.username} • {row.relationship}</p>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone_number',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700">{row.phone_number || 'N/A'}</p>
          <p className="text-slate-400 text-[11px]">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Linked Wards / Students',
      accessor: 'linked_children',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.linked_children && row.linked_children.length > 0 ? (
            row.linked_children.map((c) => (
              <span key={c.id} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {c.name} ({c.reg_no})
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No ward linked</span>
          )}
        </div>
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Parent Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage parent credentials and linked student wards</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Parent Account</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={parents}
        searchPlaceholder="Search parents by name..."
        keyField="id"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Parent Account">
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
              <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="e.g. parent123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
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
                  toast('Hold button to confirm adding parent', { icon: '👆' });
                }
              }}
              doneLabel="Parent Added!"
              backgroundColor="#0f172a"
              fillColor="#10b981"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              holdTime={1100}
              radius={10}
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Hold to Add Parent
            </HoldButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Parent Account?"
        message={`Are you sure you want to remove parent ${deleteTarget?.first_name} ${deleteTarget?.last_name}?`}
      />
    </div>
  );
};
