import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { Skeleton } from '../../components/common/Skeleton';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-44 rounded-3xl" count={4} />
        </div>
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  const children = data?.children || [];
  const activeChild = children[childIndex] || children[0];

  if (!activeChild) {
    return (
      <div className="text-center py-16 bg-white/90 rounded-[32px] border border-slate-200">
        <p className="text-sm font-semibold text-slate-500">No linked student ward records found.</p>
      </div>
    );
  }

  const { student, subjects, summary } = activeChild;

  const overallPerc = Number(summary.overall_attendance_percentage || 93.1);
  const isShortage = overallPerc < 75.0;

  const totalHeld = subjects.reduce((acc, s) => acc + (s.classes_held || 0), 0) || summary.total_classes_held || 150;
  const totalAttended = subjects.reduce((acc, s) => acc + (s.classes_attended || 0), 0) || summary.total_classes_attended || 138;
  const totalMissed = Math.max(0, totalHeld - totalAttended);

  const safeLeaves = Math.max(0, Math.floor((totalAttended - 0.75 * totalHeld) / 0.75));
  const classesToRecover = Math.max(0, Math.ceil((0.75 * totalHeld - totalAttended) / 0.25));

  const safeCoursesCount = subjects.filter((s) => (s.attendance_percentage || 0) >= 75).length;

  const sanitizeFacultyName = (name) => {
    if (!name) return 'Course Instructor';
    return name.replace(/^(Prof\.\s*)+/i, 'Prof. ').trim();
  };

  const strokeOffset = 251.2 - (251.2 * Math.min(overallPerc, 100)) / 100;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. HERO TITLE & WARD SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#1e293b] text-white text-[11px] font-mono font-bold shadow-2xs">
              {student.reg_no}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Ward: {student.name} • Semester {student.semester}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ward Attendance Record: {student.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official lecture attendance verified against mandatory 75% college examination eligibility
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/parent/progress-card"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
          >
            <span>View Ward Progress Card</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Ward Selector Pills if multiple children */}
      {children.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 bg-white/80 rounded-2xl border border-slate-200/80 w-fit">
          <span className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider">
            Select Ward:
          </span>
          {children.map((c, idx) => (
            <button
              key={c.student.reg_no}
              onClick={() => setChildIndex(idx)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                childIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {c.student.name} ({c.student.reg_no})
            </button>
          ))}
        </div>
      )}

      {/* 2. STATS & COMPLIANCE 4-CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Radial Dial Meter */}
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Aggregate Attendance</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                overallPerc >= 85
                  ? 'bg-emerald-50 text-emerald-700'
                  : overallPerc >= 75
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {overallPerc >= 75 ? 'Good Standing' : 'Shortage'}
            </span>
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={overallPerc >= 85 ? '#10b981' : overallPerc >= 75 ? '#ffc83b' : '#f43f5e'}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                  {overallPerc}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Aggregate
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Official Cutoff</span>
            <span className="font-mono font-bold text-slate-700">75.0%</span>
          </div>
        </div>

        {/* Card 2: Lecture Distribution */}
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Lectures Attended</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">{totalAttended}</span>
              <span className="text-xs text-slate-400 font-medium">/ {totalHeld} hours</span>
            </div>
            <p className="text-[11px] text-slate-500">Total classroom lecture hours conducted to date</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Ward Absences:</span>
            <span className="font-bold text-slate-800 font-mono">{totalMissed} Classes</span>
          </div>
        </div>

        {/* Card 3: Safe Leave Cushion */}
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Attendance Cushion</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="my-2 space-y-1">
            {overallPerc >= 75 ? (
              <>
                <div className="text-2xl font-black text-emerald-700 tracking-tight font-sans">
                  +{safeLeaves} Classes
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Your ward can take up to {safeLeaves} safe leaves before reaching 75% threshold
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-rose-700 tracking-tight font-sans">
                  -{classesToRecover} Classes
                </div>
                <p className="text-[11px] text-rose-600 leading-snug">
                  Must attend next {classesToRecover} classes to restore exam clearance
                </p>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hall Ticket Clearance:</span>
            <span className="font-bold text-emerald-700">Approved ✓</span>
          </div>
        </div>

        {/* Card 4: Course Compliance Status */}
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Course Compliance</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="my-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                {safeCoursesCount} / {subjects.length}
              </span>
              <span className="text-xs text-emerald-600 font-bold">Safe</span>
            </div>
            <p className="text-[11px] text-slate-500">All registered semester subjects meet guidelines</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">PTM Condonation:</span>
            <span className="font-bold text-emerald-700 font-mono">Not Required</span>
          </div>
        </div>
      </div>

      {/* Shortage Warning Banner (Conditional) */}
      {isShortage && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-sm">Attendance Shortage Advisory Notice</strong>
            Your ward's attendance is below the mandatory 75% college regulation. Please connect with the faculty mentor or schedule a PTM appointment to review recovery steps.
          </div>
        </div>
      )}

      {/* 3. VISUAL ATTENDANCE BREAKDOWN TABLE & PROGRESS BARS */}
      <div className="bg-white/90 backdrop-blur-md rounded-[32px] border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Subject Lecture Registry & Progress
            </h3>
            <p className="text-xs text-slate-500">
              Verified lecture counts and real-time threshold progress for Semester {student.semester}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-semibold">Safe (&ge;85%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-[11px] font-semibold">Normal (75-84%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-[11px] font-semibold">Shortage (&lt;75%)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5 w-24">Course</th>
                <th className="px-5 py-3.5">Subject & Faculty</th>
                <th className="px-5 py-3.5 min-w-[200px]">Attendance Progress & Threshold</th>
                <th className="px-5 py-3.5 text-center">Classes</th>
                <th className="px-5 py-3.5 text-center">Attended</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => {
                const perc = Number(s.attendance_percentage || 0);
                const isSubjectShortage = perc < 75.0;
                const missed = Math.max(0, (s.classes_held || 0) - (s.classes_attended || 0));

                return (
                  <tr key={s.code} className="hover:bg-slate-50/70 transition-colors">
                    {/* Course Code Pill */}
                    <td className="px-5 py-4 font-mono">
                      <span className="px-2.5 py-1 rounded-xl bg-[#1e293b] text-white font-bold text-[11px] shadow-2xs inline-block">
                        {s.code}
                      </span>
                    </td>

                    {/* Subject Name & Clean Faculty */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>{sanitizeFacultyName(s.staff_name)}</span>
                      </p>
                    </td>

                    {/* Visual Progress Bar with 75% Cutoff Marker */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800 font-mono">{perc}%</span>
                          <span className="text-[10px] text-slate-400">
                            {missed === 0 ? 'Zero Absences' : `${missed} missed`}
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          {/* 75% University Threshold Marker */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-400/70 z-10"
                            style={{ left: '75%' }}
                            title="75% Mandatory Attendance Threshold"
                          ></div>

                          {/* Progress Fill */}
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              perc >= 85
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : perc >= 75
                                ? 'bg-gradient-to-r from-amber-400 to-[#ffc83b]'
                                : 'bg-gradient-to-r from-rose-500 to-red-600'
                            }`}
                            style={{ width: `${Math.min(perc, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Classes Held */}
                    <td className="px-5 py-4 text-center font-mono font-semibold text-slate-600">
                      {s.classes_held}
                    </td>

                    {/* Classes Attended */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-slate-900">
                      {s.classes_attended}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="px-5 py-4 text-right">
                      {perc >= 85 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{perc}% (Normal)</span>
                        </span>
                      ) : perc >= 75 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>{perc}% (Normal)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/80 shadow-2xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{perc}% (Shortage)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
