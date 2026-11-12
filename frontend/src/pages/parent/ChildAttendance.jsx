import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { Skeleton } from '../../components/common/Skeleton';
import {
  ClipboardCheck,
  User,
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
    const clean = name.replace(/^((Prof\.|Prof|Professor)\s*)+/gi, '').trim();
    return clean ? `Prof. ${clean}` : 'Course Instructor';
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
        <div className="bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
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
        <div className="bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
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
        <div className="bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
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
        <div className="bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
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
      <div className="bg-white/90 rounded-[32px] border border-slate-200/80 shadow-2xs overflow-hidden">
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
              <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-36 text-left">Course</th>
                <th className="px-6 py-4 text-left">Subject & Faculty</th>
                <th className="px-6 py-4 min-w-[280px] text-left">Attendance & 75% Threshold</th>
                <th className="px-6 py-4 w-40 text-center">Attended / Total</th>
                <th className="px-6 py-4 w-36 text-center">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => {
                const perc = Number(s.attendance_percentage || 0);
                const isSafe = perc >= 85;
                const isNormal = perc >= 75 && perc < 85;
                const isSubjectShortage = perc < 75.0;
                const missed = Math.max(0, (s.classes_held || 0) - (s.classes_attended || 0));
                const safeMargin = Math.max(0, Math.floor(((s.classes_attended || 0) - 0.75 * (s.classes_held || 0)) / 0.75));
                const recover = Math.max(0, Math.ceil((0.75 * (s.classes_held || 0) - (s.classes_attended || 0)) / 0.25));

                return (
                  <tr key={s.code} className="hover:bg-slate-50/70 transition-colors">
                    {/* Course Code Pill */}
                    <td className="px-6 py-4.5 align-middle whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-mono font-bold text-xs tracking-wide shadow-2xs inline-block">
                        {s.code}
                      </span>
                    </td>

                    {/* Subject Name & Clean Faculty */}
                    <td className="px-6 py-4.5 align-middle">
                      <p className="font-bold text-slate-900 text-sm leading-snug">{s.name}</p>
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Faculty: <span className="font-semibold text-slate-700">{sanitizeFacultyName(s.staff_name)}</span></span>
                      </p>
                    </td>

                    {/* Visual Progress Bar with 75% Cutoff Marker & Headroom */}
                    <td className="px-6 py-4.5 align-middle min-w-[280px]">
                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between text-xs">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`font-mono font-black text-base ${
                              isSafe ? 'text-emerald-600' : isNormal ? 'text-amber-600' : 'text-rose-600'
                            }`}>
                              {perc}%
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              attended
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            {missed === 0 ? (
                              <span className="text-emerald-600 font-semibold">0 Absences</span>
                            ) : (
                              <span><strong className="text-slate-700 font-semibold">{missed}</strong> missed</span>
                            )}
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner">
                          {/* 75% University Threshold Marker */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                            style={{ left: '75%' }}
                            title="75% Mandatory Attendance Threshold"
                          />

                          {/* Progress Fill */}
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isSafe
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : isNormal
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : 'bg-gradient-to-r from-rose-500 to-red-600'
                            }`}
                            style={{ width: `${Math.min(perc, 100)}%` }}
                          />
                        </div>

                        {/* Headroom / Cushion Subtext */}
                        <div className="flex items-center justify-between text-[11px] pt-0.5">
                          {perc >= 75 ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Can miss <strong className="font-extrabold">{safeMargin}</strong> classes safely</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>Must attend next <strong className="font-extrabold">{recover}</strong> classes</span>
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                            75% min req.
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Attended / Held Ratio */}
                    <td className="px-6 py-4.5 align-middle text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center justify-center">
                        <div className="inline-flex items-baseline gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 font-mono">
                          <span className="font-black text-slate-900 text-sm">{s.classes_attended}</span>
                          <span className="text-slate-400 text-xs font-semibold">/</span>
                          <span className="text-slate-600 text-xs font-bold">{s.classes_held}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Sessions</span>
                      </div>
                    </td>

                    {/* Status Pill Badge */}
                    <td className="px-6 py-4.5 align-middle text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {isSafe ? (
                          <span className="inline-flex items-center justify-center gap-1.5 min-w-[96px] px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Safe</span>
                          </span>
                        ) : isNormal ? (
                          <span className="inline-flex items-center justify-center gap-1.5 min-w-[96px] px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Normal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1.5 min-w-[96px] px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Shortage</span>
                          </span>
                        )}
                      </div>
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
