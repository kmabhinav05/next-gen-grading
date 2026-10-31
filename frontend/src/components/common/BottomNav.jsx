import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playHapticChime } from '../../utils/sound';
import {
  LayoutDashboard,
  Award,
  Clock,
  BookOpen,
  User,
  Upload,
  ClipboardCheck,
  Users,
  GraduationCap,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

export const BottomNav = () => {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) return null;

  const getNavLinks = () => {
    switch (role) {
      case 'STUDENT':
        return [
          { label: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Progress', href: '/student/progress-card', icon: Award },
          { label: 'Attendance', href: '/student/attendance', icon: Clock },
          { label: 'Results', href: '/results', icon: BookOpen },
          { label: 'Profile', href: '/profile', icon: User }
        ];
      case 'STAFF':
        return [
          { label: 'Home', href: '/staff/dashboard', icon: LayoutDashboard },
          { label: 'Marks', href: '/staff/upload-marks', icon: Upload },
          { label: 'Attendance', href: '/staff/attendance', icon: ClipboardCheck },
          { label: 'Reports', href: '/staff/class-report', icon: BookOpen },
          { label: 'Profile', href: '/profile', icon: User }
        ];
      case 'ADMIN':
        return [
          { label: 'Home', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Students', href: '/admin/students', icon: Users },
          { label: 'Faculty', href: '/admin/staff', icon: GraduationCap },
          { label: 'Reports', href: '/admin/reports', icon: FileSpreadsheet },
          { label: 'Settings', href: '/settings', icon: Settings }
        ];
      case 'PARENT':
        return [
          { label: 'Home', href: '/parent/dashboard', icon: LayoutDashboard },
          { label: 'Progress', href: '/parent/progress-card', icon: Award },
          { label: 'Attendance', href: '/parent/attendance', icon: Clock },
          { label: 'Results', href: '/results', icon: BookOpen },
          { label: 'Settings', href: '/settings', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  if (navLinks.length === 0) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 block md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-all duration-300"
    >
      <div className="flex items-center justify-around h-15 max-w-md mx-auto px-2">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => playHapticChime()}
              className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-200 relative select-none ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-indigo-50 scale-110 shadow-xs' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute bottom-0.5"></span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
