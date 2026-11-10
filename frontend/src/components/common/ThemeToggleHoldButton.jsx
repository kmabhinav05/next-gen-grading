'use client';

import React, { useState, useEffect } from 'react';
import HoldButton from './HoldButton';
import { Moon, Sun, Check } from 'lucide-react';
import { getStoredMode, toggleColorMode } from '../../utils/theme';
import { playHapticChime } from '../../utils/sound';
import toast from 'react-hot-toast';

export const ThemeToggleHoldButton = ({
  size = 'sm', // 'sm' | 'md' | 'lg'
  compact = false,
  className = '',
  onModeToggled = null
}) => {
  const [mode, setMode] = useState(() => getStoredMode());

  useEffect(() => {
    const handleModeChange = () => {
      setMode(getStoredMode());
    };
    window.addEventListener('mode-changed', handleModeChange);
    window.addEventListener('theme-changed', handleModeChange);
    window.addEventListener('storage', handleModeChange);
    return () => {
      window.removeEventListener('mode-changed', handleModeChange);
      window.removeEventListener('theme-changed', handleModeChange);
      window.removeEventListener('storage', handleModeChange);
    };
  }, []);

  const isDark = mode === 'dark';

  const handleToggle = () => {
    const nextMode = toggleColorMode();
    playHapticChime();
    toast.success(
      nextMode === 'dark' ? 'Switched to Dark Mode!' : 'Switched to Light Mode!',
      {
        icon: nextMode === 'dark' ? '🌙' : '☀️',
        duration: 2000
      }
    );
    if (onModeToggled) onModeToggled(nextMode);
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isDark ? (
        <HoldButton
          key="to-light"
          size={size}
          radius={size === 'sm' ? 9999 : 14}
          backgroundColor="#ffffff"
          fillColor="#f59e0b"
          textColor="#0f172a"
          fillTextColor="#ffffff"
          icon={<Sun className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-500`} />}
          doneIcon={<Check className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />}
          doneLabel={compact ? 'Light' : 'Light Mode'}
          holdTime={900}
          releaseTime={200}
          pressScale={0.97}
          wave
          waveAmplitude={size === 'sm' ? 4 : 6}
          glow
          resetAfter={800}
          onHold={handleToggle}
          onTap={handleToggle}
          className="shadow-2xs border border-white/20 font-semibold tracking-wide"
        >
          {compact ? 'Light' : size === 'sm' ? 'Hold for Light' : 'Hold for Light Mode'}
        </HoldButton>
      ) : (
        <HoldButton
          key="to-dark"
          size={size}
          radius={size === 'sm' ? 9999 : 14}
          backgroundColor="#0f172a"
          fillColor="#6366f1"
          textColor="#f8fafc"
          fillTextColor="#ffffff"
          icon={<Moon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-indigo-400`} />}
          doneIcon={<Check className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />}
          doneLabel={compact ? 'Dark' : 'Dark Mode'}
          holdTime={900}
          releaseTime={200}
          pressScale={0.97}
          wave
          waveAmplitude={size === 'sm' ? 4 : 6}
          glow
          resetAfter={800}
          onHold={handleToggle}
          onTap={handleToggle}
          className="shadow-2xs border border-slate-700/60 font-semibold tracking-wide"
        >
          {compact ? 'Dark' : size === 'sm' ? 'Hold for Dark' : 'Hold for Dark Mode'}
        </HoldButton>
      )}
    </div>
  );
};

export default ThemeToggleHoldButton;
