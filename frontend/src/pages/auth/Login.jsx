import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, UserCheck, GraduationCap, HeartHandshake, X } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setSubmitting(true);
    try {
      const user = await login(username, password);
      redirectByRole(user.role);
    } catch (err) {
      // Toast displayed by AuthContext
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-[#94a3b8] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      {/* Outer Card with rounded corners and warm glow */}
      <div className="relative w-full max-w-[1000px] min-h-[580px] bg-gradient-to-br from-[#fbf8f1] via-[#fbf7ee] to-[#fef3c7]/60 rounded-[36px] shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between border border-white/60">
        
        {/* Top bar with Brand Pill and Top Right Close button */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300/80 bg-white/80 backdrop-blur-sm shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">Next Gen Grading</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-slate-500 shadow-2xs cursor-default">
            <X className="w-4 h-4" />
          </div>
        </div>

        {/* Main Grid: Form Left (45%) & Showcase Right (55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-2">
          
          {/* Left Form Column */}
          <div className="lg:col-span-5 max-w-md w-full mx-auto flex flex-col justify-center">
            <div className="text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-xs text-slate-500 mt-1.5">
                Next Gen Grading • Academic Department System
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 pl-1">
                  Username or Register Number
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin, staff_sharma, student1"
                  className="w-full px-5 py-3 text-sm bg-white/90 border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-all shadow-2xs placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-5 pr-12 py-3 text-sm bg-white/90 border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-all shadow-2xs placeholder:text-slate-400 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 bg-[#ffc83b] hover:bg-[#f5b82e] active:scale-[0.99] text-slate-900 font-bold rounded-2xl transition-all shadow-sm hover:shadow text-sm disabled:opacity-60 mt-2"
              >
                {submitting ? 'Authenticating...' : 'Submit'}
              </button>
            </form>

            {/* Quick Demo Role Selector Pills */}
            <div className="mt-6 pt-5 border-t border-slate-200/60">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 pl-1">
                Demo Quick Logins
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin123')}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 bg-white/70 hover:bg-white hover:border-[#f59e0b]/50 text-slate-700 transition-all flex items-center gap-2 shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <div className="text-left truncate">
                    <div className="font-semibold text-slate-900 leading-none">Admin</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">admin123</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('staff_sharma', 'staff123')}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 bg-white/70 hover:bg-white hover:border-[#f59e0b]/50 text-slate-700 transition-all flex items-center gap-2 shadow-2xs"
                >
                  <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="text-left truncate">
                    <div className="font-semibold text-slate-900 leading-none">Faculty</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">staff123</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('student1', 'student123')}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 bg-white/70 hover:bg-white hover:border-[#f59e0b]/50 text-slate-700 transition-all flex items-center gap-2 shadow-2xs"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="text-left truncate">
                    <div className="font-semibold text-slate-900 leading-none">Student</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">student123</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('parent_patel', 'parent123')}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 bg-white/70 hover:bg-white hover:border-[#f59e0b]/50 text-slate-700 transition-all flex items-center gap-2 shadow-2xs"
                >
                  <HeartHandshake className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div className="text-left truncate">
                    <div className="font-semibold text-slate-900 leading-none">Parent</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">parent123</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Showcase Column (Visual Card from image) */}
          <div className="lg:col-span-7 hidden lg:block h-full">
            <div className="relative w-full h-[480px] rounded-[30px] overflow-hidden shadow-lg border border-slate-200/50 bg-slate-900">
              <img
                src="/login-showcase.png"
                alt="Academic Collaboration Showcase"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 text-[11px] text-slate-500">
          <div>
            Need assistance? <span className="underline cursor-pointer font-medium text-slate-700">Contact Department Office</span>
          </div>
          <div>
            <span className="underline cursor-pointer font-medium text-slate-700">Terms & Academic Regulations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
