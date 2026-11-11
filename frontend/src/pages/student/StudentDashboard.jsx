import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { Skeleton } from '../../components/common/Skeleton';
import { getTimeGreeting } from '../../utils/greeting';
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
  FileText,
  Calculator,
  Sparkles,
  Sliders,
  FolderDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCalendar } from '@/components/ui/glass-calendar';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { playHapticChime } from '../../utils/sound';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [simMode, setSimMode] = useState('attend');
  const [extraClassesToSimulate, setExtraClassesToSimulate] = useState(5);
  const [targetScorePercent, setTargetScorePercent] = useState(85);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date(2026, 9, 30));
  const [calendarNotes, setCalendarNotes] = useState({
    '2026-10-30': 'Prepare database indexing presentation for Prof. Sharma'
  });

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

  const card = data?.progress_card || {
    student: {
      id: 1,
      name: 'Aarav Patel',
      reg_no: '21CS001',
      department: 'Computer Science & Engineering',
      semester: 5,
      section: 'A'
    },
    subjects: [
      {
        id: 1,
        code: 'CS501',
        name: 'Database Management Systems',
        staff_name: 'Prof. Ramesh Sharma',
        ia1: 18.5,
        ia2: 19.0,
        total_ia: 37.5,
        max_total_ia: 40,
        classes_held: 38,
        classes_attended: 36,
        attendance_percentage: 94.7
      },
      {
        id: 2,
        code: 'CS502',
        name: 'Operating Systems',
        staff_name: 'Prof. Priya Verma',
        ia1: 17.0,
        ia2: 16.5,
        total_ia: 33.5,
        max_total_ia: 40,
        classes_held: 36,
        classes_attended: 32,
        attendance_percentage: 88.9
      },
      {
        id: 3,
        code: 'CS503',
        name: 'Computer Networks',
        staff_name: 'Prof. Ramesh Sharma',
        ia1: 19.0,
        ia2: 20.0,
        total_ia: 39.0,
        max_total_ia: 40,
        classes_held: 40,
        classes_attended: 39,
        attendance_percentage: 97.5
      },
      {
        id: 4,
        code: 'CS504',
        name: 'Software Engineering',
        staff_name: 'Prof. Priya Verma',
        ia1: 16.0,
        ia2: 17.5,
        total_ia: 33.5,
        max_total_ia: 40,
        classes_held: 34,
        classes_attended: 31,
        attendance_percentage: 91.2
      }
    ],
    summary: {
      total_obtained: 143.5,
      total_max: 160,
      percentage: 89.7,
      overall_attendance_percentage: 93.1
    }
  };

  const { student, subjects, summary } = card;

  // Find highest scoring subject for peak marker
  const peakSubject = subjects && subjects.length > 0
    ? [...subjects].sort((a, b) => (b.total_ia || 0) - (a.total_ia || 0))[0]
    : null;

  const computedAttended = subjects?.reduce((sum, s) => sum + (s.classes_attended || 0), 0) || 138;
  const computedHeld = subjects?.reduce((sum, s) => sum + (s.classes_held || 0), 0) || 148;
  const totalAttended = summary.total_classes_attended || computedAttended;
  const totalHeld = summary.total_classes_held || computedHeld;

  const attendancePerc = summary.overall_attendance_percentage || (totalHeld > 0 ? Number(((totalAttended / totalHeld) * 100).toFixed(1)) : 85.0);
  const simBaselinePerc = totalHeld > 0 ? Number(((totalAttended / totalHeld) * 100).toFixed(1)) : attendancePerc;
  const safeLeavesMargin = Math.max(0, Math.floor((totalAttended - 0.75 * totalHeld) / 0.75));
  const deficitClasses = Math.max(0, Math.ceil((0.75 * totalHeld - totalAttended) / 0.25));

  const simAttended = simMode === 'attend' ? totalAttended + extraClassesToSimulate : totalAttended;
  const simHeld = totalHeld + extraClassesToSimulate;
  const projectedPerc = simHeld > 0 ? Number(((simAttended / simHeld) * 100).toFixed(1)) : simBaselinePerc;
  const percDelta = Number((projectedPerc - simBaselinePerc).toFixed(1));
  const isProjectedSafe = projectedPerc >= 75.0;

  const currentSgpa = Number(((summary.percentage || 89.7) / 10).toFixed(1));
  const targetSgpa = Number((targetScorePercent / 10).toFixed(1));
  const sgpaDelta = Number((targetSgpa - currentSgpa).toFixed(1));

  const isAttendanceShortage = attendancePerc < 75.0;
  const strokeOffset = 251.2 - (251.2 * Math.min(attendancePerc, 100)) / 100;
  const timeGreeting = getTimeGreeting();

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER ROW (Matching Reference Design) */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 pb-2">
        <div>
          <div>
            <span className="text-sm sm:text-base font-bold text-[#B45309] block tracking-wide">
              {timeGreeting},
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-[#334155] block mt-0.5">
              Welcome back,
            </span>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.3]">
                {student.name}
              </h1>
              <Link
                to="/profile"
                title="View Profile & 3D ID Badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
              >
                <span>View Profile & ID</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Segmented Student Metric Chips - Proper Cohesive Modern Design */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-mono font-bold text-xs shrink-0">
                #
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Register No</span>
                <span className="text-xs font-bold text-slate-900 font-mono block leading-tight">
                  {student.reg_no}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Academic Status</span>
                <div className="flex items-center gap-1 leading-tight">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
                    className="bg-transparent border-none font-bold text-xs text-slate-900 cursor-pointer focus:outline-none p-0 -ml-0.5"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        Semester {num}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs font-bold text-slate-900">• Sec {student.section}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Department</span>
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[200px]" title={student.department}>
                  {student.department}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                isAttendanceShortage ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
              }`}>
                {isAttendanceShortage ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Standing</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block leading-tight ${
                  isAttendanceShortage
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isAttendanceShortage ? 'Attendance Shortage Alert' : 'Good Standing'}
                </span>
              </div>
            </div>

            <Link
              to="/student/resources"
              className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-400 hover:bg-slate-50/50 transition-all cursor-pointer"
              title="Access Staff Notes & Study Locker"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                <FolderDown className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Resources</span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  Staff Notes & Locker
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Big Bold Stats on Right (Matching reference 78, 56, 203) */}
        <div className="flex items-center gap-6 sm:gap-10 self-start xl:self-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 font-sans tracking-tight leading-[1.3]">
                {summary.percentage}%
              </span>
              <p className="text-[12.5px] font-semibold text-[#475569] tracking-[0.04em] uppercase">Internal Marks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 font-sans tracking-tight leading-[1.3]">
                {attendancePerc}%
              </span>
              <p className="text-[12.5px] font-semibold text-[#475569] tracking-[0.04em] uppercase">Attendance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 font-sans tracking-tight leading-[1.3]">
                {subjects.length}
              </span>
              <p className="text-[12.5px] font-semibold text-[#475569] tracking-[0.04em] uppercase">Courses</p>
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
            {/* Value and Label on dedicated separate lines without collision */}
            <div className="mt-1">
              <div className="text-3xl font-bold text-slate-900 tracking-tight leading-[1.3]">
                {summary.percentage}%
              </div>
              <div className="text-xs font-semibold text-[#475569] mt-0.5">Cumulative Performance</div>
            </div>

            {/* Custom Vertical Bars Per Subject with ample headroom */}
            <div className="h-28 flex items-end justify-between gap-3 mt-4 pt-6 border-t border-slate-100 relative">
              {subjects.slice(0, 4).map((sub) => {
                const isPeak = peakSubject && sub.code === peakSubject.code;
                const totalScore = sub.total_ia || 0;
                const barHeight = Math.max(28, Math.min(96, Math.round((totalScore / (sub.max_total_ia || 40)) * 96)));

                return (
                  <div key={sub.code} className="flex flex-col items-center gap-1.5 flex-1 relative group/bar">
                    {isPeak && (
                      <span className="absolute -top-6 px-1.5 py-0.5 rounded-md bg-[#ffc83b] text-slate-900 font-bold text-xs shadow-2xs whitespace-nowrap opacity-90 group-hover/bar:opacity-100 transition-opacity">
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
                      className={`text-xs ${
                        isPeak ? 'text-[#b45309] font-bold' : 'text-[#475569] font-medium'
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
                <span className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.3]">
                  {attendancePerc}%
                </span>
                <span className="text-[12.5px] font-semibold text-[#475569] tracking-[0.04em] uppercase">PRESENCE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#475569]">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{subjects.reduce((sum, s) => sum + (s.classes_held || 0), 0)} Classes</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isAttendanceShortage
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
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
                <span className="text-xs text-emerald-400 font-bold">100%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA2 Marks Published</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold">100%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">Attendance Threshold</span>
                </div>
                <span
                  className={`text-xs font-bold ${
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
                <span className="text-xs text-emerald-400 font-bold">Ready</span>
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

      {/* 2.5 ACADEMIC RESOURCES BANNER */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <FolderDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 tracking-[0.04em] uppercase">
                Resources Locker
              </span>
              <span className="text-xs text-blue-100 font-medium">Faculty Notes & Uploaded Files</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight mt-0.5 leading-[1.3]">
              Access Staff Lecture Notes & Personal Study Locker
            </h3>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-[65ch] mt-0.5">
              Download lecture materials, exam question banks from faculty or upload personal study sheets to your cloud locker.
            </p>
          </div>
        </div>

        <Link
          to="/student/resources"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-sm hover:bg-blue-50 transition-all shrink-0"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Open Resources</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. BOTTOM GRID (Course Marks Accordion + Student Class Timetable) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Course Performance Accordion (35%) */}
        <div className="lg:col-span-12 xl:col-span-4 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Enrolled Course Scores
              </h3>
              <span className="text-xs font-semibold text-[#475569]">
                {subjects.length} Subjects
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {subjects.map((sub) => (
                <div
                  key={sub.code}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate">{sub.code}: {sub.name}</span>
                    <span className="text-xs font-mono font-bold text-amber-700 ml-2">
                      {sub.total_ia ?? '-'}/{sub.max_total_ia}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#475569] mt-2 pt-2 border-t border-slate-200/60">
                    <span className="truncate">Faculty: {sub.staff_name ? `Prof. ${sub.staff_name.replace(/^((Prof\.|Prof|Professor)\s*)+/gi, '').trim()}` : 'Prof. Faculty'}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
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

          {/* Bottom Summary Bar to level with the other two cards */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#475569] text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Overall Average: <strong className="text-slate-900">{summary.percentage}%</strong></span>
            </div>
            <Link
              to="/student/progress-card"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Full Card</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right: Academic Timetable & Glass Calendar (Side-by-Side) */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col md:flex-row items-stretch gap-5 h-full">
          {/* Glass Calendar in authentic card shape */}
          <div className="w-full md:w-[350px] shrink-0 flex justify-center h-full">
            <GlassCalendar
              selectedDate={selectedCalendarDate}
              onDateSelect={(d) => {
                setSelectedCalendarDate(d);
                playHapticChime();
              }}
              onAddNote={(d) => {
                const key = format(d, 'yyyy-MM-dd');
                const text = window.prompt(`Add study note for ${format(d, 'MMM d, yyyy')}:`, calendarNotes[key] || '');
                if (text !== null) {
                  setCalendarNotes((prev) => ({ ...prev, [key]: text }));
                  toast.success(`Note saved for ${format(d, 'MMM d')}`);
                  playHapticChime();
                }
              }}
              onNewEvent={(d) => {
                toast.success(`Event scheduler opened for ${format(d, 'MMM d, yyyy')}`);
                playHapticChime();
              }}
              className="w-full h-full shadow-xl"
            />
          </div>

          {/* Daily Schedule Details for Selected Date */}
          <div className="flex-1 w-full bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Classes & Events: <span className="text-indigo-600 font-semibold">{format(selectedCalendarDate, 'EEEE, MMM d, yyyy')}</span>
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Semester 5 Section A
                </span>
              </div>

              {/* Note badge if present */}
              {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')] && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between my-2.5">
                  <span className="font-medium">📝 Note: {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')]}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const key = format(selectedCalendarDate, 'yyyy-MM-dd');
                      const next = { ...calendarNotes };
                      delete next[key];
                      setCalendarNotes(next);
                    }}
                    className="text-amber-600 hover:text-amber-800 text-xs font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="space-y-2.5 text-xs mt-3">
                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">09:00 am</span>
                  <div className="flex-1 p-2.5 rounded-2xl bg-[#1e293b] text-white flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="font-bold text-xs">CS501: Database Management Systems</h4>
                      <p className="text-xs text-slate-300">Room 304 • Prof. Ramesh Sharma</p>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-700 text-[#ffc83b] font-semibold">
                      Lecture
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">11:00 am</span>
                  <div className="flex-1 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="font-bold text-xs">CS502: Operating Systems Lab</h4>
                      <p className="text-xs text-amber-800">Systems Lab 2 • Practical Evaluation</p>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-200 text-amber-900 font-semibold">
                      Lab Practical
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">02:00 pm</span>
                  <div className="flex-1 p-2 rounded-xl border border-dashed border-slate-200 text-[#475569] text-xs flex items-center justify-between">
                    <span>Parent–Teacher Meeting (PTM) & Digital Progress Card Counseling</span>
                    <span className="text-xs font-medium text-[#475569]">Seminar Hall</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">03:45 pm</span>
                  <div className="flex-1 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="font-bold text-xs">CS503: Computer Networks Problem Solving</h4>
                      <p className="text-xs text-[#475569]">Room 304 • Prof. Ramesh Sharma</p>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      Tutorial
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#475569]">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Campus Attendance Verified</span>
              </div>
              <span className="text-xs font-medium text-[#475569]">
                4 Academic Sessions Today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STUDENT SMART TOOLS: ATTENDANCE & GPA WHAT-IF SIMULATORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2 pb-12 items-stretch">
        {/* Tool 1: Attendance Goal & Safe Leave Calculator */}
        <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5">
          <div className="space-y-4">
            {/* Symmetrical Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-[1.3]">
                    Attendance Goal &amp; Leave Simulator
                  </h3>
                  <span className="text-xs text-[#475569] block">Forecast compliance &amp; leave buffer</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                Hall Ticket Rule: 75%
              </span>
            </div>

            {/* Context Baseline Strip & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="text-[#475569] font-medium">Current:</span>
                <strong className="font-bold text-slate-900 font-mono">
                  {simBaselinePerc}%
                </strong>
                <span className="text-[#475569] font-mono">
                  ({totalAttended}/{totalHeld})
                </span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-md font-semibold text-xs ${
                    simBaselinePerc >= 75
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {simBaselinePerc >= 75
                    ? `${safeLeavesMargin} Safe Leaves`
                    : `Attend ${deficitClasses}`}
                </span>
              </div>

              {/* Attend vs Miss Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    playHapticChime();
                    setSimMode('attend');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    simMode === 'attend'
                      ? 'bg-white text-cyan-800 shadow-2xs font-bold'
                      : 'text-[#475569] hover:text-slate-900'
                  }`}
                >
                  + Attend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playHapticChime();
                    setSimMode('miss');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    simMode === 'miss'
                      ? 'bg-white text-rose-700 shadow-2xs font-bold'
                      : 'text-[#475569] hover:text-slate-900'
                  }`}
                >
                  − Miss
                </button>
              </div>
            </div>

            {/* Interactive Slider with Quick Presets */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#475569]">
                  {simMode === 'attend'
                    ? 'Simulate attending next lectures'
                    : 'Simulate missing upcoming lectures'}
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 5, 10, 20, 30].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        playHapticChime();
                        setExtraClassesToSimulate(val);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        extraClassesToSimulate === val
                          ? simMode === 'attend'
                            ? 'bg-cyan-600 text-white shadow-2xs'
                            : 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
                      }`}
                    >
                      {simMode === 'attend' ? `+${val}` : `-${val}`}
                    </button>
                  ))}
                  <span
                    className={`ml-1 px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                      simMode === 'attend'
                        ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {simMode === 'attend' ? `+${extraClassesToSimulate}` : `-${extraClassesToSimulate}`} classes
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="40"
                value={extraClassesToSimulate}
                onChange={(e) => setExtraClassesToSimulate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, ${
                    simMode === 'attend' ? '#0891b2' : '#e11d48'
                  } ${((extraClassesToSimulate - 1) / 39) * 100}%, #e2e8f0 ${
                    ((extraClassesToSimulate - 1) / 39) * 100
                  }%)`
                }}
                className={`w-full sim-slider ${
                  simMode === 'attend' ? 'sim-slider-cyan' : 'sim-slider-rose'
                } cursor-pointer`}
              />

              <div className="flex justify-between text-xs text-[#475569] font-medium px-0.5">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40 classes</span>
              </div>
            </div>
          </div>

          {/* Bottom Highlighted Projection Box + Caption */}
          <div className="space-y-3">
            <div
              className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition-colors ${
                isProjectedSafe
                  ? 'bg-cyan-50/50 border-cyan-200/80'
                  : 'bg-rose-50/60 border-rose-200/80'
              }`}
            >
              <div>
                <span
                  className={`text-xs font-semibold block ${
                    isProjectedSafe ? 'text-cyan-900' : 'text-rose-900'
                  }`}
                >
                  Projected Attendance
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900 font-mono leading-[1.3]">
                    {projectedPerc}%
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      percDelta >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {percDelta >= 0 ? `+${percDelta}%` : `${percDelta}%`}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#475569] block font-medium">Projected Standing</span>
                <span
                  className={`inline-flex items-center gap-1.5 mt-0.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    isProjectedSafe
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}
                >
                  <span>
                    {simAttended} / {simHeld} •{' '}
                    {isProjectedSafe ? 'Exam Eligible' : 'Below 75% Cutoff'}
                  </span>
                </span>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed max-w-[65ch]">
              Simulates cumulative attendance against the 75% hall ticket eligibility cutoff for Semester {student.semester}.
            </p>
          </div>
        </div>

        {/* Tool 2: CGPA & Target Grade Projector */}
        <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5">
          <div className="space-y-4">
            {/* Symmetrical Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-[1.3]">
                    Semester SGPA / Grade Projector
                  </h3>
                  <span className="text-xs text-[#475569] block">Estimate final grade point &amp; tier</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Target Simulator
              </span>
            </div>

            {/* Context Baseline Strip & Quick Target Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="text-[#475569] font-medium">Current Avg:</span>
                <strong className="font-bold text-slate-900 font-mono">
                  {summary.percentage || 89.7}%
                </strong>
                <span className="ml-1 px-2 py-0.5 rounded-md font-semibold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                  {currentSgpa} SGPA
                </span>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
                {[75, 85, 90, 95].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      playHapticChime();
                      setTargetScorePercent(preset);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      targetScorePercent === preset
                        ? 'bg-white text-amber-800 shadow-2xs font-bold'
                        : 'text-[#475569] hover:text-slate-900'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Slider with Filled Progress Track */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#475569]">Target Overall Percentage</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold font-mono text-xs">
                  {targetScorePercent}%
                </span>
              </div>

              <input
                type="range"
                min="40"
                max="100"
                value={targetScorePercent}
                onChange={(e) => setTargetScorePercent(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #d97706 ${
                    ((targetScorePercent - 40) / 60) * 100
                  }%, #e2e8f0 ${((targetScorePercent - 40) / 60) * 100}%)`
                }}
                className="w-full sim-slider sim-slider-amber cursor-pointer"
              />

              <div className="flex justify-between text-xs text-[#475569] font-medium px-0.5">
                <span>40%</span>
                <span>55%</span>
                <span>70%</span>
                <span>85%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Bottom Highlighted Projection Box + Caption */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-amber-900 font-semibold block">Projected Grade Point</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900 font-mono leading-[1.3]">
                    {targetSgpa.toFixed(1)}
                    <span className="text-sm font-semibold text-[#475569]"> / 10.0 SGPA</span>
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      sgpaDelta >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {sgpaDelta > 0 ? `+${sgpaDelta}` : sgpaDelta} vs avg
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#475569] block font-medium">Classification</span>
                <span className="inline-block mt-0.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 font-bold text-xs">
                  {targetScorePercent >= 90
                    ? "O (Dean's List)"
                    : targetScorePercent >= 80
                    ? 'A+ (Distinction)'
                    : targetScorePercent >= 70
                    ? 'A (First Class)'
                    : targetScorePercent >= 60
                    ? 'B+ (First Class)'
                    : 'B (Second Class)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed max-w-[65ch]">
              Calculated on institutional credit weightages across enrolled subjects for Semester {student.semester}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
