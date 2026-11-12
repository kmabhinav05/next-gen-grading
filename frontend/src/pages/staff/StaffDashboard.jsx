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
  const [selectedSemester, setSelectedSemester] = useState('');
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
  const filteredSubjects = selectedSemester
    ? assignedSubjects.filter((s) => String(s.semester || s.semester_number) === String(selectedSemester))
    : assignedSubjects;
  const totalEnrolled = assignedSubjects.reduce((acc, s) => acc + (s.enrolled_students || 0), 0) || 6;
  const timeGreeting = getTimeGreeting();

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER ROW */}
      <div className="space-y-4 pb-2">
        <div>
          <span className="text-sm sm:text-base font-bold text-[#B45309] block tracking-wide">
            {timeGreeting},
          </span>
          <span className="text-xl sm:text-2xl font-semibold text-[#334155] block mt-0.5">
            Welcome back,
          </span>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.3]">
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

        {/* Segmented Teaching Metric Chips - Proper Cohesive Modern Design */}
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Semester Filter</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="bg-transparent border-none font-bold text-xs text-slate-800 cursor-pointer focus:outline-none p-0 -ml-0.5 leading-tight"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      Semester {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Teaching</span>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {filteredSubjects.length} Courses Listed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">IA Assessment</span>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="text-xs font-bold text-slate-900">IA1 & IA2</span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Enrolled</span>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {totalEnrolled} Students
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[12.5px] uppercase font-semibold tracking-[0.04em] text-[#475569] block leading-tight">Department</span>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {data?.department || 'Computer Science & Engineering'}
                </span>
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
            <span className="text-xs font-semibold text-slate-800">Class IA Average</span>
            <Link to="/staff/class-report" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600" aria-label="View Class Report">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            {/* Value and Label on dedicated separate lines without collision */}
            <div className="mt-1">
              <div className="text-3xl font-bold text-slate-900 tracking-tight leading-[1.3]">85.4%</div>
              <div className="text-xs font-semibold text-[#475569] mt-0.5">Highest Score: 18.5 / 20 (Batch Score)</div>
            </div>

            {/* Custom Vertical Bars with ample headroom so tooltips never overlap text */}
            <div className="h-28 flex items-end justify-between gap-3 mt-4 pt-6 border-t border-slate-100 relative">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-16 bg-slate-900 rounded-full"></div>
                <span className="text-xs text-[#475569] font-medium">IA 1</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 relative group/bar">
                {/* Positioned safely above the bar with hover accent */}
                <span className="absolute -top-6 px-1.5 py-0.5 rounded-md bg-[#ffc83b] text-slate-900 font-bold text-xs shadow-2xs whitespace-nowrap opacity-90 group-hover/bar:opacity-100 transition-opacity">
                  18.5
                </span>
                <div className="w-2.5 h-20 bg-[#ffc83b] rounded-full"></div>
                <span className="text-xs font-bold text-[#b45309]">IA 2</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-12 bg-slate-200 rounded-full"></div>
                <span className="text-xs text-[#475569] font-medium">IA 3</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-20 bg-slate-900 rounded-full"></div>
                <span className="text-xs text-[#475569] font-medium">Sem Avg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Attendance Tracker Dial (25%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Attendance Logged</span>
            <Link to="/staff/attendance" className="p-1.5 rounded-full hover:bg-slate-100 text-[#475569]">
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
                <span className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.3]">91.2%</span>
                <span className="text-[12.5px] font-semibold text-[#475569] tracking-[0.04em] uppercase">LOGGED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#475569]">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>42 Hours Held</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
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
                <span className="text-xs text-emerald-400 font-bold">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA2 Excel Ingested</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">Attendance Registry</span>
                </div>
                <span className="text-xs text-slate-200 font-bold">Logged</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 truncate text-[#CBD5E1]">
                  <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate font-medium">PTM Signoff Review</span>
                </div>
                <span className="text-xs text-[#ffc83b] font-bold">Pending</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Assigned Subjects with Action Buttons (35%) */}
        <div className="lg:col-span-12 xl:col-span-4 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Subjects
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {assignedSubjects.length} Courses
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate">{sub.code}: {sub.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-white flex-shrink-0 ml-2">
                        Sem {sub.semester}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#475569] mt-2 pt-2 border-t border-slate-200/60">
                      <span>{sub.enrolled_students} Students</span>
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">
                          IA1: {sub.marks_status?.IA1}
                        </span>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">
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

          {/* Quick Subject Overview Footer */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#475569]">
            <span className="font-medium text-slate-600">Faculty Workload: Normal</span>
            <Link
              to="/staff/class-report"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              Class Reports &rarr;
            </Link>
          </div>
        </div>

        {/* Right: Faculty Timetable & Counseling Schedule (Side-by-Side) */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col md:flex-row items-stretch gap-5 h-full">
          {/* Glass Calendar in authentic card shape */}
          <div className="w-full md:w-[360px] shrink-0 flex justify-center">
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
              className="w-full max-w-[360px] hover:scale-[1.02] transition-transform duration-300 shadow-xl"
            />
          </div>

          {/* Daily Schedule Details for Selected Date */}
          <div className="flex-1 w-full bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Teaching Timetable: <span className="text-indigo-600 font-semibold">{format(selectedCalendarDate, 'EEEE, MMM d, yyyy')}</span>
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Department of CSE
                </span>
              </div>

              {/* Note badge if present */}
              {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')] && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between mb-3">
                  <span className="font-medium">📌 Faculty Memo: {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')]}</span>
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

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">09:00 am</span>
                  <div className="flex-1 p-2.5 rounded-2xl bg-[#1e293b] text-white flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="font-bold text-xs">CS501: Database Management Lecture</h4>
                      <p className="text-xs text-slate-300">Section A • Room 304 (Query Optimization)</p>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-[#ffc83b] font-semibold">
                      Lecture
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">11:00 am</span>
                  <div className="flex-1 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="font-bold text-xs">Lab Session: SQL Indexing Practical</h4>
                      <p className="text-xs text-amber-700">Lab 2 • Attendance register verification</p>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">
                      Lab Session
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">02:30 pm</span>
                  <div className="flex-1 p-2 rounded-xl border border-dashed border-slate-200 text-[#475569] text-xs flex items-center justify-between">
                    <span>Student Academic Mentoring & Parent Counseling Clinic</span>
                    <span className="text-xs font-semibold text-slate-400">Office Hours</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-16 font-mono text-slate-400 text-xs">04:00 pm</span>
                  <div className="flex-1 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="font-bold text-xs">Faculty Departmental Meeting & Curriculum Review</h4>
                      <p className="text-xs text-[#475569]">Conference Room • HOD & Course Instructors</p>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                      Department
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#475569]">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Faculty Schedule Synchronized</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Department CSE Active
              </span>
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
            <p className="text-xs text-[#475569] leading-relaxed max-w-[65ch]">
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
            <p className="text-xs text-[#475569] leading-relaxed max-w-[65ch]">
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
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-[1.3] flex items-center gap-2">
                  <span>Parent Communications & PTM Consultation Inbox</span>
                  {communications.filter((c) => c.status === 'Pending').length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider animate-pulse">
                      {communications.filter((c) => c.status === 'Pending').length} Pending Action
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed max-w-[70ch]">
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
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
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
                      <span className="text-xs text-slate-400 ml-auto font-mono">{item.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                      {item.type === 'PTM' ? item.notes : item.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569]">
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
      <Modal
        isOpen={isShortageModalOpen}
        onClose={() => setIsShortageModalOpen(false)}
        title="Attendance Shortage Advisory Notice"
        subtitle="Issue formal shortage warning notices for students below 75% attendance."
        icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            The following student(s) currently fail to meet the mandatory 75% lecture attendance threshold in your classes:
          </p>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Ananya Sen (21CS004)</span>
              <span className="text-rose-700 font-mono">70.0% Critical</span>
            </div>
            <div className="text-xs text-[#475569] flex items-center justify-between">
              <span>Course: CS502 Operating Systems (Sem 5, Sec A)</span>
              <span>28 Attended / 40 Held</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Notice Actions:</span>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
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
