import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../api/dashboard';
import { ProgressCard } from '../../components/reports/ProgressCard';
import { Skeleton } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

export const ChildProgressCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childIndex, setChildIndex] = useState(0);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setData(res))
      .catch(() => toast.error('Failed to load child progress card'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const children = data?.children || [];
  const activeChild = children[childIndex] || children[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {children.length > 1 && (
        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 no-print">
          <span className="text-xs font-semibold text-slate-600">Select Child:</span>
          {children.map((c, idx) => (
            <button
              key={c.student.id}
              onClick={() => setChildIndex(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                childIndex === idx ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {c.student.name}
            </button>
          ))}
        </div>
      )}

      {activeChild ? (
        <ProgressCard data={activeChild} showActions={true} />
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500">No linked student records available.</p>
        </div>
      )}
    </div>
  );
};
