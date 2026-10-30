import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PillNav from './PillNav';
import { Bell, Settings as SettingsIcon, LogOut, CheckCircle2, AlertTriangle, Calendar, Info, X } from 'lucide-react';

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
  const notifRef = useRef(null);

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
          { label: 'Profile', href: '/profile' },
          { label: 'Settings', href: '/settings' },
          { label: 'COE Results', href: '/results' },
        ];
      case 'STAFF':
        return [
          { label: 'Dashboard', href: '/staff/dashboard' },
          { label: 'Upload Marks', href: '/staff/upload-marks' },
          { label: 'Attendance', href: '/staff/attendance' },
          { label: 'Class Reports', href: '/staff/class-report' },
          { label: 'Profile', href: '/profile' },
          { label: 'Settings', href: '/settings' },
          { label: 'COE Results', href: '/results' },
        ];
      case 'STUDENT':
        return [
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Progress Card', href: '/student/progress-card' },
          { label: 'Attendance', href: '/student/attendance' },
          { label: 'Profile', href: '/profile' },
          { label: 'Settings', href: '/settings' },
          { label: 'COE Results', href: '/results' },
        ];
      case 'PARENT':
        return [
          { label: 'Dashboard', href: '/parent/dashboard' },
          { label: 'Ward Progress', href: '/parent/progress-card' },
          { label: 'Ward Attendance', href: '/parent/attendance' },
          { label: 'Profile', href: '/profile' },
          { label: 'Settings', href: '/settings' },
          { label: 'COE Results', href: '/results' },
        ];
      default:
        return [
          { label: 'Home', href: '/' },
          { label: 'Profile', href: '/profile' },
          { label: 'Settings', href: '/settings' },
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
    <header className="relative z-40 flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 pt-1">
      {/* React Bits PillNav Component */}
      <div className="w-full lg:w-auto flex-1 flex items-center justify-start max-w-full overflow-visible">
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
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0 relative" ref={notifRef}>
        {/* Settings Button */}
        <Link
          to="/settings"
          title="System Settings & Preferences"
          className="p-2.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs hover:shadow-xs transition-all hidden sm:flex items-center justify-center backdrop-blur-md"
        >
          <SettingsIcon className="w-4 h-4" />
        </Link>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={() => setShowNotifications(!showNotifications)}
          title="Notifications"
          className="p-2.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs hover:shadow-xs transition-all hidden sm:flex items-center justify-center relative backdrop-blur-md"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white absolute top-1.5 right-1.5 animate-pulse"></span>
          )}
        </button>

        {/* Interactive Notification Popup Drawer */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
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

        {/* User Pill (Clicks to /profile with 3D Lanyard ID Badge) & Logout */}
        <div className="flex items-center gap-2 pl-1">
          <Link
            to="/profile"
            title="View Profile & 3D Digital ID Badge"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all backdrop-blur-md group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
              {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[120px] leading-tight group-hover:text-primary-600 transition-colors">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase flex items-center gap-1">
                <span>{role}</span>
                <span className="text-primary-600 font-bold group-hover:underline">• ID</span>
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-slate-200/80 bg-white/80 shadow-2xs hover:shadow-xs transition-all backdrop-blur-md"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
