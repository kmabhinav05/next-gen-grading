import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const DashboardLayout = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-[#94a3b8] py-3 sm:py-6 px-3 sm:px-6 md:px-8 font-sans selection:bg-[#ffc83b] selection:text-slate-900">
      {/* Outer Dashboard Rounded Canvas Shell (matching reference image) */}
      <div className="max-w-[1440px] mx-auto min-h-[95vh] bg-gradient-to-br from-[#fbf8f1] via-[#faf6ed] to-[#fef3c7]/40 rounded-[38px] p-5 sm:p-7 md:p-8 shadow-2xl border border-white/60 flex flex-col justify-between">
        
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
