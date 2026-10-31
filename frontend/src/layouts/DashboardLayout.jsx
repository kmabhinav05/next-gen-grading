import React, { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { BottomNav } from '../components/common/BottomNav';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';
import { Skeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Gentle inner-canvas page skeleton fallback (keeps layout & navbar mounted)
const PageContentSkeleton = () => (
  <div className="space-y-5 p-2 animate-in fade-in duration-150">
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-10 w-48 rounded-2xl bg-slate-200/80" />
      <Skeleton className="h-10 w-28 rounded-2xl bg-slate-200/80" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-32 rounded-3xl bg-slate-200/80" />
      <Skeleton className="h-32 rounded-3xl bg-slate-200/80" />
      <Skeleton className="h-32 rounded-3xl bg-slate-200/80" />
      <Skeleton className="h-32 rounded-3xl bg-slate-200/80" />
    </div>
    <Skeleton className="h-72 w-full rounded-3xl bg-slate-200/80" />
  </div>
);

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
    <div
      className={`min-h-[100dvh] ${activeTheme.outer} py-2 sm:py-6 px-2 sm:px-6 md:px-8 pb-24 md:pb-6 font-sans transition-colors duration-300 selection:bg-[#ffc83b] selection:text-slate-900 overflow-x-hidden`}
    >
      {/* Outer Dashboard Rounded Canvas Shell with Dynamic Theme Tint */}
      <div
        className={`max-w-[1440px] mx-auto min-h-[92dvh] ${activeTheme.canvas} rounded-[28px] sm:rounded-[38px] p-3.5 sm:p-7 md:p-8 shadow-2xl border transition-all duration-300 flex flex-col justify-between`}
      >
        {/* Top Floating Pill Navigation & Mobile Header */}
        <Navbar />

        {/* Dynamic Route Content with isolated Suspense boundary to prevent layout unmounting */}
        <main className="flex-1 min-w-0">
          <Suspense fallback={<PageContentSkeleton />}>
            <Outlet />
          </Suspense>
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
