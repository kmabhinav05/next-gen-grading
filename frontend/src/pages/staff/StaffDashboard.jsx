import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { StatCard } from '../../components/common/StatCard';
import { Skeleton } from '../../components/common/Skeleton';
import { BookOpen, Upload, ClipboardCheck, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-xl" count={3} />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const assignedSubjects = data?.assigned_subjects || [];
  const recentLogs = data?.recent_logs || [];

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-primary-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Welcome back, {data?.staff_name || 'Faculty Member'}!
        </h1>
        <p className="text-xs sm:text-sm text-primary-200 mt-1">
          {data?.department || 'Department of Computer Science & Engineering'} • Instructor Portal
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Link
            to="/staff/upload-marks"
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary-900 hover:bg-primary-50 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4 text-primary-600" />
            <span>Upload Marks Spreadsheet</span>
          </Link>
          <Link
            to="/staff/attendance"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <ClipboardCheck className="w-4 h-4 text-primary-300" />
            <span>Enter Attendance Records</span>
          </Link>
          <Link
            to="/staff/class-report"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <FileText className="w-4 h-4 text-primary-300" />
            <span>View Class Reports</span>
          </Link>
        </div>
      </div>

      {/* Assigned Subjects Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Assigned Courses & Marks Upload Status</h3>
            <p className="text-xs text-slate-500">Continuous internal assessment completion tracking</p>
          </div>
          <Link
            to="/staff/upload-marks"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>Upload Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {assignedSubjects.length > 0 ? (
            assignedSubjects.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl border border-slate-200/70 hover:border-primary-300 transition-all bg-slate-50/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-primary-100 text-primary-800">
                      {sub.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">{sub.name}</h4>
                    <p className="text-xs text-slate-500">
                      Semester {sub.semester} • {sub.enrolled_students} Enrolled Students
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">IA 1</span>
                    <span className={`font-semibold text-xs ${sub.marks_status.IA1 === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {sub.marks_status.IA1}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">IA 2</span>
                    <span className={`font-semibold text-xs ${sub.marks_status.IA2 === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {sub.marks_status.IA2}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">IA 3</span>
                    <span className={`font-semibold text-xs ${sub.marks_status.IA3 === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {sub.marks_status.IA3}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-xs text-slate-400">
              No subjects currently assigned to your profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
