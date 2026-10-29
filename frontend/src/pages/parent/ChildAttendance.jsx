import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ChildAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childIndex, setChildIndex] = useState(0);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setData(res))
      .catch(() => toast.error('Failed to load child attendance'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const children = data?.children || [];
  const activeChild = children[childIndex] || children[0];

  if (!activeChild) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500">No linked ward records available.</p>
      </div>
    );
  }

  const { student, subjects, summary } = activeChild;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Record: {student.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Official lecture attendance and parent meeting alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Overall Attendance:</span>
          <AttendanceBadge percentage={summary.overall_attendance_percentage} size="md" />
        </div>
      </div>

      {children.length > 1 && (
        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-600">Select Ward:</span>
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

      {summary.overall_attendance_status === 'CRITICAL' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-sm">Attendance Shortage Notice for Parents</strong>
            Your ward's attendance is below 75%. As per college regulations, this requires an in-person meeting with the Head of Department.
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
                  <p className="text-[11px] text-slate-400">Faculty: {s.staff_name}</p>
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
