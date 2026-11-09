import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Delete',
  isDanger = true
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={
        <AlertTriangle
          className={`w-5 h-5 ${isDanger ? 'text-rose-600' : 'text-amber-600'}`}
        />
      }
      maxWidth="max-w-md"
    >
      <div className="text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        {message}
      </div>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all cursor-pointer ${
            isDanger
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
              : 'bg-primary-600 hover:bg-primary-700 shadow-blue-500/20'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
