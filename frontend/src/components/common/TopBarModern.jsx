import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Menu, X, CheckCircle2, Clock } from 'lucide-react';
import { ThemeToggleHoldButton } from './ThemeToggleHoldButton';
import { playHapticChime } from '../../utils/sound';

export const TopBarModern = ({ onOpenSidebar = () => {} }) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Notifications matching the role
  const [notifications, setNotifications] = useState(() => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 1, title: 'COE Results Engine', msg: 'Semester 5 verification complete.', time: '10m ago', unread: true },
          { id: 2, title: 'PTM Consultation Registered', msg: 'New slot booked by parent guardian.', time: '1h ago', unread: true },
        ];
      case 'STAFF':
        return [
          { id: 1, title: 'IA2 Marks Entry Active', msg: 'Ready for CS502 Operating Systems.', time: '15m ago', unread: true },
          { id: 2, title: 'Attendance Alert', msg: 'Student 21CS004 attendance below 75%.', time: '1h ago', unread: true },
        ];
      case 'STUDENT':
        return [
          { id: 1, title: 'IA1 Marks Published', msg: 'CS501 marks verified and uploaded.', time: '30m ago', unread: true },
          { id: 2, title: 'Faculty Notes Added', msg: 'New lecture slides in Resources Locker.', time: '2h ago', unread: true },
        ];
      case 'PARENT':
        return [
          { id: 1, title: 'Attendance Verified', msg: 'Ayaan Khan marked Present today.', time: '1h ago', unread: true },
          { id: 2, title: 'PTM Consultation Confirmed', msg: 'Scheduled with Prof. Ramesh Sharma.', time: '3h ago', unread: true },
        ];
      default:
        return [{ id: 1, title: 'System Active', msg: 'Next Gen Grading ready.', time: 'Now', unread: false }];
    }
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Click outside to dismiss notifications
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    playHapticChime();
    const query = searchQuery.trim().toLowerCase();
    if (query.includes('student') || query.includes('report') || query.includes('class')) {
      if (role === 'STAFF') navigate('/staff/class-report');
      else if (role === 'ADMIN') navigate('/admin/reports');
      else navigate('/student/progress-card');
    } else if (query.includes('attend')) {
      if (role === 'STAFF') navigate('/staff/attendance');
      else navigate('/student/attendance');
    } else if (query.includes('mark') || query.includes('upload')) {
      navigate('/staff/upload-marks');
    } else if (query.includes('resource') || query.includes('note')) {
      navigate('/student/resources');
    }
  };

  const displayName = user?.full_name?.split(' ')[0] || user?.username || 'Learner';

  const getRoleSubtitle = () => {
    switch (role) {
      case 'STUDENT':
        return "Let's learn something new today !";
      case 'STAFF':
        return 'Ready to mentor and review student milestones today !';
      case 'ADMIN':
        return 'Overseeing campus curriculum, audits, and department health !';
      case 'PARENT':
        return "Reviewing your ward's academic standing and attendance !";
      default:
        return 'Welcome back to your academic workspace !';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 pt-1">
      {/* Left: Greeting with waving hand emoji */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Hello {displayName}</span>
            <span className="text-xl sm:text-2xl">👋</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {getRoleSubtitle()}
          </p>
        </div>
      </div>

      {/* Right: Search Bar, Notifications, Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Search Bar matching reference pill shape */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:flex-none">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for classes, tasks, etc..."
            className="w-full sm:w-64 md:w-72 pl-10 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-slate-200/70 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
          />
        </form>

        {/* Notifications Bell */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              playHapticChime();
              setShowNotifications(!showNotifications);
            }}
            aria-label="Notifications"
            className="p-2.5 rounded-full bg-[#F8F9FA] border border-slate-200/70 text-slate-600 hover:text-slate-900 hover:bg-white shadow-2xs transition-all relative flex items-center justify-center min-h-[40px] min-w-[40px]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white absolute top-1.5 right-1.5 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-800"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                {notifications.map((item) => (
                  <div key={item.id} className="py-2.5 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Liquid Hold Button Theme Toggle */}
        <div className="shrink-0 hidden sm:block">
          <ThemeToggleHoldButton size="sm" />
        </div>

        {/* User Mini Avatar / Profile Link for mobile/tablet */}
        <Link
          to="/profile"
          title="My Profile"
          className="shrink-0 xl:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 to-indigo-800 text-white font-bold text-xs shadow-xs ring-2 ring-slate-100"
        >
          {displayName[0]}
        </Link>
      </div>
    </div>
  );
};

export default TopBarModern;
