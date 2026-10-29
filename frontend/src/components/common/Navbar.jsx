import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Settings, LogOut, ShieldCheck, UserCheck, GraduationCap, HeartHandshake } from 'lucide-react';

export const Navbar = () => {
  const { user, role, logout } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Overview' },
          { to: '/admin/students', label: 'Students' },
          { to: '/admin/staff', label: 'Faculty' },
          { to: '/admin/parents', label: 'Parents' },
          { to: '/admin/subjects', label: 'Courses' },
          { to: '/admin/parent-student', label: 'Linkages' },
          { to: '/admin/reports', label: 'Reports' },
          { to: '/results', label: 'COE Results' },
        ];
      case 'STAFF':
        return [
          { to: '/staff/dashboard', label: 'Dashboard' },
          { to: '/staff/upload-marks', label: 'Upload Marks' },
          { to: '/staff/attendance', label: 'Attendance' },
          { to: '/staff/class-report', label: 'Class Reports' },
          { to: '/results', label: 'COE Results' },
        ];
      case 'STUDENT':
        return [
          { to: '/student/dashboard', label: 'Dashboard' },
          { to: '/student/progress-card', label: 'Progress Card' },
          { to: '/student/attendance', label: 'Attendance' },
          { to: '/results', label: 'COE Results' },
        ];
      case 'PARENT':
        return [
          { to: '/parent/dashboard', label: 'Dashboard' },
          { to: '/parent/progress-card', label: 'Ward Progress' },
          { to: '/parent/attendance', label: 'Ward Attendance' },
          { to: '/results', label: 'COE Results' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 pt-1">
      {/* Brand Pill on Left */}
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-300/80 bg-white/90 backdrop-blur-md shadow-2xs hover:shadow-xs transition-all self-start lg:self-auto"
      >
        <img src="/logo.png" alt="Next Gen Grading" className="w-6 h-6 object-contain" />
        <span className="text-xs font-bold text-slate-800 tracking-tight">Next Gen Grading</span>
      </Link>

      {/* Floating Center Pill Navigation Capsule */}
      <nav className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-full p-1 shadow-2xs flex items-center gap-1 overflow-x-auto max-w-full">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full transition-all text-xs ${
                isActive
                  ? 'bg-[#1e293b] text-white font-semibold px-4 py-1.5 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium px-3.5 py-1.5 hover:bg-slate-100/60'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <Link
          to="/results"
          title="COE Integration"
          className="p-2 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs transition-colors hidden sm:flex items-center justify-center"
        >
          <Settings className="w-4 h-4" />
        </Link>

        <button
          title="Notifications"
          className="p-2 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs transition-colors hidden sm:flex items-center justify-center relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] absolute top-1.5 right-1.5"></span>
        </button>

        {/* User Pill & Logout */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
              {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[120px]">
              {user?.full_name || user?.username}
            </span>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-slate-200/80 bg-white/80 shadow-2xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
