import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsService } from '../../api/reports';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { ClipboardCheck, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.student?.id || 1;
    reportsService
      .getProgressCard(studentId)
      .then((res) => setData(res))
      .catch(() => toast.error('Failed to load attendance records'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const subjects = data?.subjects || [];
  const summary = data?.summary || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Attendance Breakdown</h1>
          <p className="text-xs text-slate-500 mt-1">Course-wise lecture attendance with official college thresholds</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Overall:</span>
          <AttendanceBadge percentage={summary.overall_attendance_percentage} size="md" />
        </div>
      </div>

      {summary.overall_attendance_status === 'CRITICAL' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-sm">Attendance Shortage Warning</strong>
            Your overall attendance is below the mandatory 75% college regulation. Please meet your faculty advisor and head of department.
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px]">
              <th className="px-4 py-3">Course Code</th>
              <th className="px-4 py-3">Subject Name</th>
              <th className="px-4 py-3 text-center">Classes Held</th>
              <th className="px-4 py-3 text-center">Attended</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map((s) => (
              <tr key={s.code} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.code}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{s.name}</p>
                  <p className="text-[11px] text-slate-400">Prof. {s.staff_name}</p>
                </td>
                <td className="px-4 py-3 text-center text-slate-600 font-mono">{s.classes_held}</td>
                <td className="px-4 py-3 text-center text-slate-800 font-mono font-semibold">{s.classes_attended}</td>
                <td className="px-4 py-3 text-center">
                  <AttendanceBadge percentage={s.attendance_percentage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
