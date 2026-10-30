import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export const Unauthorized = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'STAFF':
        return '/staff/dashboard';
      case 'STUDENT':
        return '/student/dashboard';
      case 'PARENT':
        return '/parent/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Access Restricted</h2>
        
        {user ? (
          <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
            <span className="text-slate-400 block mb-0.5">Currently signed in as:</span>
            <strong className="text-slate-800 text-sm block">{user.full_name || user.username}</strong>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
              {role} Role
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You do not have the required role or authorization to access this academic view.
          </p>
        )}

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          This portal section is reserved for another user role. You can return to your role's dashboard or switch to a different account below.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6">
          <Link
            to={getDashboardPath()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

