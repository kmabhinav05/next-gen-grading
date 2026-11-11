import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  Users,
  ChevronDown,
  Plus,
  Share2,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  Award
} from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

export const DashboardShowcaseModern = ({
  courses = [],
  assignmentTitle = 'Parent-Teacher Meeting & Academic Counseling',
  assignmentDate = '30 October 2026, 10:00 AM',
  assignmentDuration = '01 h 30 m',
  onActionClick = () => {}
}) => {
  const { role } = useAuth();
  const [activeCourseTab, setActiveCourseTab] = useState('All');
  const [taskView, setTaskView] = useState('Today');

  // Default mock courses if none supplied
  const defaultCourses = [
    {
      code: 'CS501',
      name: 'Database Systems',
      faculty: 'Prof. Ramesh Sharma',
      level: 'Core Course',
      levelColor: 'text-emerald-700',
      days: 38,
      hours: 42,
      students: 6,
      progress: 88,
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      code: 'CS502',
      name: 'Operating Systems',
      faculty: 'Prof. Priya Verma',
      level: 'Advanced Level',
      levelColor: 'text-blue-700',
      days: 36,
      hours: 40,
      students: 6,
      progress: 75,
      iconBg: 'bg-blue-50 text-blue-600'
    },
    {
      code: 'CS503',
      name: 'Computer Networks',
      faculty: 'Prof. Ramesh Sharma',
      level: 'Certified Course',
      levelColor: 'text-amber-800',
      days: 40,
      hours: 45,
      students: 6,
      progress: 95,
      iconBg: 'bg-amber-50 text-amber-700'
    }
  ];

  const displayCourses = courses.length > 0 ? courses : defaultCourses;

  return (
    <div className="space-y-6">
      {/* 1. "My Courses" Section matching reference design */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Courses</h2>
            {/* Filter Tabs with Active Dot Indicator */}
            <div className="flex items-center gap-5 mt-1.5 text-xs font-semibold">
              {['All', 'Active', 'Completed'].map((tab) => {
                const isActive = activeCourseTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      playHapticChime();
                      setActiveCourseTab(tab);
                    }}
                    className={`flex flex-col items-center pb-1 transition-colors ${
                      isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>{tab}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            to={role === 'ADMIN' ? '/admin/subjects' : role === 'STAFF' ? '/staff/dashboard' : '/student/progress-card'}
            className="text-xs font-semibold text-slate-400 hover:text-slate-800 self-start sm:self-auto"
          >
            See all
          </Link>
        </div>

        {/* 3 Horizontal Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCourses.slice(0, 3).map((c, i) => (
            <div
              key={c.code || i}
              className="bg-[#F8F9FA] rounded-[24px] p-4.5 border border-slate-100/90 shadow-2xs hover:shadow-xs hover:border-slate-200 transition-all flex flex-col justify-between space-y-3.5"
            >
              {/* Header: Icon + Subject Title & Faculty */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${c.iconBg || 'bg-indigo-50 text-indigo-600'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {c.code ? `${c.code}: ${c.name}` : c.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {c.faculty || 'Prof. Academic Faculty'}
                  </p>
                </div>
              </div>

              {/* Level / Status Tag */}
              <div>
                <span className={`text-[11px] font-bold ${c.levelColor || 'text-emerald-700'}`}>
                  {c.level || 'Core Syllabus'}
                </span>
              </div>

              {/* Stat Indicators Row: Calendar, Clock, Students */}
              <div className="flex items-center gap-4 text-[11px] text-[#475569] font-medium pt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.days || 36}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.hours || 40}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.students || 6}</span>
                </div>
              </div>

              {/* Progress Bar matching reference design */}
              <div className="space-y-1.5 pt-1">
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${c.progress || 80}%` }}
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-700 block">
                  Completed: {c.progress || 80}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. "Assignments" / Key Milestone Banner matching reference design */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assignments</h2>
          <button
            type="button"
            onClick={() => playHapticChime()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-800"
          >
            <span>Share</span>
            <Share2 className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-[#F8F9FA] rounded-[24px] p-4 sm:p-5 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          {/* Left: Thumbnail + Title + Date */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0">
              🎓
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {assignmentTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {assignmentDate}
              </p>
            </div>
          </div>

          {/* Middle: Duration */}
          <div className="text-left md:text-center shrink-0">
            <span className="text-[11px] text-slate-400 block font-medium">Duration</span>
            <span className="text-xs font-bold text-slate-800">{assignmentDuration}</span>
          </div>

          {/* Right: Action Buttons matching reference */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={() => {
                playHapticChime();
                onActionClick('reschedule');
              }}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 shadow-2xs transition-all"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => {
                playHapticChime();
                onActionClick('accept');
              }}
              className="px-4.5 py-2 rounded-full bg-[#FEDC56] hover:bg-[#fed33c] text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              Accept invite
            </button>
          </div>
        </div>
      </div>

      {/* 3. "Home Tasks" Section: Dual Signature Cards (Midnight Navy + Warm Sunny Yellow) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Home Tasks</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => playHapticChime()}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <span>{taskView}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => playHapticChime()}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>Add new</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card A: Signature Midnight Dark Navy Card matching reference */}
          <div className="rounded-[28px] bg-[#19192B] text-white p-5 sm:p-6 shadow-md flex flex-col justify-between min-h-[175px] space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Continuous IA Evaluation & Syllabus
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-800/40 text-rose-300 font-bold text-[11px] shrink-0">
                  High ↗
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-[50ch]">
                Consolidate and review internal assessment scores and threshold attendance compliance across Semester 5 courses.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-300 block">Assessment Operations</span>
                <span className="text-[11px] text-slate-400">Due to: 29.11.2026</span>
              </div>
              {/* Stacked Avatars */}
              <div className="flex items-center -space-x-2">
                {['#3b82f6', '#8b5cf6', '#ec4899'].map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    className="w-7 h-7 rounded-full border-2 border-[#19192B] flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card B: Signature Warm Sunny Yellow Card matching reference */}
          <div className="rounded-[28px] bg-[#FEDC56] text-slate-950 p-5 sm:p-6 shadow-md flex flex-col justify-between min-h-[175px] space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-950 tracking-tight">
                  Lab Practical & Progress Clearance
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-black/10 text-slate-950 font-bold text-[11px] shrink-0">
                  Normal ↘
                </span>
              </div>
              <p className="text-xs text-slate-900/90 mt-2 leading-relaxed max-w-[50ch]">
                Ensure all laboratory evaluation rubrics, continuous lab records, and digital progress cards are verified for COE.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-950/15 text-xs">
              <div>
                <span className="font-bold text-slate-950 block">Practical Evaluation</span>
                <span className="text-[11px] text-slate-800">Due to: 15.12.2026</span>
              </div>
              {/* Stacked Avatars */}
              <div className="flex items-center -space-x-2">
                {['#0f172a', '#475569', '#1e293b'].map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    className="w-7 h-7 rounded-full border-2 border-[#FEDC56] flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  >
                    {String.fromCharCode(88 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShowcaseModern;
