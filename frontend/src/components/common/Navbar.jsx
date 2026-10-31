import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PillNav from './PillNav';
import {
  Bell,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Info,
  X,
  Menu,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

const RouterLink = ({ href, children, ...props }) => {
  if (!href) return <a {...props}>{children}</a>;
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
};

export const Navbar = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const notifRef = useRef(null);

  // Digital 3D ID Profile is strictly for Faculty (STAFF) and Student (STUDENT)
  const isProfileSupported = role === 'STAFF' || role === 'STUDENT';

  // Role-customized notifications
  const [notifications, setNotifications] = useState(() => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 1, title: 'System Batch Completed', msg: 'Daily attendance calculation completed for Semester 5.', time: '10m ago', unread: true },
          { id: 2, title: 'COE Integration Active', msg: 'Official results service connected and verified.', time: '1h ago', unread: true },
          { id: 3, title: 'Faculty Registration', msg: 'New faculty onboarded in Computer Science Dept.', time: 'Yesterday', unread: false }
        ];
      case 'STAFF':
        return [
          { id: 1, title: 'Attendance Alert', msg: 'Student 21CS004 attendance dropped below 75% in CS502.', time: '15m ago', unread: true },
          { id: 2, title: 'IA2 Marks Entry Active', msg: 'Upload portal open for Operating Systems.', time: '2h ago', unread: true },
          { id: 3, title: 'Class Report Ready', msg: 'Bulk progress card PDF compiled for Section A.', time: 'Yesterday', unread: false }
        ];
      case 'STUDENT':
        return [
          { id: 1, title: 'Attendance Confirmed', msg: 'Marked Present for today’s lecture sessions.', time: '30m ago', unread: true },
          { id: 2, title: 'IA1 Marks Published', msg: 'Score released for Cloud Computing & Microservices.', time: '3h ago', unread: true },
          { id: 3, title: 'Hall Ticket Clearance', msg: 'Attendance verified (>75%) for semester exam entry.', time: '2 days ago', unread: false }
        ];
      case 'PARENT':
        return [
          { id: 1, title: 'Daily Attendance Report', msg: 'Your ward Ayaan Khan was marked Present today.', time: '1h ago', unread: true },
          { id: 2, title: 'Academic Progress Card', msg: 'New IA progress review available for viewing.', time: '4h ago', unread: true },
          { id: 3, title: 'PTM Discussion Invitation', msg: 'Faculty consultations open for Semester 5.', time: 'Yesterday', unread: false }
        ];
      default:
        return [
          { id: 1, title: 'Welcome to Next Gen Grading', msg: 'Portal identity verified successfully.', time: 'Now', unread: true }
        ];
    }
  });

  // Click outside to dismiss notification popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync real-time Parent Communications & PTM consultation bookings
  useEffect(() => {
    const handleCommUpdated = () => {
      try {
        const raw = localStorage.getItem('demo_parent_communications');
        if (!raw) return;
        const list = JSON.parse(raw);
        if (list && list.length > 0) {
          const latest = list[0];
          setNotifications((prev) => {
            const alreadyExists = prev.some((n) => n.id === `comm-${latest.id}`);
            if (alreadyExists) return prev;
            const newNotif = {
              id: `comm-${latest.id}`,
              title: latest.type === 'PTM' ? `PTM Request: ${latest.parentName}` : `Ward Leave: ${latest.parentName}`,
              msg: latest.type === 'PTM'
                ? `Requested consultation for ${latest.studentName} on ${latest.date} (${latest.timeSlot})`
                : `Absence note submitted for ${latest.studentName} (${latest.startDate} - ${latest.endDate})`,
              time: 'Just now',
              unread: true
            };
            return [newNotif, ...prev];
          });
        }
      } catch (e) {}
    };

    window.addEventListener('communications-updated', handleCommUpdated);
    return () => window.removeEventListener('communications-updated', handleCommUpdated);
  }, [role]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Overview', href: '/admin/dashboard' },
          { label: 'Students', href: '/admin/students' },
          { label: 'Faculty', href: '/admin/staff' },
          { label: 'Parents', href: '/admin/parents' },
          { label: 'Courses', href: '/admin/subjects' },
          { label: 'Linkages', href: '/admin/parent-student' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'COE Results', href: '/results' },
        ];
      case 'STAFF':
        return [
          { label: 'Dashboard', href: '/staff/dashboard' },
          { label: 'Upload Marks', href: '/staff/upload-marks' },
          { label: 'Attendance', href: '/staff/attendance' },
          { label: 'Class Reports', href: '/staff/class-report' },
          { label: 'COE Results', href: '/results' },
        ];
      case 'STUDENT':
        return [
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Progress Card', href: '/student/progress-card' },
          { label: 'Attendance', href: '/student/attendance' },
          { label: 'COE Results', href: '/results' },
        ];
      case 'PARENT':
        return [
          { label: 'Dashboard', href: '/parent/dashboard' },
          { label: 'Ward Progress', href: '/parent/progress-card' },
          { label: 'Ward Attendance', href: '/parent/attendance' },
          { label: 'COE Results', href: '/results' },
        ];
      default:
        return [
          { label: 'Home', href: '/' },
          { label: 'COE Results', href: '/results' },
        ];
    }
  };

  const navItems = getNavItems();

  // Find active item
  const currentActiveHref =
    navItems.find(
      (item) =>
        item.href === location.pathname ||
        (item.href !== '/' && item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href))
    )?.href || location.pathname;

  const defaultHomeHref = role
    ? role === 'ADMIN'
      ? '/admin/dashboard'
      : role === 'STAFF'
      ? '/staff/dashboard'
      : role === 'STUDENT'
      ? '/student/dashboard'
      : '/parent/dashboard'
    : '/';

  return (
    <>
      <header className="relative z-40 mb-4 sm:mb-6 pt-1">
        {/* DESKTOP NAVBAR (>= lg breakpoint) */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* React Bits PillNav Component */}
          <div className="flex-1 flex items-center justify-start max-w-full overflow-visible">
            <PillNav
              logo="/logo.png"
              logoAlt="Next Gen Grading"
              logoHref={defaultHomeHref}
              items={navItems}
              activeHref={currentActiveHref}
              linkComponent={RouterLink}
              theme="light"
              layout="split"
              itemStyle="pill"
              hoverEffect="fill"
              indicator="dot"
              size="md"
              collapse="never"
              intro={false}
            />
          </div>

          {/* Desktop Right Controls */}
          <div className="flex items-center gap-2.5 shrink-0 relative" ref={notifRef}>
            {/* Settings Icon Button */}
            <Link
              to="/settings"
              title="System Settings & Preferences"
              className="p-2.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs hover:shadow-xs transition-all flex items-center justify-center backdrop-blur-md min-h-[44px] min-w-[44px]"
            >
              <SettingsIcon className="w-4 h-4" />
            </Link>

            {/* Notifications Button */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="p-2.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs hover:shadow-xs transition-all flex items-center justify-center relative backdrop-blur-md min-h-[44px] min-w-[44px]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white absolute top-1.5 right-1.5 animate-pulse"></span>
              )}
            </button>

            {/* User Pill & Logout */}
            <div className="flex items-center gap-2 pl-1">
              <Link
                to="/profile"
                title={isProfileSupported ? "View Profile & 3D Digital ID Badge" : "View Profile & Account Details"}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all backdrop-blur-md group min-h-[44px]"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                  {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[120px] leading-tight group-hover:text-primary-600 transition-colors">
                    {user?.full_name || user?.username}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase flex items-center gap-1">
                    <span>{role}</span>
                    {isProfileSupported ? (
                      <span className="text-primary-600 font-bold group-hover:underline">• ID</span>
                    ) : (
                      <span className="text-slate-400 group-hover:text-primary-600 font-medium transition-colors">• Profile</span>
                    )}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-slate-200/80 bg-white/80 shadow-2xs hover:shadow-xs transition-all backdrop-blur-md min-h-[44px] min-w-[44px]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE TOPBAR (< lg breakpoint) */}
        <div className="flex lg:hidden items-center justify-between gap-3 p-2 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-md">
          {/* Left: Hamburger Drawer Trigger + Logo */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileDrawerOpen(true);
                playHapticChime();
              }}
              aria-label="Open Navigation Drawer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to={defaultHomeHref} className="flex items-center gap-2">
              <img src="/logo.png" alt="Next Gen Grading" className="w-7 h-7 object-contain" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 tracking-tight leading-none">
                  Next Gen Grading
                </span>
                <span className="text-[9px] font-bold text-amber-600 tracking-wider uppercase mt-0.5">
                  {role} Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              to="/settings"
              title="Settings"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white absolute top-2 right-2 animate-pulse"></span>
              )}
            </button>

            <Link
              to="/profile"
              title="Profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs ml-1"
            >
              {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </Link>
          </div>
        </div>

        {/* Interactive Notification Popup Drawer */}
        {showNotifications && (
          <div className="absolute right-0 top-14 sm:top-16 w-[calc(100vw-32px)] sm:w-96 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-primary-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`py-2.5 px-2 rounded-xl text-xs space-y-1 transition-colors ${
                    n.unread ? 'bg-primary-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{n.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MOBILE SLIDE-IN DRAWER OVERLAY */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with GPU-composited fade */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Slide-out Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-[290px] max-w-[85vw] bg-white shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Next Gen Grading" className="w-8 h-8 object-contain" />
                  <div>
                    <h2 className="text-xs font-black text-slate-900 tracking-tight">Next Gen Grading</h2>
                    <span className="text-[10px] text-slate-400 font-medium">Academic Portal</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="Close Navigation Drawer"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              <Link
                to="/profile"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[140px]">
                      {user?.full_name || user?.username}
                    </span>
                    <span className="text-[10px] text-primary-600 font-semibold uppercase tracking-wider block">
                      {isProfileSupported ? `${role} • View 3D ID` : `${role} • View Profile`}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                  Portal Navigation
                </span>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          playHapticChime();
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2 pb-safe">
              <Link
                to="/settings"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 min-h-[44px]"
              >
                <SettingsIcon className="w-4 h-4 text-slate-500" />
                <span>Settings & UI Density</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 min-h-[44px] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
