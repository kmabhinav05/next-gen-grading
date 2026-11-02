import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsService } from '../../api/reports';
import { ProgressCard } from '../../components/reports/ProgressCard';
import { Skeleton } from '../../components/common/Skeleton';
import { Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyProgressCard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSem, setSelectedSem] = useState(5);

  useEffect(() => {
    const studentId = user?.student?.id || 1;
    reportsService
      .getProgressCard(studentId)
      .then((res) => {
        setData(res);
        if (res?.student?.semester) setSelectedSem(res.student.semester);
      })
      .catch(() => toast.error('Failed to load your progress card'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const customizedData = data
    ? {
        ...data,
        student: {
          ...(data.student || {}),
          semester: selectedSem
        }
      }
    : data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Academic Progress Card</h1>
          <p className="text-xs text-slate-500">Official semester performance and internal assessment summary</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Select Semester:</span>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(Number(e.target.value))}
            className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      <ProgressCard data={customizedData} showActions={true} />
    </div>
  );
};
