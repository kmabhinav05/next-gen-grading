import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, ShieldCheck, UserCheck, GraduationCap, HeartHandshake } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            Administrator
          </span>
        );
      case 'STAFF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Faculty Staff
          </span>
        );
      case 'STUDENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            Student ({user?.student?.reg_no || 'Enrolled'})
          </span>
        );
      case 'PARENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            Parent / Guardian
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img
          src="/logo-transparent.png"
          alt="Next Gen Grading"
          className="h-7 object-contain hidden sm:block mr-1"
        />
        <div className="hidden md:block border-l border-slate-200 pl-3">
          <h2 className="text-sm font-semibold text-slate-800 leading-tight">Department of Computer Science & Engineering</h2>
          <p className="text-[11px] text-slate-500">Internal Assessment & Attendance Management System</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {getRoleBadge()}
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />
        <button
          onClick={logout}
          title="Sign out"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
