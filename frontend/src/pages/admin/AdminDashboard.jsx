import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { Skeleton } from '../../components/common/Skeleton';
import {
  ArrowUpRight,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Clock,
  MessageSquare,
  Check,
  X,
  FileText,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTimeGreeting } from '../../utils/greeting';
import { communicationsService } from '../../api/communications';
import { playHapticChime } from '../../utils/sound';
import toast from 'react-hot-toast';
import { GlassCalendar } from '@/components/ui/glass-calendar';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('courses');
  const [communications, setCommunications] = useState(() => communicationsService.getAll());
  const [commFilter, setCommFilter] = useState('ALL');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date(2026, 9, 30));
  const [calendarNotes, setCalendarNotes] = useState({
    '2026-10-30': 'Department HOD meeting: COE audit and exam hall ticket generation'
  });

  useEffect(() => {
    const handleUpdate = () => {
      setCommunications(communicationsService.getAll());
    };
    window.addEventListener('communications-updated', handleUpdate);
    return () => window.removeEventListener('communications-updated', handleUpdate);
  }, []);

  const handleAdminStatusChange = (id, newStatus) => {
    communicationsService.updateStatus(id, newStatus);
    playHapticChime();
    toast.success(`Communication record marked as ${newStatus}`);
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

  const counts = data?.counts || {};
  const recentUploads = data?.recent_uploads || [];
  const timeGreeting = getTimeGreeting();

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER ROW (Matching image) */}
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
                Administrator
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
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Enrolled</span>
              <span className="px-4 py-1.5 rounded-full bg-[#1e293b] text-white font-bold text-xs shadow-2xs inline-block">
                {counts.students || 6} Students
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Faculty</span>
              <span className="px-4 py-1.5 rounded-full bg-[#fbc02d] text-slate-900 font-bold text-xs shadow-2xs inline-block">
                {counts.staff || 2} Staff
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Courses Active</span>
              <span className="px-4 py-1.5 rounded-full border border-dashed border-slate-300/90 bg-white/50 text-slate-700 font-semibold text-xs inline-block">
                {counts.subjects || 4} Subjects
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 block font-normal mb-1.5">Attendance Rate</span>
              <span className="px-4 py-1.5 rounded-full border border-slate-200/90 bg-white text-slate-800 font-bold text-xs shadow-2xs inline-block">
                88.5% Good Standing
              </span>
            </div>
          </div>
        </div>

        {/* Big Bold Stats on Right (Matching image: 78, 56, 203) */}
        <div className="flex items-center gap-6 sm:gap-10 self-start xl:self-auto">
          <Link to="/admin/students" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Manage Students Registry">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {counts.students || 6}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Students</p>
            </div>
          </Link>

          <Link to="/admin/staff" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Manage Faculty Directory">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <Users className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {counts.staff || 2}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Faculty</p>
            </div>
          </Link>

          <Link to="/admin/subjects" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Manage Courses & Curriculum">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {counts.subjects || 4}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Courses</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. TOP GRID OF 4 CARDS (Matching image) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Card 1: Spotlight Profile Card (25%) */}
        <div className="md:col-span-12 lg:col-span-3 min-h-[290px] rounded-[28px] overflow-hidden shadow-2xs border border-slate-200/80 group flex items-center justify-center relative">
          <img
            src="/profile-admin.png"
            alt="Meera Nair - Portal Administrator"
            className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card 2: Performance Progress Card with Vertical Bars (28%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Department Performance</span>
            <Link to="/admin/reports" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">84.6%</span>
              <span className="text-[11px] text-slate-500 font-medium">Class Avg</span>
            </div>

            {/* Custom Vertical Bars (matching image style) */}
            <div className="h-28 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-slate-100 relative">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-16 bg-slate-900 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium">CS501</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-20 bg-slate-900 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium">CS502</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                <span className="absolute -top-7 px-1.5 py-0.5 rounded-md bg-[#ffc83b] text-slate-900 font-bold text-[9px] shadow-2xs whitespace-nowrap">
                  48 / 50
                </span>
                <div className="w-2.5 h-24 bg-[#ffc83b] rounded-full"></div>
                <span className="text-[10px] font-bold text-[#f59e0b]">CS503</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-2.5 h-14 bg-slate-900 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium">CS504</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Attendance Dial Tracker (25%) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Attendance Tracker</span>
            <Link to="/admin/reports" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Circular Dial Representation (matching image meter) */}
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
                  strokeDashoffset="30"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">88.5%</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Regularity</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>42 Classes Held</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Good Standing
            </span>
          </div>
        </div>

        {/* Card 4: Dark Pipeline Checklist Card (Right Column) */}
        <div className="md:col-span-12 lg:col-span-3 bg-[#1e293b] text-white rounded-[28px] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Department Pipeline</span>
              <span className="text-xs font-mono font-bold text-[#ffc83b]">3 / 4</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA1 Marks Uploaded</span>
                </div>
                <span className="text-[10px] text-slate-400">100%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">IA2 Marks Ingested</span>
                </div>
                <span className="text-[10px] text-slate-400">100%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc83b] flex-shrink-0" />
                  <span className="truncate">Digital Progress Cards</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Ready</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 truncate text-slate-400">
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="truncate">COE Results Extractor</span>
                </div>
                <span className="text-[9px] text-amber-400 font-semibold">Staging</span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/reports"
            className="w-full mt-3 py-2 text-center rounded-xl bg-[#ffc83b] text-slate-900 font-bold text-xs hover:bg-[#eab308] transition-colors block"
          >
            Review Class Records
          </Link>
        </div>
      </div>

      {/* 3. BOTTOM GRID (Curriculum Accordion + Timetable Schedule) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Department Curriculum Accordion (35%) */}
        <div className="lg:col-span-4 bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Academic Courses & Staff
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>CS501: Database Management</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">Prof. Sharma</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Semester 5 • 6 Enrolled Students • IA1 & IA2 Complete</p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>CS502: Operating Systems</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700">Prof. Verma</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Semester 5 • 6 Enrolled Students • IA1 & IA2 Complete</p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>CS503: Computer Networks</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">Prof. Sharma</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Semester 5 • 6 Enrolled Students • IA1 & IA2 Complete</p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>CS504: Software Engineering</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700">Prof. Verma</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Semester 5 • 6 Enrolled Students • IA1 & IA2 Complete</p>
            </div>
          </div>
        </div>

        {/* Right: Academic Timetable & Glass Calendar (Side-by-Side) */}
        <div className="lg:col-span-8 flex flex-col xl:flex-row items-start gap-5">
          {/* Glass Calendar in authentic card shape */}
          <div className="w-full xl:w-[360px] shrink-0 flex justify-center">
            <GlassCalendar
              selectedDate={selectedCalendarDate}
              onDateSelect={(d) => {
                setSelectedCalendarDate(d);
                playHapticChime();
              }}
              onAddNote={(d) => {
                const key = format(d, 'yyyy-MM-dd');
                const text = window.prompt(`Add administrative agenda for ${format(d, 'MMM d, yyyy')}:`, calendarNotes[key] || '');
                if (text !== null) {
                  setCalendarNotes((prev) => ({ ...prev, [key]: text }));
                  toast.success(`Admin agenda saved for ${format(d, 'MMM d')}`);
                  playHapticChime();
                }
              }}
              onNewEvent={(d) => {
                toast.success(`Institutional event scheduler opened for ${format(d, 'MMM d, yyyy')}`);
                playHapticChime();
              }}
              className="w-full max-w-[360px] hover:scale-[1.02] transition-transform duration-300 shadow-xl"
            />
          </div>

          {/* Daily Schedule Details for Selected Date */}
          <div className="flex-1 w-full bg-white/90 rounded-[28px] p-5 shadow-2xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Campus Agenda & Timetable: <span className="text-amber-700 font-semibold">{format(selectedCalendarDate, 'EEEE, MMM d, yyyy')}</span>
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Institutional Directorate
              </span>
            </div>

            {/* Note badge if present */}
            {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')] && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <span className="font-medium">📋 Administrative Directive: {calendarNotes[format(selectedCalendarDate, 'yyyy-MM-dd')]}</span>
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
                <span className="w-16 font-mono text-slate-400 text-[11px]">08:30 am</span>
                <div className="flex-1 p-2.5 rounded-2xl bg-[#1e293b] text-white flex items-center justify-between shadow-2xs">
                  <div>
                    <h4 className="font-bold text-xs">Department Marks Review & HOD Meeting</h4>
                    <p className="text-[10px] text-slate-300">Continuous Assessment Consolidation</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-700 text-[#ffc83b] font-semibold">
                    Board Room
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-16 font-mono text-slate-400 text-[11px]">10:00 am</span>
                <div className="flex-1 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-2xs">
                  <div>
                    <h4 className="font-bold text-xs">Parent-Teacher Meeting (PTM) Counseling</h4>
                    <p className="text-[10px] text-amber-700">Digital Progress Card Signature Verification</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">
                    Seminar Hall
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-16 font-mono text-slate-400 text-[11px]">11:30 am</span>
                <div className="flex-1 p-2 rounded-xl border border-dashed border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                  <span>Lab Hours: CS501 Database Hands-on Session (Section A)</span>
                  <span className="text-[10px] font-semibold text-slate-400">Lab Complex 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INSTITUTIONAL PARENT COMMUNICATIONS & ABSENCE CENTRAL REGISTER */}
      <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Parent Communications, PTM & Absence Central Oversight</span>
                  {communications.filter((c) => c.status === 'Pending').length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                      {communications.filter((c) => c.status === 'Pending').length} Pending Review
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500">
                  Institutional record of all consultation bookings and ward leave notes filed by parents across departments.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/70 text-xs font-semibold">
            {[
              { id: 'ALL', label: `All Requests (${communications.length})` },
              { id: 'PTM', label: `PTM Consultations (${communications.filter((c) => c.type === 'PTM').length})` },
              { id: 'LEAVE', label: `Absence Notes (${communications.filter((c) => c.type === 'LEAVE').length})` },
              { id: 'PENDING', label: `Pending (${communications.filter((c) => c.status === 'Pending').length})` }
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

        {/* Requests Table / List */}
        {communications.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 text-slate-400 text-xs">
            No parent communications logged across the institution yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Parent & Ward Info</th>
                  <th className="px-4 py-3">Assigned Faculty / Subject</th>
                  <th className="px-4 py-3">Details & Scheduled Time</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {communications
                  .filter((c) => {
                    if (commFilter === 'PTM') return c.type === 'PTM';
                    if (commFilter === 'LEAVE') return c.type === 'LEAVE';
                    if (commFilter === 'PENDING') return c.status === 'Pending';
                    return true;
                  })
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.type === 'PTM'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.type === 'PTM' ? 'PTM Consultation' : 'Leave Note'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{item.createdAt}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{item.parentName}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Ward: <strong className="text-slate-700">{item.studentName}</strong> ({item.regNo})
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800">{item.faculty}</div>
                        <div className="text-slate-500 text-[11px]">{item.subject}</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        {item.type === 'PTM' ? (
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{item.date} • {item.timeSlot}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] line-clamp-2">{item.notes}</p>
                            <span className="text-[10px] text-slate-400">{item.mode}</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="font-medium text-amber-900">
                              {item.startDate} to {item.endDate} ({item.leaveType})
                            </div>
                            <p className="text-slate-600 text-[11px] line-clamp-2">{item.reason}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {item.status === 'Pending' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px]">
                            Pending Action
                          </span>
                        ) : item.status === 'Confirmed' || item.status === 'Approved' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                            Confirmed / Approved
                          </span>
                        ) : item.status === 'Acknowledged' ? (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-bold text-[10px]">
                            Acknowledged
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]">
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAdminStatusChange(item.id, item.type === 'PTM' ? 'Confirmed' : 'Acknowledged')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                                title="Approve"
                              >
                                <Check className="w-3 h-3" />
                                <span>Confirm</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdminStatusChange(item.id, 'Declined')}
                                className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                                title="Decline"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          {item.status !== 'Pending' && (
                            <button
                              type="button"
                              onClick={() => handleAdminStatusChange(item.id, 'Pending')}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-[10px] transition-all"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. ADMIN SYSTEM HEALTH & SETTINGS STRIP */}
      <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-800">COE Engine Online</span>
            <span className="text-slate-400 font-mono text-[11px]">Latency 12ms</span>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div className="text-slate-600">
            Current Session: <strong className="text-slate-900">Odd Sem 2026-2027</strong>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div className="text-slate-600">
            Attendance Defaulter Threshold: <strong className="text-rose-600">75%</strong>
          </div>
        </div>

        <Link
          to="/settings"
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
        >
          <span>Open Academic Configuration & Settings</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
