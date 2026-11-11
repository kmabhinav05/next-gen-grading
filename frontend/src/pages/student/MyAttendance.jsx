import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsService } from '../../api/reports';
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
  Award,
  ArrowUpRight,
  Database,
  Cpu,
  Network,
  Code2,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  Layers,
  Filter,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const MyAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSem, setSelectedSem] = useState(5);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'SAFE' | 'NORMAL' | 'SHORTAGE'

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
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-44 rounded-3xl" count={4} />
        </div>
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  const subjects = data?.subjects || [];
  const summary = data?.summary || {};
  const student = data?.student || {};

  const overallPerc = Number(summary.overall_attendance_percentage || 93.1);
  const isShortage = overallPerc < 75.0;

  // Total calculations
  const totalHeld = subjects.reduce((acc, s) => acc + (s.classes_held || 0), 0) || summary.total_classes_held || 150;
  const totalAttended = subjects.reduce((acc, s) => acc + (s.classes_attended || 0), 0) || summary.total_classes_attended || 138;
  const totalMissed = Math.max(0, totalHeld - totalAttended);

  // Safe cushion calculation
  const safeLeaves = Math.max(0, Math.floor((totalAttended - 0.75 * totalHeld) / 0.75));
  const classesToRecover = Math.max(0, Math.ceil((0.75 * totalHeld - totalAttended) / 0.25));

  const safeCoursesCount = subjects.filter((s) => (s.attendance_percentage || 0) >= 75).length;

  const sanitizeFacultyName = (name) => {
    if (!name) return 'Course Instructor';
    const clean = name.replace(/^((Prof\.|Prof|Professor)\s*)+/gi, '').trim();
    return clean ? `Prof. ${clean}` : 'Course Instructor';
  };

  const getCourseTheme = (code, name) => {
    const text = `${code || ''} ${name || ''}`.toUpperCase();
    if (text.includes('501') || text.includes('DATA') || text.includes('DBMS')) {
      return {
        icon: Database,
        iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
        pillBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
        barColor: 'from-blue-600 via-indigo-500 to-indigo-600',
        glow: 'shadow-xs'
      };
    }
    if (text.includes('502') || text.includes('OPERAT') || text.includes('OS')) {
      return {
        icon: Cpu,
        iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
        pillBg: 'bg-purple-50 text-purple-700 border-purple-200 font-bold',
        barColor: 'from-purple-600 via-fuchsia-500 to-pink-500',
        glow: 'shadow-xs'
      };
    }
    if (text.includes('503') || text.includes('NET') || text.includes('COMM')) {
      return {
        icon: Network,
        iconBg: 'bg-teal-50 text-teal-600 border-teal-200/80',
        pillBg: 'bg-teal-50 text-teal-700 border-teal-200 font-bold',
        barColor: 'from-emerald-500 via-teal-500 to-cyan-500',
        glow: 'shadow-xs'
      };
    }
    if (text.includes('504') || text.includes('SOFT') || text.includes('ENG') || text.includes('CODE')) {
      return {
        icon: Code2,
        iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
        pillBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
        barColor: 'from-amber-500 via-orange-500 to-amber-600',
        glow: 'shadow-xs'
      };
    }
    return {
      icon: BookOpen,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      pillBg: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
      barColor: 'from-slate-700 to-slate-900',
      glow: 'shadow-xs'
    };
  };

  const filteredSubjects = subjects.filter((s) => {
    const perc = Number(s.attendance_percentage || 0);
    if (filterStatus === 'SAFE') return perc >= 85;
    if (filterStatus === 'NORMAL') return perc >= 75 && perc < 85;
    if (filterStatus === 'SHORTAGE') return perc < 75;
    return true;
  });

  // SVG Dial offset (r=40 -> circumference 251.2)
  const strokeOffset = 251.2 - (251.2 * Math.min(overallPerc, 100)) / 100;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. HERO TITLE & PORTAL BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#1e293b] text-white text-[11px] font-mono font-bold shadow-2xs">
              {student.reg_no || '21CS001'}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Semester {student.semester || 5} • Section {student.section || 'A'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Attendance Breakdown & Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Course-wise lecture attendance tracked against official 75% college regulations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">Semester:</span>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(Number(e.target.value))}
              className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <Link
            to="/student/progress-card"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
          >
            <span>View Progress Card</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. STATS & COMPLIANCE 4-CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Radial Dial Meter */}
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Overall Attendance</span>
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
            <span>Minimum Cutoff</span>
            <span className="font-mono font-bold text-slate-700">75.0%</span>
          </div>
        </div>

        {/* Card 2: Lecture Distribution */}
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Lectures Logged</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">{totalAttended}</span>
              <span className="text-xs text-slate-400 font-medium">/ {totalHeld} hours</span>
            </div>
            <p className="text-[11px] text-slate-500">Total verified class hours conducted this term</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Absences Recorded:</span>
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
                  Safe absence cushion before falling below the 75% examination threshold
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-rose-700 tracking-tight font-sans">
                  -{classesToRecover} Classes
                </div>
                <p className="text-[11px] text-rose-600 leading-snug">
                  Must attend next {classesToRecover} consecutive classes to clear shortage
                </p>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hall Ticket:</span>
            <span className="font-bold text-emerald-700">Eligible ✓</span>
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
            <p className="text-[11px] text-slate-500">Enrolled lecture subjects meeting compliance</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Defaulter Notices:</span>
            <span className="font-bold text-emerald-700 font-mono">0 Pending</span>
          </div>
        </div>
      </div>

      {/* Shortage Warning Banner (Conditional) */}
      {isShortage && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-sm">Attendance Shortage Alert</strong>
            Your aggregate attendance is below 75%. Please immediately meet your course faculty and submit medical / official leave intimations to prevent hall ticket suspension.
          </div>
        </div>
      )}

      {/* 3. VISUAL ATTENDANCE BREAKDOWN: DUAL-VIEW REGISTRY */}
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300">
        {/* Header Controls: Filters & View Switcher */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-slate-50/60 via-white to-slate-50/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-primary-100 text-primary-700">
                <ClipboardCheck className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Subject Attendance Registry
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Verified lecture counts and threshold compliance for Semester {student.semester || 5}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs">
              {[
                { id: 'ALL', label: `All (${subjects.length})` },
                { id: 'SAFE', label: `Safe (${subjects.filter((s) => (s.attendance_percentage || 0) >= 85).length})` },
                { id: 'NORMAL', label: `Normal (${subjects.filter((s) => (s.attendance_percentage || 0) >= 75 && (s.attendance_percentage || 0) < 85).length})` },
                { id: 'SHORTAGE', label: `Shortage (${subjects.filter((s) => (s.attendance_percentage || 0) < 75).length})` }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all ${
                    filterStatus === f.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle Button */}
            <div className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table Registry View"
                aria-label="Table Registry View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Visual Cards Grid View"
                aria-label="Visual Cards Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: Visual Interactive Cards Grid (Shown on 'cards' mode or mobile) */}
        {viewMode === 'cards' ? (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map((s) => {
              const perc = Number(s.attendance_percentage || 0);
              const isSafe = perc >= 85;
              const isNormal = perc >= 75 && perc < 85;
              const missed = Math.max(0, (s.classes_held || 0) - (s.classes_attended || 0));
              const safeMargin = Math.max(0, Math.floor(((s.classes_attended || 0) - 0.75 * (s.classes_held || 0)) / 0.75));
              const recover = Math.max(0, Math.ceil((0.75 * (s.classes_held || 0) - (s.classes_attended || 0)) / 0.25));
              const theme = getCourseTheme(s.code, s.name);
              const Icon = theme.icon;
              const cardOffset = 188.4 - (188.4 * Math.min(perc, 100)) / 100;

              return (
                <div
                  key={s.code}
                  className="p-5 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/40 to-slate-100/30 shadow-2xs hover:shadow-md transition-all space-y-4 hover:border-slate-300"
                >
                  {/* Card Header: Icon + Code + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${theme.iconBg} ${theme.glow}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${theme.pillBg}`}>
                          {s.code}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-1 leading-snug">
                          {s.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {sanitizeFacultyName(s.staff_name)}
                        </p>
                      </div>
                    </div>

                    {/* Circular Radial Gauge */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                        <circle cx="35" cy="35" r="30" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                        <circle
                          cx="35"
                          cy="35"
                          r="30"
                          stroke={isSafe ? '#10b981' : isNormal ? '#f59e0b' : '#f43f5e'}
                          strokeWidth="6"
                          strokeDasharray="188.4"
                          strokeDashoffset={cardOffset}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute font-black text-xs font-mono text-slate-900">
                        {perc}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar with 75% Pin */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Eligibility Threshold</span>
                      <span className="text-slate-400 font-medium">
                        {missed === 0 ? 'Zero Absences' : `${missed} missed`}
                      </span>
                    </div>

                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                        style={{ left: '75%' }}
                        title="75% Mandatory Attendance Target"
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${theme.barColor}`}
                        style={{ width: `${Math.min(perc, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Footer */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
                    <div className="p-2 bg-white rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold block">Attended</span>
                      <span className="font-extrabold text-slate-900 text-sm">{s.classes_attended}</span>
                    </div>
                    <div className="p-2 bg-white rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold block">Held</span>
                      <span className="font-extrabold text-slate-900 text-sm">{s.classes_held}</span>
                    </div>
                    <div className={`p-2 rounded-2xl border ${isSafe ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800' : isNormal ? 'bg-amber-50/70 border-amber-200/80 text-amber-800' : 'bg-rose-50/70 border-rose-200/80 text-rose-800'}`}>
                      <span className="text-[10px] uppercase font-sans font-semibold block">Cushion</span>
                      <span className="font-extrabold text-sm">
                        {perc >= 75 ? `+${safeMargin}` : `-${recover}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: High-Impact Visual Table View */
          <>
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
                {filteredSubjects.map((s) => {
                  const perc = Number(s.attendance_percentage || 0);
                  const isSafe = perc >= 85;
                  const isNormal = perc >= 75 && perc < 85;
                  const isShortageSubj = perc < 75.0;
                  const missed = Math.max(0, (s.classes_held || 0) - (s.classes_attended || 0));
                  const safeMargin = Math.max(0, Math.floor(((s.classes_attended || 0) - 0.75 * (s.classes_held || 0)) / 0.75));
                  const recover = Math.max(0, Math.ceil((0.75 * (s.classes_held || 0) - (s.classes_attended || 0)) / 0.25));
                  const theme = getCourseTheme(s.code, s.name);
                  const Icon = theme.icon;

                  return (
                    <tr
                      key={s.code}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Course Code with Themed Icon */}
                      <td className="px-6 py-4.5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${theme.iconBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border tracking-wide shadow-2xs ${theme.pillBg}`}>
                            {s.code}
                          </span>
                        </div>
                      </td>

                      {/* Subject Name & Faculty */}
                      <td className="px-6 py-4.5 align-middle">
                        <div className="font-bold text-slate-900 text-sm leading-snug">
                          {s.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Faculty: <span className="font-semibold text-slate-700">{sanitizeFacultyName(s.staff_name)}</span></span>
                        </div>
                      </td>

                      {/* Visual Layered Progress Bar with 75% Pin & Clear Cushion */}
                      <td className="px-6 py-4.5 align-middle min-w-[280px]">
                        <div className="space-y-1.5">
                          {/* Percentage and Missed Count Header */}
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
                            {/* 75% Cutoff Marker */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                              style={{ left: '75%' }}
                              title="75% Mandatory Attendance Target"
                            />

                            {/* Progress Fill */}
                            <div
                              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${theme.barColor} ${theme.glow}`}
                              style={{ width: `${Math.min(perc, 100)}%` }}
                            />
                          </div>

                          {/* Cushion / Safe Margin Subtext */}
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

                      {/* Status Badge */}
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
          {/* Table Summary Footer */}
          <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Continuous Internal Evaluation Attendance Log</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              <span>College Norm: 75% Cutoff</span>
              <span>•</span>
              <span>{filteredSubjects.length} of {subjects.length} Subjects</span>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};
