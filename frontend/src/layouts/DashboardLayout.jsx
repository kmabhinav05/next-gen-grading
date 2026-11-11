import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarModern } from '../components/common/SidebarModern';
import { TopBarModern } from '../components/common/TopBarModern';
import { RightPanelModern } from '../components/common/RightPanelModern';
import { BottomNav } from '../components/common/BottomNav';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const DashboardLayout = () => {
  const { role } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const applyPreferences = () => {
      const activeMode = localStorage.getItem('pref_mode') || 'light';
      const isHighContrast = localStorage.getItem('pref_contrast') === 'true';
      const density = localStorage.getItem('pref_density') || 'comfortable';

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

  return (
    <div
      className="min-h-[100dvh] bg-[#ECEFEF] dark:bg-[#0B0F17] py-2 sm:py-5 px-2 sm:px-5 md:px-6 pb-24 md:pb-6 font-sans transition-colors duration-300 selection:bg-[#FEDC56] selection:text-slate-950 overflow-x-hidden"
    >
      {/* Outer Dashboard Rounded Canvas Shell matching reference design */}
      <div
        className="max-w-[1600px] mx-auto min-h-[94dvh] bg-white dark:bg-[#121622] rounded-[32px] sm:rounded-[38px] p-4 sm:p-6 lg:p-7 shadow-2xl border border-slate-200/60 dark:border-slate-800 transition-all duration-300 flex gap-6 lg:gap-7 items-stretch"
      >
        {/* 1. Left Modern Sidebar matching reference design */}
        <SidebarModern
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        />

        {/* 2. Center Content Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between overflow-x-hidden">
          <div className="flex-1">
            <TopBarModern onOpenSidebar={() => setIsMobileDrawerOpen(true)} />
            <main className="min-w-0">
              <Outlet />
            </main>
          </div>
        </div>

        {/* 3. Right Profile & Schedule Column matching reference design */}
        <RightPanelModern />
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
