import React, { useState, useEffect } from 'react';
import { Sun, Sunrise, Moon, Calendar, Clock, Sparkles, Activity } from 'lucide-react';

/**
 * Returns dynamic salutation and theme details according to local device time
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      salutation: 'Good morning',
      label: 'Morning Session',
      period: 'morning',
      icon: Sunrise,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300/80',
      iconColor: 'text-amber-600',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      salutation: 'Good afternoon',
      label: 'Afternoon Session',
      period: 'afternoon',
      icon: Sun,
      badgeColor: 'bg-amber-500/15 text-amber-900 border-amber-300',
      iconColor: 'text-amber-600',
    };
  } else {
    return {
      salutation: 'Good evening',
      label: 'Evening Session',
      period: 'evening',
      icon: Moon,
      badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200/90',
      iconColor: 'text-indigo-600',
    };
  }
};

export const PortalHeaderBanner = ({ role, subtitle, extraPill }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const greeting = getTimeBasedGreeting();
  const Icon = greeting.icon;

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getRoleBadge = () => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Controller of Examinations Console',
          status: 'COE Engine Active',
        };
      case 'STAFF':
        return {
          label: 'Faculty Academic Station',
          status: 'Attendance Registry Open',
        };
      case 'STUDENT':
        return {
          label: 'Autonomous Academic Workspace',
          status: 'Term: Odd Sem 2026-2027',
        };
      case 'PARENT':
        return {
          label: 'Guardian Engagement Hub',
          status: 'Academic Intimation Live',
        };
      default:
        return {
          label: 'Academic Management Portal',
          status: 'System Synchronized',
        };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <div className="w-full bg-white/85 backdrop-blur-md rounded-[26px] p-3.5 sm:px-5 sm:py-3 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
      {/* Left: Dynamic Time Greeting & Date */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Dynamic Salutation Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shadow-2xs ${greeting.badgeColor}`}
        >
          <Icon className={`w-3.5 h-3.5 ${greeting.iconColor}`} />
          <span>{greeting.salutation}</span>
          <span className="opacity-60">• {greeting.label}</span>
        </div>

        {/* Date and Time Info */}
        <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px] sm:text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateString}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 font-semibold">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{timeString}</span>
          </div>
        </div>
      </div>

      {/* Right: Role Status & Academic Pill */}
      <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
        {extraPill && (
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-slate-100/90 text-slate-700 text-[11px] font-semibold border border-slate-200/80">
            {extraPill}
          </span>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b]/5 border border-slate-200 text-slate-700 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
          <span className="font-bold text-slate-800">{roleInfo.label}</span>
          <span className="text-slate-400 hidden lg:inline">• {subtitle || roleInfo.status}</span>
        </div>
      </div>
    </div>
  );
};
