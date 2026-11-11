import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { BottomNav } from '../components/common/BottomNav';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const THEMES = {
  cream: {
    outer: 'bg-[#e8e4da]',
    canvas: 'bg-gradient-to-br from-[#fbf8f1] via-[#faf6ed] to-[#fef3c7]/40 border-white/80',
  },
  slate: {
    outer: 'bg-[#e2e8f0]',
    canvas: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/60 border-slate-200/90',
  },
  indigo: {
    outer: 'bg-[#e0e7ff]',
    canvas: 'bg-gradient-to-br from-[#f5f7ff] via-[#eef2ff] to-[#e0e7ff]/70 border-indigo-200/80',
  },
  emerald: {
    outer: 'bg-[#d1fae5]',
    canvas: 'bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5]/60 border-emerald-200/80',
  },
};

const DARK_THEMES = {
  cream: {
    outer: 'bg-[#080c14]',
    canvas: 'bg-gradient-to-br from-[#0f172a] via-[#111c30] to-[#1e1b4b]/20 border-slate-800/80',
  },
  slate: {
    outer: 'bg-[#06090f]',
    canvas: 'bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#090d16] border-slate-800/80',
  },
  indigo: {
    outer: 'bg-[#070815]',
    canvas: 'bg-gradient-to-br from-[#0d1028] via-[#0a0c20] to-[#1e1b4b]/30 border-indigo-950/80',
  },
  emerald: {
    outer: 'bg-[#040d0a]',
    canvas: 'bg-gradient-to-br from-[#061e16] via-[#04150f] to-[#022c22]/30 border-emerald-950/80',
  },
};

export const DashboardLayout = () => {
  const { role } = useAuth();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('pref_theme') || 'cream');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('pref_mode') === 'dark');

  useEffect(() => {
    const applyPreferences = () => {
      const activeTheme = localStorage.getItem('pref_theme') || 'cream';
      const activeMode = localStorage.getItem('pref_mode') || 'light';
      const isHighContrast = localStorage.getItem('pref_contrast') === 'true';
      const density = localStorage.getItem('pref_density') || 'comfortable';

      setThemeKey(activeTheme);
      setIsDark(activeMode === 'dark');

      if (activeMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (isHighContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      document.documentElement.setAttribute('data-density', density);
    };

    applyPreferences();
    window.addEventListener('theme-changed', applyPreferences);
    window.addEventListener('mode-changed', applyPreferences);
    window.addEventListener('storage', applyPreferences);

    return () => {
      window.removeEventListener('theme-changed', applyPreferences);
      window.removeEventListener('mode-changed', applyPreferences);
      window.removeEventListener('storage', applyPreferences);
    };
  }, []);

  const activeTheme = isDark
    ? (DARK_THEMES[themeKey] || DARK_THEMES.cream)
    : (THEMES[themeKey] || THEMES.cream);

  return (
    <div
      className={`min-h-[100dvh] ${activeTheme.outer} py-2 sm:py-6 px-2 sm:px-6 md:px-8 pb-24 md:pb-6 font-sans transition-colors duration-300 selection:bg-[#ffc83b] selection:text-slate-900 overflow-x-hidden`}
    >
      {/* Outer Dashboard Rounded Canvas Shell with Dynamic Theme Tint */}
      <div
        className={`max-w-[1440px] mx-auto min-h-[92dvh] ${activeTheme.canvas} rounded-[28px] sm:rounded-[38px] p-3.5 sm:p-7 md:p-8 shadow-2xl border transition-all duration-300 flex flex-col justify-between`}
      >
        {/* Top Floating Pill Navigation & Mobile Header */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Student chatbot widget with responsive full-sheet mobile mode */}
      {role === 'STUDENT' && <ChatbotWidget />}

      {/* Mobile Bottom Navigation Bar (4-5 most used links per role) */}
      <BottomNav />

      {/* Toast notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
};

export default DashboardLayout;
