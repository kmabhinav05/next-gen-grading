import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PillNav from './PillNav';
import { Bell, Settings, LogOut } from 'lucide-react';

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
      <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0">
        <Link
          to="/results"
          title="COE Integration"
          className="p-2.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs hover:shadow-xs transition-all hidden sm:flex items-center justify-center backdrop-blur-md"
        >
          <Settings className="w-4 h-4" />
        </Link>

        <button
          type="button"
          title="Notifications"
          className="p-2.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-white shadow-2xs hover:shadow-xs transition-all hidden sm:flex items-center justify-center relative backdrop-blur-md"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white absolute top-2 right-2 animate-pulse"></span>
        </button>

        {/* User Pill & Logout */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-md">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[120px] leading-tight">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                {role}
              </span>
            </div>
          </div>

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
