import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { StatCard } from '../../components/common/StatCard';
import { Skeleton } from '../../components/common/Skeleton';
import { GraduationCap, Users, BookOpen, Calendar, AlertTriangle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" count={4} />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const counts = data?.counts || {};
  const recentUploads = data?.recent_uploads || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Department statistics, system users, and audit logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Class Reports & Audits</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={counts.students || 0}
          subtitle="Enrolled candidates"
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Faculty Staff"
          value={counts.staff || 0}
          subtitle="Subject teachers"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Courses / Subjects"
          value={counts.subjects || 0}
          subtitle="Across active semesters"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Semesters"
          value={counts.semesters || 0}
          subtitle="Academic curriculum"
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Attendance Alerts"
          value={counts.critical_attendance_records || 0}
          subtitle="Shortages (< 75%)"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Audit Logs & Quick Navigation */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Upload Audit Trail */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Marks Upload Audit Logs</h3>
              <p className="text-xs text-slate-500">Activity record of faculty Excel mark submissions</p>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Subject</th>
                  <th className="py-2.5">Assessment</th>
                  <th className="py-2.5">Faculty</th>
                  <th className="py-2.5">Rows Valid</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUploads.length > 0 ? (
                  recentUploads.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 font-semibold text-slate-800">{log.subject_code}</td>
                      <td className="py-2.5 text-slate-600">{log.assessment}</td>
                      <td className="py-2.5 text-slate-700">{log.staff_name}</td>
                      <td className="py-2.5 text-slate-600 font-mono">{log.valid_rows} rows</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500">{log.timestamp}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No upload logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Administrative Actions</h3>
            <p className="text-xs text-slate-500 mb-4">Direct shortcuts to department registries</p>

            <div className="space-y-2">
              <Link
                to="/admin/students"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:border-primary-500 hover:bg-primary-50/40 transition-colors text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-primary-600" />
                  <span>Student Registry & Sections</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/staff"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:border-primary-500 hover:bg-primary-50/40 transition-colors text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Faculty Staff Profiles</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/subjects"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:border-primary-500 hover:bg-primary-50/40 transition-colors text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Courses & Staff Assignment</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/parent-student"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:border-primary-500 hover:bg-primary-50/40 transition-colors text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Parent-Ward Linkage</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            All database modifications adhere to strict relational integrity constraints and transaction blocks.
          </div>
        </div>
      </div>
    </div>
  );
};
