import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pencil, ChevronLeft, ChevronRight, Mail, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

export const RightPanelModern = () => {
  const { user, role } = useAuth();
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Monday / Oct 30

  const days = [
    { day: 'SU', date: 28 },
    { day: 'MO', date: 29 },
    { day: 'TU', date: 30, active: true },
    { day: 'WE', date: 31 },
    { day: 'TH', date: 1 },
    { day: 'FR', date: 2 },
    { day: 'SA', date: 3 },
  ];

  const profileAvatar =
    role === 'STAFF'
      ? '/profile-staff.png'
      : role === 'ADMIN'
      ? '/profile-admin.png'
      : role === 'PARENT'
      ? '/profile-parent.png'
      : '/profile-student.png';

  const defaultRoleTitle = () => {
    switch (role) {
      case 'STAFF':
        return 'Senior Faculty Member';
      case 'ADMIN':
        return 'Portal Administrator';
      case 'PARENT':
        return "Student Ward's Guardian";
      case 'STUDENT':
        return 'Computer Science • Sem 5';
      default:
        return 'Academic Member';
    }
  };

  const getScheduleEvents = () => {
    switch (role) {
      case 'STAFF':
        return [
          {
            date: 'Today, 30 Oct',
            time: '10:00',
            title: 'CS501: Database Management',
            sub: 'Room 304 • Lecture Session',
            accent: 'bg-slate-950',
            cardBg: 'bg-[#FFF8E7] border-[#FFE7A3]/80'
          },
          {
            date: 'Tomorrow, 31 Oct',
            time: '11:30',
            title: 'Faculty HOD & Assessment Sync',
            sub: 'Continuous Assessment Audit',
            accent: 'bg-blue-600',
            cardBg: 'bg-[#F8F9FA] border-slate-100'
          }
        ];
      case 'ADMIN':
        return [
          {
            date: 'Today, 30 Oct',
            time: '08:30',
            title: 'Department Marks Review',
            sub: 'Board Room • Directorate Sync',
            accent: 'bg-slate-950',
            cardBg: 'bg-[#FFF8E7] border-[#FFE7A3]/80'
          },
          {
            date: 'Today, 30 Oct',
            time: '10:00',
            title: 'Parent-Teacher Meeting (PTM)',
            sub: 'Seminar Hall • Progress Card Verification',
            accent: 'bg-amber-600',
            cardBg: 'bg-[#F8F9FA] border-slate-100'
          }
        ];
      case 'PARENT':
        return [
          {
            date: 'Today, 30 Oct',
            time: '10:00',
            title: 'PTM Counseling Session',
            sub: 'Seminar Hall • Prof. Ramesh Sharma',
            accent: 'bg-slate-950',
            cardBg: 'bg-[#FFF8E7] border-[#FFE7A3]/80'
          },
          {
            date: '02 Nov',
            time: '14:00',
            title: 'Parent-Teacher Open Forum',
            sub: 'Academic Guidance & Career Orientation',
            accent: 'bg-emerald-600',
            cardBg: 'bg-[#F8F9FA] border-slate-100'
          }
        ];
      default: // STUDENT
        return [
          {
            date: '25 May',
            time: '12:00',
            title: 'CS501: Database Systems',
            sub: 'Room 304 • Prof. Ramesh Sharma',
            accent: 'bg-slate-950',
            cardBg: 'bg-[#FFF8E7] border-[#FFE7A3]/80'
          },
          {
            date: '28 May',
            time: '14:30',
            title: 'CS502: Operating Systems Lab',
            sub: 'Systems Lab 2 • Practical Evaluation',
            accent: 'bg-blue-600',
            cardBg: 'bg-[#F8F9FA] border-slate-100'
          }
        ];
    }
  };

  const scheduleEvents = getScheduleEvents();

  return (
    <aside className="w-[280px] xl:w-[290px] shrink-0 hidden xl:flex flex-col space-y-6 bg-white rounded-[32px] p-5 border border-slate-100 shadow-xs">
      {/* 1. Profile Card matching reference design */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900 tracking-tight">Profile</span>
          <Link
            to="/profile"
            title="Edit Profile"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Circular Avatar */}
        <div className="mt-3 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={profileAvatar}
              alt={user?.full_name || 'User Profile'}
              className="w-18 h-18 rounded-full object-cover ring-4 ring-slate-100 shadow-sm mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-18 h-18 rounded-full bg-slate-900 text-[#FEDC56] font-bold text-xl items-center justify-center ring-4 ring-slate-100 shadow-sm mx-auto hidden">
              {(user?.full_name || user?.username || 'U')[0].toUpperCase()}
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-900 mt-2.5 leading-tight">
            {user?.full_name || user?.username || 'Learner'}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {user?.email || defaultRoleTitle()}
          </p>
        </div>
      </div>

      {/* 2. Mini Calendar Month Strip matching reference design */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={() => playHapticChime()}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-50"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            October 2026
          </span>
          <button
            type="button"
            onClick={() => playHapticChime()}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-50"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7-Day Horizontal Strip */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((item, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  playHapticChime();
                  setSelectedDayIndex(index);
                }}
                className={`flex flex-col items-center py-1.5 px-1 rounded-full transition-all ${
                  isSelected
                    ? 'bg-[#19192B] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[10px] font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {item.day}
                </span>
                <span className={`text-xs font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {item.date}
                </span>
                {isSelected && (
                  <span className="w-1 h-1 rounded-full bg-[#FEDC56] mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Schedule Section matching reference design */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Schedule
          </span>
          <Link
            to={role === 'STAFF' ? '/staff/dashboard' : '/student/dashboard'}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-700"
          >
            See all
          </Link>
        </div>

        <div className="space-y-2.5">
          {scheduleEvents.map((ev, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block px-1">
                {ev.date}
              </span>
              <div
                className={`relative pl-3.5 pr-3 py-2.5 rounded-2xl border flex items-center gap-3 transition-transform hover:scale-[1.01] ${ev.cardBg}`}
              >
                {/* Vertical colored bar on left edge */}
                <span className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-md ${ev.accent}`} />
                <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                  {ev.time}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{ev.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{ev.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Reminders Section matching reference design */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5 mt-auto">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Reminders
        </span>

        <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {role === 'STAFF' ? 'IA2 Score Submission' : 'PTM Progress Card Review'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {role === 'STAFF' ? '30 Oct 2026, Friday' : '30 Oct 2026, Friday'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanelModern;
