import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { Skeleton } from '../../components/common/Skeleton';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
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
        <Skeleton className="h-16 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-64 rounded-3xl" count={4} />
        </div>
      </div>
    );
  }

  const card = data?.progress_card;
  if (!card) {
    return (
      <div className="text-center py-16 bg-white/80 rounded-[32px] border border-slate-200">
        <p className="text-sm font-semibold text-slate-600">No academic records found for this student account.</p>
      </div>
    );
  }

  const { student, subjects, summary } = card;

  // Find highest scoring subject for peak marker
  const peakSubject = subjects && subjects.length > 0
    ? [...subjects].sort((a, b) => (b.total_ia || 0) - (a.total_ia || 0))[0]
    : null;

  const attendancePerc = summary.overall_attendance_percentage || 85.0;
  const isAttendanceShortage = attendancePerc < 75.0;
  const strokeOffset = 251.2 - (251.2 * Math.min(attendancePerc, 100)) / 100;

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER ROW (Matching Reference Design) */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome in, {student.name}
          </h1>

          {/* Segmented Progress Tracker Strip */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold">
            <div>
              <span className="text-[11px] text-slate-400 block font-normal mb-1">Registration</span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#1e293b] text-white shadow-2xs font-mono">
                {student.reg_no}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-normal mb-1">Academic Status</span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#ffc83b] text-slate-900 shadow-2xs">
                Sem {student.semester} • Section {student.section}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-normal mb-1">Department</span>
              <span className="px-4 py-1.5 rounded-full border border-dashed border-slate-300 bg-white/60 text-slate-700">
                {student.department}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-normal mb-1">Standing</span>
              <span
                className={`px-3.5 py-1.5 rounded-full border ${
                  isAttendanceShortage
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-300 bg-white text-slate-800'
                }`}
              >
                {isAttendanceShortage ? 'Attendance Shortage Alert' : 'Good Standing'}
              </span>
            </div>
          </div>
        </div>

        {/* Big Bold Stats on Right (Matching reference 78, 56, 203) */}
        <div className="flex items-center gap-6 sm:gap-10 self-start xl:self-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {summary.percentage}%
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Internal Marks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {attendancePerc}%
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Attendance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {subjects.length}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP GRID OF 4 CARDS (Matching Reference Design) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Card 1: Student Spotlight Profile Card (25%) */}
        <div className="md:col-span-12 lg:col-span-3 min-h-[290px] rounded-[28px] overflow-hidden shadow-2xs border border-slate-200/80 group flex items-center justify-center relative">
          <img
            src="/profile-student.png"
            alt="Ayaan Khan - Student"
            className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card 2: Performance Progress Card with Vertical Bars (28%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Internal Marks Progress</span>
            <Link to="/student/progress-card" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {summary.percentage}%
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Cumulative</span>
            </div>

            {/* Custom Vertical Bars Per Subject */}
            <div className="h-28 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-slate-100 relative">
              {subjects.slice(0, 4).map((sub, idx) => {
                const isPeak = peakSubject && sub.code === peakSubject.code;
                const totalScore = sub.total_ia || 0;
                // Normalize height between 28px and 96px
                const barHeight = Math.max(28, Math.min(96, Math.round((totalScore / (sub.max_total_ia || 40)) * 96)));

                return (
                  <div key={sub.code} className="flex flex-col items-center gap-1.5 flex-1 relative">
                    {isPeak && (
                      <span className="absolute -top-7 px-1.5 py-0.5 rounded-md bg-[#ffc83b] text-slate-900 font-bold text-[9px] shadow-2xs whitespace-nowrap">
                        Peak {totalScore}
                      </span>
                    )}
                    <div
                      style={{ height: `${barHeight}px` }}
                      className={`w-2.5 rounded-full transition-all ${
                        isPeak ? 'bg-[#ffc83b]' : 'bg-slate-900'
                      }`}
                    ></div>
                    <span
                      className={`text-[10px] font-medium ${
                        isPeak ? 'text-[#f59e0b] font-bold' : 'text-slate-400'
                      }`}
                    >
                      {sub.code}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Attendance Dial Tracker (25%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Attendance Tracker</span>
            <Link to="/student/attendance" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Circular Dial Representation */}
          <div className="flex flex-col items-center justify-center my-1">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={isAttendanceShortage ? '#ef4444' : '#ffc83b'}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {attendancePerc}%
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Presence</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{subjects.reduce((sum, s) => sum + (s.classes_held || 0), 0)} Classes</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isAttendanceShortage
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isAttendanceShortage ? 'Shortage Alert' : 'Good Standing'}
            </span>
          </div>
        </div>

        {/* Card 4: Dark Pipeline Checklist Card (Right Column) */}
        <div className="md:col-span-12 lg:col-span-3 bg-[#1e293b] text-white rounded-[28px] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">PTM & Exam Clearance</span>
              <span className="text-xs font-mono font-bold text-[#ffc83b]">4 / 4</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA1 Marks Published</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">100%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA2 Marks Published</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">100%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">Attendance Threshold</span>
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isAttendanceShortage ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {attendancePerc}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">Digital Progress Card</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Ready</span>
              </div>
            </div>
          </div>

          <Link
            to="/student/progress-card"
            className="w-full mt-3 py-2 text-center rounded-xl bg-[#ffc83b] text-slate-900 font-bold text-xs hover:bg-[#eab308] transition-colors block shadow-xs"
          >
            Open Progress Card
          </Link>
        </div>
      </div>

      {/* 3. BOTTOM GRID (Course Marks Accordion + Student Class Timetable) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Course Performance Accordion (35%) */}
        <div className="lg:col-span-4 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Enrolled Course Scores
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {subjects.length} Subjects
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {subjects.map((sub) => (
              <div
                key={sub.code}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="truncate">{sub.code}: {sub.name}</span>
                  <span className="text-[11px] font-mono text-[#f59e0b] ml-2">
                    {sub.total_ia ?? '-'}/{sub.max_total_ia}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                  <span className="truncate">Faculty: {sub.staff_name || 'Prof. Faculty'}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      (sub.attendance_percentage || 0) < 75
                        ? 'bg-red-50 text-red-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {sub.attendance_percentage || 0}% Attended
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Academic Timetable Calendar Schedule (65%) */}
        <div className="lg:col-span-8 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">September</span>
              <span className="text-sm font-extrabold text-slate-900 px-3 py-1 bg-slate-100 rounded-full">
                October 2026
              </span>
              <span className="text-xs font-semibold text-slate-400">November</span>
            </div>
            <span className="text-xs font-bold text-[#f59e0b]">Class & Exam Timetable</span>
          </div>

          {/* Weekday Strip */}
          <div className="grid grid-cols-6 gap-2 text-center text-xs pb-3 border-b border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] block">Mon</span>
              <strong className="text-slate-800 text-sm">22</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Tue</span>
              <strong className="text-slate-800 text-sm">23</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Wed</span>
              <strong className="text-slate-800 text-sm">24</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Thu</span>
              <strong className="text-slate-800 text-sm">25</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Fri</span>
              <strong className="text-slate-800 text-sm">26</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Sat</span>
              <strong className="text-slate-800 text-sm">27</strong>
            </div>
          </div>

          {/* Timeline slots */}
          <div className="mt-3 space-y-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="w-16 font-mono text-slate-400 text-[11px]">09:00 am</span>
              <div className="flex-1 p-2.5 rounded-2xl bg-[#1e293b] text-white flex items-center justify-between shadow-2xs">
                <div>
                  <h4 className="font-bold text-xs">CS501: Database Management Systems</h4>
                  <p className="text-[10px] text-slate-300">Room 304 • Prof. Sharma</p>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-700 text-[#ffc83b] font-semibold">
                  Lecture
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-16 font-mono text-slate-400 text-[11px]">11:00 am</span>
              <div className="flex-1 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-2xs">
                <div>
                  <h4 className="font-bold text-xs">CS502: Operating Systems Lab</h4>
                  <p className="text-[10px] text-amber-700">Systems Lab 2 • Practical Evaluation</p>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">
                  Lab Practical
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-16 font-mono text-slate-400 text-[11px]">02:00 pm</span>
              <div className="flex-1 p-2 rounded-xl border border-dashed border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                <span>Parent–Teacher Meeting (PTM) & Digital Progress Card Counseling</span>
                <span className="text-[10px] font-semibold text-slate-400">Seminar Hall</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
