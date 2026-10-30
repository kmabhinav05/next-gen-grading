import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const THEMES = {
  cream: {
    outer: 'bg-[#94a3b8]',
    canvas: 'bg-gradient-to-br from-[#fbf8f1] via-[#faf6ed] to-[#fef3c7]/40 border-white/60',
  },
  slate: {
    outer: 'bg-[#64748b]',
    canvas: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/60 border-slate-200/80',
  },
  indigo: {
    outer: 'bg-[#3730a3]',
    canvas: 'bg-gradient-to-br from-[#f5f7ff] via-[#eef2ff] to-[#e0e7ff]/70 border-indigo-200/70',
  },
  emerald: {
    outer: 'bg-[#064e3b]',
    canvas: 'bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5]/60 border-emerald-200/70',
  },
};

export const DashboardLayout = () => {
  const { role } = useAuth();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('pref_theme') || 'cream');

  useEffect(() => {
    const applyPreferences = () => {
      const activeTheme = localStorage.getItem('pref_theme') || 'cream';
      const isHighContrast = localStorage.getItem('pref_contrast') === 'true';
      const density = localStorage.getItem('pref_density') || 'comfortable';

      setThemeKey(activeTheme);

      if (isHighContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      document.documentElement.setAttribute('data-density', density);
    };

    applyPreferences();
    window.addEventListener('theme-changed', applyPreferences);
    window.addEventListener('storage', applyPreferences);

    return () => {
      window.removeEventListener('theme-changed', applyPreferences);
      window.removeEventListener('storage', applyPreferences);
    };
  }, []);

  const activeTheme = THEMES[themeKey] || THEMES.cream;

  return (
    <div className={`min-h-screen ${activeTheme.outer} py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans transition-colors duration-300 selection:bg-[#ffc83b] selection:text-slate-900`}>
      {/* Outer Dashboard Rounded Canvas Shell with Dynamic Theme Tint */}
      <div className={`max-w-[1440px] mx-auto min-h-[95vh] ${activeTheme.canvas} rounded-[38px] p-5 sm:p-7 md:p-8 shadow-2xl border transition-all duration-300 flex flex-col justify-between`}>
        
        {/* Top Floating Pill Navigation */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Student chatbot widget */}
      {role === 'STUDENT' && <ChatbotWidget />}

      {/* Toast notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
};
