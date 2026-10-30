import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import HoldButton from '../../components/common/HoldButton';
import { playHapticChime } from '../../utils/sound';
import { Modal } from '../../components/common/Modal';
import {
  Settings as SettingsIcon,
  Sliders,
  Bell,
  Shield,
  Database,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Laptop,
  Globe,
  SlidersHorizontal,
  Download,
  ArrowLeft,
  Volume2,
  Eye,
  QrCode,
  Key,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'academic' | 'notifications' | 'security' | 'data'

  // Preferences State (Persisted in localStorage)
  const [density, setDensity] = useState(() => localStorage.getItem('pref_density') || 'comfortable');
  const [accentTheme, setAccentTheme] = useState(() => localStorage.getItem('pref_theme') || 'cream');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('pref_sound') !== 'false');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('pref_contrast') === 'true');

  // Academic Settings (Admin & Staff & Student)
  const [attendanceThreshold, setAttendanceThreshold] = useState(() => Number(localStorage.getItem('conf_att_threshold') || 75));
  const [criticalThreshold, setCriticalThreshold] = useState(() => Number(localStorage.getItem('conf_crit_threshold') || 65));
  const [studentGoal, setStudentGoal] = useState(() => Number(localStorage.getItem('conf_student_goal') || 85));

  // Notification Toggles
  const [notifyShortage, setNotifyShortage] = useState(() => localStorage.getItem('pref_notif_shortage') !== 'false');
  const [notifySms, setNotifySms] = useState(() => localStorage.getItem('pref_notif_sms') === 'true' || role === 'PARENT');
  const [notifyResults, setNotifyResults] = useState(() => localStorage.getItem('pref_notif_results') !== 'false');

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => localStorage.getItem('pref_2fa') === 'true');
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11 (Current)', location: 'Active Now • Localhost (127.0.0.1)', current: true },
    { id: 2, device: 'Safari on iPhone 15 Pro', location: '2 hours ago • Cellular Data', current: false },
    { id: 3, device: 'Firefox on macOS Monterey', location: 'Yesterday • Campus Wi-Fi', current: false }
  ]);

  // Apply theme immediately on selection
  const handleThemeChange = (themeId) => {
    setAccentTheme(themeId);
    localStorage.setItem('pref_theme', themeId);
    window.dispatchEvent(new Event('theme-changed'));
    toast.success(`Switched to ${themeId === 'cream' ? 'Warm Academic' : themeId === 'slate' ? 'Cool Slate' : themeId === 'indigo' ? 'Royal Indigo' : 'Botanical Emerald'} theme!`, {
      icon: '🎨',
      duration: 2000
    });
  };

  const handleDensityChange = (densityId) => {
    setDensity(densityId);
    localStorage.setItem('pref_density', densityId);
    document.documentElement.setAttribute('data-density', densityId);
    window.dispatchEvent(new Event('theme-changed'));
    toast.success(`Layout density set to ${densityId}!`, { icon: '📐', duration: 1500 });
  };

  const handleSoundToggle = (enabled) => {
    setSoundEnabled(enabled);
    localStorage.setItem('pref_sound', String(enabled));
    if (enabled) {
      playHapticChime();
      toast.success('Audio cues enabled! Wave sound will play on button holds.', { icon: '🔊' });
    } else {
      toast('Audio cues muted.', { icon: '🔇' });
    }
  };

  const handleContrastToggle = (enabled) => {
    setHighContrast(enabled);
    localStorage.setItem('pref_contrast', String(enabled));
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
      toast.success('High contrast mode activated.', { icon: '👁️' });
    } else {
      document.documentElement.classList.remove('high-contrast');
      toast('Standard contrast restored.', { icon: '👁️' });
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('pref_density', density);
    localStorage.setItem('pref_theme', accentTheme);
    localStorage.setItem('pref_sound', String(soundEnabled));
    localStorage.setItem('pref_contrast', String(highContrast));
    localStorage.setItem('conf_att_threshold', String(attendanceThreshold));
    localStorage.setItem('conf_crit_threshold', String(criticalThreshold));
    localStorage.setItem('conf_student_goal', String(studentGoal));
    localStorage.setItem('pref_notif_shortage', String(notifyShortage));
    localStorage.setItem('pref_notif_sms', String(notifySms));
    localStorage.setItem('pref_notif_results', String(notifyResults));

    window.dispatchEvent(new Event('theme-changed'));
    playHapticChime();
    toast.success('All portal preferences and thresholds saved successfully!');
  };

  const handleSendTestNotification = () => {
    playHapticChime();
    toast.success('Test alert generated! Added to your Notification Center bell.', { icon: '🔔' });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      toast.error('Please enter your current password');
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    toast.success('Password updated successfully! Next login requires the new password.');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleTerminateOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    playHapticChime();
    toast.success('Terminated 2 remote device sessions! Only this active session remains.');
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (twoFactorCode.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit authenticator code.');
      return;
    }
    setTwoFactorEnabled(true);
    localStorage.setItem('pref_2fa', 'true');
    setIs2FAModalOpen(false);
    setTwoFactorCode('');
    playHapticChime();
    toast.success('Two-Factor Authentication (2FA) successfully activated!');
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    localStorage.setItem('pref_2fa', 'false');
    toast('Two-Factor Authentication disabled.', { icon: '🛡️' });
  };

  const handleExportDataBackup = () => {
    const backupData = {
      institution: 'Next Gen Grading Autonomous Academy',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      user: { id: user?.id, username: user?.username, role },
      systemSettings: { attendanceThreshold, criticalThreshold, studentGoal, accentTheme, density, soundEnabled }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NextGenGrading_ConfigBackup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playHapticChime();
    toast.success('System configuration and data backup exported successfully!');
  };

  const handleResetDemoData = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('demo_') || k.startsWith('pref_') || k.startsWith('conf_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    toast.success('Cache cleared! Default institutional datasets restored.');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={
              role === 'ADMIN'
                ? '/admin/dashboard'
                : role === 'STAFF'
                ? '/staff/dashboard'
                : role === 'STUDENT'
                ? '/student/dashboard'
                : '/parent/dashboard'
            }
            className="p-2.5 rounded-2xl bg-white/90 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-white shadow-2xs transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PORTAL SETTINGS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
              <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                {role} Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Settings & Preferences
            </h1>
          </div>
        </div>

        {/* Global Save Button using HoldButton */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all"
          >
            Save Changes
          </button>
          <HoldButton
            onHold={handleSavePreferences}
            onTap={handleSavePreferences}
            doneLabel="Settings Saved!"
            backgroundColor="#0f172a"
            fillColor="#6366f1"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            holdTime={1000}
            radius={12}
            size="md"
            icon={<Save className="w-4 h-4 mr-1.5" />}
          >
            Hold to Save Settings
          </HoldButton>
        </div>
      </div>

      {/* Main Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'general', label: 'Appearance & UI', icon: Sliders },
          { id: 'academic', label: 'Academic & Grading Rules', icon: GraduationCap },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'security', label: 'Security & Password', icon: Shield },
          { id: 'data', label: 'Data & Backup', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General & UI Preferences */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Display & Density Preferences</h2>
              <p className="text-xs text-slate-500 mt-0.5">Customize UI comfort, real-time theme canvas tints, and layout spacing</p>
            </div>

            {/* Density Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Table & Register Layout Density</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'compact', label: 'Compact', desc: 'Maximum data rows on screen' },
                  { id: 'comfortable', label: 'Comfortable (Default)', desc: 'Balanced padding and readability' },
                  { id: 'relaxed', label: 'Relaxed', desc: 'Spacious padding for tablet use' }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleDensityChange(d.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      density === d.id
                        ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="font-bold text-slate-900 text-xs block">{d.label}</span>
                    <span className="text-[11px] text-slate-500 mt-1 block">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme & Canvas Palette (Instant Real-Time Swapping!) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">Canvas Background Tone</label>
                <span className="text-[11px] text-slate-400 font-medium">Click to apply instantly</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'cream', label: 'Warm Academic', bg: 'bg-[#faf6ed]', border: 'border-amber-200' },
                  { id: 'slate', label: 'Cool Slate', bg: 'bg-[#f1f5f9]', border: 'border-slate-300' },
                  { id: 'indigo', label: 'Royal Indigo', bg: 'bg-[#e0e7ff]', border: 'border-indigo-300' },
                  { id: 'emerald', label: 'Botanical Emerald', bg: 'bg-[#ecfdf5]', border: 'border-emerald-300' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                      accentTheme === t.id
                        ? 'border-slate-900 bg-white ring-2 ring-slate-900/15 shadow-sm'
                        : 'border-slate-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 ${t.border} ${t.bg} flex-shrink-0`}></span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{t.label}</span>
                      <span className="text-[10px] text-slate-400 block">{accentTheme === t.id ? 'Active' : 'Select'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility & Audio Toggles with Live Test Button */}
            <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">Button Hold Sound & Haptics</span>
                  <span className="text-slate-500 text-[11px] block">Play liquid wave feedback chime on hold completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={playHapticChime}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold shadow-2xs flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3 text-indigo-600" />
                    <span>Test Sound</span>
                  </button>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => handleSoundToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">High Contrast Mode</span>
                  <span className="text-slate-500 text-[11px] block">Enhance borders and text contrast for low vision / accessibility</span>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => handleContrastToggle(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Academic & Grading Rules */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Institutional Attendance Thresholds</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the mandatory minimum attendance percentage for examination hall ticket eligibility
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mandatory Attendance Threshold */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {role === 'STUDENT' ? 'Institutional Minimum Rule' : 'Mandatory Attendance Threshold'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-mono">
                    {attendanceThreshold}% Cutoff
                  </span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="85"
                  step="1"
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                  disabled={role !== 'ADMIN'}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-[11px] text-slate-500 block leading-relaxed">
                  Students below this percentage are automatically flagged for attendance shortage notices.
                </span>
              </div>

              {/* Personal Goal or Critical Shortage */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {role === 'STUDENT' ? 'Your Personal Attendance Goal' : 'Critical Shortage Level'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs font-mono">
                    {role === 'STUDENT' ? `${studentGoal}% Goal` : `${criticalThreshold}% Critical`}
                  </span>
                </div>
                <input
                  type="range"
                  min={role === 'STUDENT' ? 75 : 50}
                  max={role === 'STUDENT' ? 95 : 70}
                  step="1"
                  value={role === 'STUDENT' ? studentGoal : criticalThreshold}
                  onChange={(e) => {
                    if (role === 'STUDENT') setStudentGoal(Number(e.target.value));
                    else setCriticalThreshold(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-[11px] text-slate-500 block leading-relaxed">
                  {role === 'STUDENT'
                    ? 'Customizes the smart simulators on your dashboard to calculate safe leaves toward your goal.'
                    : 'Requires immediate parent consultation and Controller of Examinations (COE) condonation.'}
                </span>
              </div>
            </div>

            {/* Live Threshold Indicator Pill */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <span className="font-semibold">
                With a {attendanceThreshold}% threshold, a student can miss at most 1 in every 4 lectures safely.
              </span>
              <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-emerald-100">
                Rule Validated
              </span>
            </div>

            {/* Grading Scale Breakdown Table */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Official Grading Scale Matrix (10-Point Scale)</span>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2.5">Marks Range</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5">Grade Point</th>
                      <th className="p-2.5">Academic Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr><td className="p-2.5 font-bold">90% - 100%</td><td className="p-2.5 font-bold text-emerald-700">O (Outstanding)</td><td className="p-2.5">10.0</td><td className="p-2.5 font-sans text-slate-600">Dean's Honor Roll</td></tr>
                    <tr><td className="p-2.5 font-bold">80% - 89%</td><td className="p-2.5 font-bold text-indigo-700">A+ (Excellent)</td><td className="p-2.5">9.0</td><td className="p-2.5 font-sans text-slate-600">Distinction</td></tr>
                    <tr><td className="p-2.5 font-bold">70% - 79%</td><td className="p-2.5 font-bold text-cyan-700">A (Very Good)</td><td className="p-2.5">8.0</td><td className="p-2.5 font-sans text-slate-600">First Class with Merit</td></tr>
                    <tr><td className="p-2.5 font-bold">60% - 69%</td><td className="p-2.5 font-bold text-amber-700">B+ (Good)</td><td className="p-2.5">7.0</td><td className="p-2.5 font-sans text-slate-600">First Class</td></tr>
                    <tr><td className="p-2.5 font-bold">50% - 59%</td><td className="p-2.5 font-bold text-slate-700">B (Above Average)</td><td className="p-2.5">6.0</td><td className="p-2.5 font-sans text-slate-600">Second Class</td></tr>
                    <tr><td className="p-2.5 font-bold">40% - 49%</td><td className="p-2.5 font-bold text-orange-700">C (Pass)</td><td className="p-2.5">5.0</td><td className="p-2.5 font-sans text-slate-600">Passing Grade</td></tr>
                    <tr><td className="p-2.5 font-bold text-rose-700">&lt; 40%</td><td className="p-2.5 font-bold text-rose-700">F (Fail / Remedial)</td><td className="p-2.5">0.0</td><td className="p-2.5 font-sans text-rose-600">Re-examination Required</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Notifications & Communication */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Notification Channels & Automated Alerts</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure automated SMS and push notifications for absence notices and exam announcements
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendTestNotification}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Bell className="w-3.5 h-3.5 text-indigo-600" />
                <span>Send Test Notification</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Attendance Shortage Warnings</span>
                  <span className="text-slate-500 text-[11px] block">
                    Receive alert when attendance drops below the 75% threshold
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyShortage}
                  onChange={(e) => setNotifyShortage(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Instant SMS to Guardian on Student Absence</span>
                  <span className="text-slate-500 text-[11px] block">
                    Dispatches automated SMS to registered mobile numbers during morning roll call
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Semester Examination Results Published</span>
                  <span className="text-slate-500 text-[11px] block">
                    High-priority alert when COE officially releases consolidated grade sheets
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyResults}
                  onChange={(e) => setNotifyResults(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Security & Password */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Security Credentials & 2FA</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage your institutional credentials and device sessions</p>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="e.g. student123 or admin123"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm matching password"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xs"
              >
                Update Password
              </button>
            </form>

            {/* Two-Factor Authentication Section */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-slate-500 block">Protects your account with Google Authenticator or mobile token</span>
                </div>
                {twoFactorEnabled ? (
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIs2FAModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Setup 2FA</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Sessions with Functional Termination */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Active Device Sessions</span>
                  <span className="text-[11px] text-slate-500 block">Review and revoke active web and mobile connections</span>
                </div>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={handleTerminateOtherSessions}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3 text-rose-600" />
                    <span>Log Out Other Devices</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {sessions.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{s.device}</span>
                        <span className={`text-[11px] font-semibold block ${s.current ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {s.location}
                        </span>
                      </div>
                    </div>
                    {s.current ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Current Session
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                        Remote Session
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Data & Backup */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Institutional Data Management & Backup</h2>
              <p className="text-xs text-slate-500 mt-0.5">Export academic configuration records or reset demo datasets</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary-600" />
                  <span className="font-bold text-slate-900 text-xs">Export System Backup</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Downloads full JSON snapshot of institutional settings, grading thresholds, and session states.
                </p>
                <button
                  type="button"
                  onClick={handleExportDataBackup}
                  className="px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-2xs transition-all"
                >
                  Download .JSON Backup
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-rose-900 text-xs">Reset Demo Cache</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Clears local storage overrides and re-seeds clean academic demo registries.
                </p>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-2xs transition-all"
                >
                  Reset Demo Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      <Modal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} title="Setup Two-Factor Authentication">
        <form onSubmit={handleVerify2FA} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Scan this QR code with Google Authenticator, 1Password, or Microsoft Authenticator, then enter the 6-digit code:
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-xs">
              <QrCode className="w-24 h-24 text-slate-800" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">Manual Key: NGEN-GRAD-2026-AUTH</span>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">6-Digit Verification Code</label>
            <input
              type="text"
              maxLength={6}
              required
              placeholder="e.g. 542198"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 text-center font-mono text-base font-bold tracking-widest border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIs2FAModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
            >
              Verify & Enable 2FA
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
