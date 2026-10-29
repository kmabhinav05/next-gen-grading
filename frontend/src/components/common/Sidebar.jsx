import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Link as LinkIcon,
  Upload,
  ClipboardCheck,
  FileText,
  FileSpreadsheet,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();

  const getMenuItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
          { to: '/admin/students', label: 'Manage Students', icon: GraduationCap },
          { to: '/admin/staff', label: 'Manage Faculty', icon: Users },
          { to: '/admin/parents', label: 'Manage Parents', icon: Users },
          { to: '/admin/subjects', label: 'Courses & Subjects', icon: BookOpen },
          { to: '/admin/parent-student', label: 'Link Parent & Ward', icon: LinkIcon },
          { to: '/admin/reports', label: 'Class Reports & Audit', icon: FileSpreadsheet },
          { to: '/results', label: 'COE Results (Future)', icon: Award, badge: 'Soon' },
        ];
      case 'STAFF':
        return [
          { to: '/staff/dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
          { to: '/staff/upload-marks', label: 'Upload Internal Marks', icon: Upload },
          { to: '/staff/attendance', label: 'Enter Attendance', icon: ClipboardCheck },
          { to: '/staff/class-report', label: 'Class Progress Reports', icon: FileText },
          { to: '/results', label: 'COE Results (Future)', icon: Award, badge: 'Soon' },
        ];
      case 'STUDENT':
        return [
          { to: '/student/dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { to: '/student/progress-card', label: 'Digital Progress Card', icon: FileText },
          { to: '/student/attendance', label: 'Attendance Breakdown', icon: ClipboardCheck },
          { to: '/results', label: 'COE Results (Future)', icon: Award, badge: 'Soon' },
        ];
      case 'PARENT':
        return [
          { to: '/parent/dashboard', label: 'Parent Portal', icon: LayoutDashboard },
          { to: '/parent/progress-card', label: 'Ward Progress Card', icon: FileText },
          { to: '/parent/attendance', label: 'Ward Attendance', icon: ClipboardCheck },
          { to: '/results', label: 'COE Results (Future)', icon: Award, badge: 'Soon' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 bg-slate-950/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">Next Gen Grading</h1>
              <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider uppercase font-medium">Academic Assistance</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {role} Workspace
            </div>
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-800 text-amber-400 rounded-md border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-primary-400 border border-slate-700">
              {user?.full_name ? user.full_name[0] : (user?.username ? user.username[0].toUpperCase() : 'U')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || user?.username}</p>
              <p className="text-[10px] text-slate-400 capitalize">{role?.toLowerCase()} User</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
