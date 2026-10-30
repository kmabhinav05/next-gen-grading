import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { getTimeGreeting } from '../../utils/greeting';
import {
  ArrowUpRight,
  BookOpen,
  Users,
  Upload,
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  FileSpreadsheet,
  Award,
  AlertTriangle,
  Send,
  Mail,
  HelpCircle,
  MessageSquare,
  CalendarCheck,
  Calendar,
  Check,
  X,
  FileText,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { communicationsService } from '../../api/communications';
import { playHapticChime } from '../../utils/sound';
import { GlassCalendar } from '@/components/ui/glass-calendar';
import { format } from 'date-fns';

export const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShortageModalOpen, setIsShortageModalOpen] = useState(false);
  const [communications, setCommunications] = useState(() => communicationsService.getAll());
  const [commFilter, setCommFilter] = useState('ALL');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date(2026, 9, 30));
  const [calendarNotes, setCalendarNotes] = useState({
    '2026-10-30': 'Finalize IA2 mark entry and submit shortage list'
  });

  useEffect(() => {
    const handleUpdate = () => {
      setCommunications(communicationsService.getAll());
    };
    window.addEventListener('communications-updated', handleUpdate);
    return () => window.removeEventListener('communications-updated', handleUpdate);
  }, []);

  const handleApproveComm = (id, type) => {
    communicationsService.updateStatus(id, type === 'PTM' ? 'Confirmed' : 'Acknowledged');
    playHapticChime();
    toast.success(
      type === 'PTM'
        ? 'PTM Consultation slot confirmed and meeting link emailed to parent!'
        : 'Ward medical absence note acknowledged.'
    );
  };

  const handleDeclineComm = (id) => {
    communicationsService.updateStatus(id, 'Declined');
    playHapticChime();
    toast.error('Consultation request declined. Notification sent to parent.');
  };

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

  const assignedSubjects = data?.assigned_subjects || [];
  const recentLogs = data?.recent_logs || [];
  const totalEnrolled = assignedSubjects.reduce((acc, s) => acc + (s.enrolled_students || 0), 0) || 6;
  const timeGreeting = getTimeGreeting();

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER ROW (Matching Reference Design) */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 pb-2">
        <div>
          <div>
            <span className="text-sm sm:text-base font-bold text-[#f59e0b] block tracking-wide">
              {timeGreeting},
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-500 block mt-0.5">
              Welcome in,
            </span>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {data?.staff_name || 'Arjun Menon'}
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

          {/* Segmented Progress Tracker Strip - Exact 4 Pills Design */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Teaching</span>
              <span className="px-4 py-1.5 rounded-full bg-[#1e293b] text-white font-bold text-xs shadow-2xs inline-block">
                {assignedSubjects.length || 2} Courses Assigned
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">IA Assessment</span>
              <span className="px-4 py-1.5 rounded-full bg-[#fbc02d] text-slate-900 font-bold text-xs shadow-2xs inline-block">
                IA1 & IA2 Active
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Enrolled</span>
              <span className="px-4 py-1.5 rounded-full border border-dashed border-slate-300/90 bg-white/50 text-slate-700 font-semibold text-xs inline-block">
                {totalEnrolled} Registered Students
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Department</span>
              <span className="px-4 py-1.5 rounded-full border border-slate-200/90 bg-white text-slate-800 font-bold text-xs shadow-2xs inline-block">
                {data?.department || 'Computer Science & Engineering'}
              </span>
            </div>
          </div>
        </div>

        {/* Big Bold Stats on Right (Matching reference 78, 56, 203) */}
        <div className="flex items-center gap-6 sm:gap-10 self-start xl:self-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {totalEnrolled}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Enrolled</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <BookOpen className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {assignedSubjects.length || 2}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Subjects</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {recentLogs.length || 4}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Excel Uploads</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP GRID OF 4 CARDS (Matching Reference Design) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Card 1: Spotlight Profile Card (25%) */}
        <div className="md:col-span-12 lg:col-span-3 min-h-[290px] rounded-[28px] overflow-hidden shadow-2xs border border-slate-200/80 group flex items-center justify-center relative">
          <img
            src="/profile-staff.png"
            alt="Arjun Menon - Senior Teacher"
            className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card 2: Performance Progress Card with Vertical Bars (28%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Class IA Average</span>
            <Link to="/staff/class-report" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">85.4%</span>
              <span className="text-[11px] text-slate-500 font-medium">Batch Score</span>
            </div>

            {/* Custom Vertical Bars */}
            <div className="h-28 flex items-end justify-between gap-3 mt-4 pt-4 border-t border-slate-100 relative">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-16 bg-slate-900 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium">IA 1</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                <span className="absolute -top-7 px-1.5 py-0.5 rounded-md bg-[#ffc83b] text-slate-900 font-bold text-[9px] shadow-2xs whitespace-nowrap">
                  18.5 / 20
                </span>
                <div className="w-2.5 h-24 bg-[#ffc83b] rounded-full"></div>
                <span className="text-[10px] font-bold text-[#f59e0b]">IA 2</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-12 bg-slate-200 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium">IA 3</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-20 bg-slate-900 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium">Sem Avg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Attendance Tracker Dial (25%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Attendance Logged</span>
            <Link to="/staff/attendance" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Circular Dial Meter */}
          <div className="flex flex-col items-center justify-center my-1">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#ffc83b"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="24"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">91.2%</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Logged</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>42 Hours Held</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Up to Date
            </span>
          </div>
        </div>

        {/* Card 4: Dark Pipeline Checklist Card (Right Column) */}
        <div className="md:col-span-12 lg:col-span-3 bg-[#1e293b] text-white rounded-[28px] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Faculty Task Pipeline</span>
              <span className="text-xs font-mono font-bold text-[#ffc83b]">3 / 4</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA1 Excel Ingested</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA2 Excel Ingested</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">Attendance Registry</span>
                </div>
                <span className="text-[10px] text-slate-300">Logged</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 truncate text-slate-400">
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="truncate">PTM Signoff Review</span>
                </div>
                <span className="text-[9px] text-[#ffc83b] font-semibold">Pending</span>
              </div>
            </div>
          </div>

          <Link
            to="/staff/upload-marks"
            className="w-full mt-3 py-2 text-center rounded-xl bg-[#ffc83b] text-slate-900 font-bold text-xs hover:bg-[#eab308] transition-colors block shadow-xs"
          >
            Upload Marks Spreadsheet
          </Link>
        </div>
      </div>

      {/* 3. BOTTOM GRID (Assigned Subjects Accordion + Faculty Lecture Timetable) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Assigned Subjects with Action Buttons (35%) */}
        <div className="lg:col-span-4 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Assigned Subjects
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {assignedSubjects.length} Courses
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {assignedSubjects.length > 0 ? (
              assignedSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate">{sub.code}: {sub.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-white flex-shrink-0 ml-2">
                      Sem {sub.semester}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                    <span>{sub.enrolled_students} Students</span>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                        IA1: {sub.marks_status?.IA1}
                      </span>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                        IA2: {sub.marks_status?.IA2}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400">No subjects currently assigned.</div>
            )}
          </div>
        </div>

        {/* Right: Faculty Timetable & Counseling Schedule (65%) */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCalendar
            selectedDate={selectedCalendarDate}
            onDateSelect={(d) => {
              setSelectedCalendarDate(d);
              playHapticChime();
            }}
            onAddNote={(d) => {
              const key = format(d, 'yyyy-MM-dd');
              const text = window.prompt(`Add faculty reminder for ${format(d, 'MMM d, yyyy')}:`, calendarNotes[key] || '');
              if (text !== null) {
                setCalendarNotes((prev) => ({ ...prev, [key]: text }));
                toast.success(`Faculty note saved for ${format(d, 'MMM d')}`);
                playHapticChime();
              }
            }}
            onNewEvent={(d) => {
              toast.success(`Lecture / Office hours scheduler opened for ${format(d, 'MMM d, yyyy')}`);
              playHapticChime();
            }}
            className="w-full"
          />

          {/* Daily Schedule Details for Selected Date */}
          <div className="bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Teaching Timetable: <span className="text-indigo-600 font-semibold">{format(selectedCalendarDate, 'EEEE, MMM d, yyyy')}</span>
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Department of CSE
              </span>
            </div>

            {/* Note badge if present */}
            {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')] && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <span className="font-medium">📌 Faculty Memo: {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')]}</span>
                <button
                  type="button"
                  onClick={() => {
                    const key = format(selectedCalendarDate, 'yyyy-MM-dd');
                    const next = { ...calendarNotes };
                    delete next[key];
                    setCalendarNotes(next);
                  }}
                  className="text-amber-600 hover:text-amber-800 text-[10px] font-bold"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-4">
                <span className="w-16 font-mono text-slate-400 text-[11px]">09:00 am</span>
                <div className="flex-1 p-2.5 rounded-2xl bg-[#1e293b] text-white flex items-center justify-between shadow-2xs">
                  <div>
                    <h4 className="font-bold text-xs">CS501: Database Management Lecture</h4>
                    <p className="text-[10px] text-slate-300">Section A • Room 304 (Query Optimization)</p>
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
                    <h4 className="font-bold text-xs">Lab Session: SQL Indexing Practical</h4>
                    <p className="text-[10px] text-amber-700">Lab 2 • Attendance register verification</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">
                    Lab Session
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-16 font-mono text-slate-400 text-[11px]">02:30 pm</span>
                <div className="flex-1 p-2 rounded-xl border border-dashed border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                  <span>Student Academic Mentoring & Parent Counseling Clinic</span>
                  <span className="text-[10px] font-semibold text-slate-400">Office Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STAFF SHORTAGE & REMEDIAL ADVISORY CENTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Attendance Defaulter Warning Center
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Students identified below the mandatory 75% threshold in your assigned courses.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsShortageModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold hover:bg-rose-100 transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Review Shortage List & Send Notices</span>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Remedial Class Counseling Group
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Organize special tutoring sessions for students scoring below 40% in internal tests.
            </p>
          </div>
          <Link
            to="/staff/class-report"
            className="w-full py-2.5 px-4 rounded-2xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Class Performance Register</span>
          </Link>
        </div>
      </div>

      {/* 4. PARENT COMMUNICATIONS & PTM CONSULTATION INBOX */}
      <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Parent Communications & PTM Consultation Inbox</span>
                  {communications.filter((c) => c.status === 'Pending').length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                      {communications.filter((c) => c.status === 'Pending').length} Pending Action
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500">
                  Direct requests from registered parents: Online/Offline PTM consultation slots and medical absence intimations.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/70 text-xs font-semibold">
            {[
              { id: 'ALL', label: `All (${communications.length})` },
              { id: 'PTM', label: `PTM Meetings (${communications.filter((c) => c.type === 'PTM').length})` },
              { id: 'LEAVE', label: `Absence Notes (${communications.filter((c) => c.type === 'LEAVE').length})` },
              { id: 'PENDING', label: `Needs Review (${communications.filter((c) => c.status === 'Pending').length})` }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCommFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  commFilter === f.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Parent Communications */}
        {communications.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 text-slate-400 text-xs">
            No parent communications or consultation requests received yet.
          </div>
        ) : (
          <div className="space-y-3">
            {communications
              .filter((c) => {
                if (commFilter === 'PTM') return c.type === 'PTM';
                if (commFilter === 'LEAVE') return c.type === 'LEAVE';
                if (commFilter === 'PENDING') return c.status === 'Pending';
                return true;
              })
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.type === 'PTM'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.type === 'PTM' ? 'PTM Consultation' : 'Absence Intimation'}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.parentName}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-600">
                        Ward: <strong className="text-slate-800">{item.studentName}</strong> ({item.regNo})
                      </span>
                      <span className="text-[11px] text-slate-400 ml-auto font-mono">{item.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                      {item.type === 'PTM' ? item.notes : item.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      {item.type === 'PTM' ? (
                        <>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            {item.date} • {item.timeSlot}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-slate-400" />
                            {item.mode}
                          </span>
                          <span>•</span>
                          <span>Subject: {item.subject}</span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            Leave Duration: {item.startDate} to {item.endDate}
                          </span>
                          <span>•</span>
                          <span className="text-amber-800 font-semibold">{item.leaveType}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveComm(item.id, item.type)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{item.type === 'PTM' ? 'Approve & Confirm Slot' : 'Acknowledge Leave'}</span>
                        </button>
                        {item.type === 'PTM' && (
                          <button
                            type="button"
                            onClick={() => handleDeclineComm(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold shadow-2xs transition-all flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        )}
                      </>
                    ) : item.status === 'Confirmed' || item.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Slot Confirmed</span>
                      </span>
                    ) : item.status === 'Acknowledged' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Leave Excused</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                        <X className="w-3.5 h-3.5 text-rose-500" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Shortage Advisory Modal */}
      <Modal isOpen={isShortageModalOpen} onClose={() => setIsShortageModalOpen(false)} title="Attendance Shortage Advisory Notice">
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            The following student(s) currently fail to meet the mandatory 75% lecture attendance threshold in your classes:
          </p>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Ananya Sen (21CS004)</span>
              <span className="text-rose-700 font-mono">70.0% Critical</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Course: CS502 Operating Systems (Sem 5, Sec A)</span>
              <span>28 Attended / 40 Held</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Notice Actions:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Dispatches official email advisory to student institutional inbox.</li>
              <li>Alerts registered parent guardian mobile number.</li>
              <li>Generates audit entry for Controller of Examinations (COE).</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsShortageModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success('Official Shortage Warning dispatched to student & guardian!');
                setIsShortageModalOpen(false);
              }}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold shadow-xs hover:bg-rose-700 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Warning Notice</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
