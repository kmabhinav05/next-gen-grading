import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, User, ArrowRight, ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setSubmitting(true);
    try {
      const user = await login(username, password);
      redirectByRole(user.role);
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  const redirectByRole = (role) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'STAFF':
        navigate('/staff/dashboard');
        break;
      case 'STUDENT':
        navigate('/student/dashboard');
        break;
      case 'PARENT':
        navigate('/parent/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleQuickLogin = async (u, p) => {
    setUsername(u);
    setPassword(p);
    setSubmitting(true);
    try {
      const user = await login(u, p);
      redirectByRole(user.role);
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-sm">
          {/* Brand header */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Next Gen Grading"
              className="h-12 mx-auto mb-2 object-contain"
            />
            <p className="text-xs text-slate-500 mt-1">Academic Department Assistance & Progress System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Username / Reg No
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin, staff_sharma, student1"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Roles
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/60 text-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 leading-none">Admin</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">admin123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff_sharma', 'staff123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 text-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 leading-none">Staff</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Prof. Sharma</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('student1', 'student123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 leading-none">Student</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aarav (21CS001)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('parent_patel', 'parent123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/60 text-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 leading-none">Parent</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aarav's Father</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Next Gen Grading &copy; 2026 Academic Department Assistance
        </p>
      </div>
    </div>
  );
};
