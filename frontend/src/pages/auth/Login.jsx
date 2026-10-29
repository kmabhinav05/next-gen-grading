import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, UserCheck, GraduationCap, HeartHandshake } from 'lucide-react';

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
      // Toast notification handled by AuthContext
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
    <div className="min-h-screen bg-[#edf0f5] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      {/* Outer Card with 40px rounded corners and soft drop shadow */}
      <div className="w-full max-w-[1020px] bg-white rounded-[38px] shadow-xl p-5 sm:p-7 md:p-8 border border-slate-100 flex flex-col lg:flex-row gap-8 lg:gap-10 items-center justify-between">
        
        {/* Left Orange Banner Panel (Matching reference) */}
        <div className="w-full lg:w-[48%] h-[380px] sm:h-[460px] lg:h-[550px] rounded-[30px] overflow-hidden shadow-sm flex-shrink-0 relative bg-gradient-to-br from-[#ff6b2b] to-[#ff8f3d]">
          <img
            src="/login-banner.png"
            alt="Next Gen Grading Platform"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Form Column (Matching reference) */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center px-2 sm:px-6 py-2">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff6426] to-[#ff8533] flex items-center justify-center p-1.5 shadow-sm shadow-orange-500/20">
              <img src="/logo.png" alt="Next Gen Grading" className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">Next Gen Grading</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Please login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or Reg No"
                className="w-full px-5 py-3.5 text-sm bg-[#f4f6f9] border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff6928]/30 focus:border-[#ff6928] focus:bg-white transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-5 pr-12 py-3.5 text-sm bg-[#f4f6f9] border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff6928]/30 focus:border-[#ff6928] focus:bg-white transition-all placeholder:text-slate-400 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <span className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer font-medium">
                  Forgot password?
                </span>
              </div>
            </div>

            {/* Solid Orange Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 bg-[#ff6928] hover:bg-[#f25916] active:scale-[0.99] text-white font-semibold rounded-2xl transition-all shadow-md shadow-[#ff6928]/25 text-sm disabled:opacity-60 mt-2"
            >
              {submitting ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center text-xs text-slate-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-slate-400 text-[11px]">
              Or Login with
            </span>
          </div>

          {/* Quick Demo Login Pill Buttons */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-6">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="py-2.5 px-3 rounded-2xl border border-slate-200 bg-white hover:border-[#ff6928]/50 hover:bg-orange-50/20 text-slate-700 transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-xs">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('staff_sharma', 'staff123')}
              className="py-2.5 px-3 rounded-2xl border border-slate-200 bg-white hover:border-[#ff6928]/50 hover:bg-orange-50/20 text-slate-700 transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-xs">Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('student1', 'student123')}
              className="py-2.5 px-3 rounded-2xl border border-slate-200 bg-white hover:border-[#ff6928]/50 hover:bg-orange-50/20 text-slate-700 transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-xs">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('parent_patel', 'parent123')}
              className="py-2.5 px-3 rounded-2xl border border-slate-200 bg-white hover:border-[#ff6928]/50 hover:bg-orange-50/20 text-slate-700 transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <HeartHandshake className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-xs">Parent</span>
            </button>
          </div>

          {/* Footer Signup / Help */}
          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <span
              onClick={() => handleQuickLogin('student1', 'student123')}
              className="text-[#ff6928] font-bold cursor-pointer underline hover:text-[#e05315]"
            >
              Demo Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
