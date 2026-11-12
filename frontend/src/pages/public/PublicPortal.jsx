import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DrapeBackground from '../../components/ui/DrapeBackground';
import { ThemeToggleHoldButton } from '../../components/common/ThemeToggleHoldButton';
import {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Award,
  ClipboardCheck,
  FileSpreadsheet,
  FolderDown,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Layers,
  Activity,
  FileText,
  Calculator
} from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

const PORTAL_MODULES = [
  {
    id: 'STUDENT',
    title: 'Student Portal',
    badge: 'Learner Suite',
    accent: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: GraduationCap,
    summary:
      'Monitor live IA scores, forecast exam eligibility with spring-physics LiquidGauge simulators, access faculty study materials, and view your printable Digital Progress Card.',
    functions: [
      'LiquidGauge Attendance Goal & Leave Simulator (+ Attend / − Miss forecasting)',
      'Semester SGPA / Grade Projector with real-time Honors & Distinction tiers',
      'Subject Attendance Registry with per-subject safe-miss & shortage indicators',
      'Academic Resources Hub to download faculty notes & store personal study files',
      'Interactive 3D Physics Lanyard ID Card & AI Academic Assistant chatbot'
    ]
  },
  {
    id: 'STAFF',
    title: 'Faculty / Staff Portal',
    badge: 'Teaching & Grading',
    accent: 'text-amber-800 bg-amber-50 border-amber-200',
    icon: BookOpen,
    summary:
      'Streamline Internal Assessment uploads via Excel/CSV, mark daily attendance across assigned courses, issue shortage advisories, and manage parent consultation slots.',
    functions: [
      'Bulk Excel/CSV IA1 & IA2 marks spreadsheet ingestion (UploadMarks)',
      'Fast lecture Attendance Entry grid with bulk Present / Absent / Held tools',
      'Automated identification of students below the mandatory 75% cutoff',
      'Consolidated Class Progress Reports & individual Student Card drilldowns',
      'Parent PTM consultation inbox & absence note review actions'
    ]
  },
  {
    id: 'PARENT',
    title: 'Parent / Guardian Portal',
    badge: 'Family Oversight',
    accent: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    icon: Users,
    summary:
      'Track ward internal test performance and daily attendance compliance across multiple wards, schedule PTM meetings with faculty, and submit leave intimations in advance.',
    functions: [
      'Multi-ward selector switching seamlessly between linked student profiles',
      'Real-time Ward Progress Card & Subject-wise Attendance breakdown',
      'Online / In-person Parent-Teacher Meeting (PTM) slot booking requests',
      'Direct Medical & Leave Intimation submission to faculty and admin',
      'Live status confirmation tracking for submitted PTM & leave requests'
    ]
  },
  {
    id: 'ADMIN',
    title: 'Administrator Portal',
    badge: 'Institutional Directorate',
    accent: 'text-violet-800 bg-violet-50 border-violet-200',
    icon: ShieldCheck,
    summary:
      'Oversee department-wide academic operations with full CRUD directories, parent–student account linking, consolidated class audit reports, and configurable policies.',
    functions: [
      'Full management directories for Students, Faculty, Parents, and Courses',
      'Parent–Student linkage mapping for authorized guardian portal access',
      'Institution-wide Class Reports, Excel upload audit trails & COE Results access',
      'Central Parent Communications oversight and PTM resolution controls',
      'System Configuration for attendance thresholds, academic sessions & UI themes'
    ]
  }
];

const CORE_CAPABILITIES = [
  {
    icon: FileSpreadsheet,
    title: 'Excel & CSV Bulk Marks Ingestion',
    description:
      'Staff can ingest batch IA1 & IA2 assessment spreadsheets with instant aggregate computation, peak subject scoring, and consolidated class reports.',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    icon: ClipboardCheck,
    title: 'Mandatory 75% Attendance Engine',
    description:
      'Calculates safe leaves remaining and consecutive classes needed to reach eligibility across CS subjects, highlighting shortages automatically.',
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200'
  },
  {
    icon: Calculator,
    title: 'Interactive Physics Simulators',
    description:
      'Real-time LiquidGauge Attendance & SGPA simulators allow students to drag liquid levels or slide lecture counts to preview academic outcomes.',
    color: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  {
    icon: FolderDown,
    title: 'Academic Resources & Study Locker',
    description:
      'Students access organized faculty lecture materials and store personal revision sheets inside an integrated resource repository.',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
  },
  {
    icon: FileText,
    title: 'Digital Progress Cards & COE Results',
    description:
      'Generates print-ready institutional Digital Progress Cards with faculty remarks alongside semester university result gazette views.',
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  {
    icon: MessageSquare,
    title: 'PTM Consultation & Absence Hub',
    description:
      'Connects Parents, Faculty, and Administrators through unified PTM appointment requests and medical/event leave approval workflows.',
    color: 'text-rose-700 bg-rose-50 border-rose-200'
  }
];

export const PublicPortal = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePortalId, setActivePortalId] = useState('STUDENT');

  // Sync persisted dark/light preference when landing unauthenticated on public portal
  useEffect(() => {
    const syncMode = () => {
      const activeMode = localStorage.getItem('pref_mode') || 'light';
      if (activeMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    syncMode();
    window.addEventListener('mode-changed', syncMode);
    window.addEventListener('storage', syncMode);
    return () => {
      window.removeEventListener('mode-changed', syncMode);
      window.removeEventListener('storage', syncMode);
    };
  }, []);

  const redirectByRole = (userRole) => {
    switch (userRole) {
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
        navigate('/login');
    }
  };

  const handlePortalLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);
      if (loggedUser?.role) {
        redirectByRole(loggedUser.role);
      }
    } catch {
      // Handled with toast inside AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleLogin = async (demoRole) => {
    const credentials = {
      ADMIN: { u: 'admin', p: 'admin123' },
      STAFF: { u: 'staff_sharma', p: 'staff123' },
      STUDENT: { u: 'student1', p: 'student123' },
      PARENT: { u: 'parent_patel', p: 'parent123' }
    };
    const cred = credentials[demoRole];
    if (!cred) return;
    playHapticChime();
    setIsLoading(true);
    try {
      const loggedUser = await login(cred.u, cred.p);
      redirectByRole(loggedUser?.role || demoRole);
    } catch {
      redirectByRole(demoRole);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPortal =
    PORTAL_MODULES.find((m) => m.id === activePortalId) || PORTAL_MODULES[0];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Top Public Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="Next Gen Grading" className="w-8 h-8 object-contain" />
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                Next Gen Grading
              </span>
              <span className="text-xs text-[#475569] dark:text-zinc-400 font-medium">
                Public Academic Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569] dark:text-zinc-300">
            <a href="#portals" className="hover:text-slate-950 dark:hover:text-white transition-colors">
              Role Portals
            </a>
            <a href="#features" className="hover:text-slate-950 dark:hover:text-white transition-colors">
              Core Functions
            </a>
            <a href="#workflow" className="hover:text-slate-950 dark:hover:text-white transition-colors">
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <ThemeToggleHoldButton size="sm" />
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => redirectByRole(role)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <span>Full Login Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section powered by KokonutUI Interactive DrapeBackground */}
      <DrapeBackground
        wind={0.95}
        pleat={34}
        interactive={true}
        className="min-h-[640px] lg:min-h-[700px] border-b border-zinc-200 dark:border-zinc-800"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Intro & Project Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 shadow-xs pointer-events-auto">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Next Gen Grading • Academic Assistance &amp; Assessment System</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  Transparent Grading, Attendance &amp; Campus Collaboration.
                </h1>
                <p className="text-base sm:text-lg text-[#334155] dark:text-zinc-300 leading-relaxed max-w-[62ch]">
                  Explore all modules before signing in. Built for Administrators, Faculty, Students, and Parents with live IA analytics, 75% eligibility tracking, digital progress cards, and PTM workflows.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
                <a
                  href="#portals"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
                >
                  <span>Read Project Features</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  <span>Go to Login Screen</span>
                </Link>
              </div>

              <p className="text-xs font-medium text-[#475569] dark:text-zinc-400">
                Tip: Sweep your cursor across the curtain or drag any fold behind this section.
              </p>
            </div>

            {/* Direct Public Portal Sign-In Card */}
            <div className="lg:col-span-5 pointer-events-auto">
              <div className="rounded-[28px] bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
                      Portal Sign In
                    </h2>
                    <p className="text-xs text-[#475569] dark:text-zinc-400 mt-1">
                      Login directly from the public portal or use instant demo roles.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>

                <form onSubmit={handlePortalLogin} className="space-y-3.5">
                  <div>
                    <label htmlFor="portal-username" className="text-xs font-semibold text-[#475569] dark:text-zinc-300 block mb-1">
                      Username or Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="portal-username"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. student1, staff_sharma, admin"
                        autoComplete="username"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="portal-password" className="text-xs font-semibold text-[#475569] dark:text-zinc-300 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="portal-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                  </button>
                </form>

                {/* Instant Role Demo Access */}
                <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#475569] dark:text-zinc-400 block">
                    Quick Demo Role Sign-In
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'STUDENT', label: 'Student' },
                      { key: 'STAFF', label: 'Staff' },
                      { key: 'PARENT', label: 'Parent' },
                      { key: 'ADMIN', label: 'Admin' }
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleQuickRoleLogin(btn.key)}
                        className="px-2.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrapeBackground>

      {/* Section 1: Role-Based Portals Explorer */}
      <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="space-y-2 max-w-[70ch]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#B45309] dark:text-amber-400 block">
            4 Dedicated Workspaces
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
            Role Portals &amp; Functional Modules
          </h2>
          <p className="text-sm sm:text-base text-[#475569] dark:text-zinc-400 leading-relaxed">
            Every stakeholder receives tailored dashboards, permission-guarded routes, and specialized academic workflows. Select any portal tab below to inspect its built-in functions.
          </p>
        </div>

        {/* Interactive Portal Selector Pills */}
        <div className="flex flex-wrap gap-2.5">
          {PORTAL_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isSelected = activePortalId === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  playHapticChime();
                  setActivePortalId(mod.id);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs'
                    : 'bg-white text-slate-700 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mod.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Portal Detailed Spotlight Card */}
        <div className="rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${selectedPortal.accent}`}>
              {selectedPortal.badge}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-[1.3]">
              {selectedPortal.title}
            </h3>
            <p className="text-sm sm:text-base text-[#475569] dark:text-zinc-300 leading-relaxed max-w-[60ch]">
              {selectedPortal.summary}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin(selectedPortal.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Preview {selectedPortal.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#475569] dark:text-zinc-400 block">
              Key Functions Included
            </span>
            <ul className="space-y-2.5">
              {selectedPortal.functions.map((fn, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 text-sm text-slate-800 dark:text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{fn}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Core System Functions Grid */}
      <section id="features" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-[70ch]">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#B45309] dark:text-amber-400 block">
              System Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
              Core Features &amp; Project Functions
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-zinc-400 leading-relaxed">
              Designed for accuracy, instant feedback, and transparent communication between departments and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_CAPABILITIES.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-6 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${cap.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-[1.3]">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-[#475569] dark:text-zinc-400 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Academic Workflow */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="space-y-2 max-w-[70ch]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#B45309] dark:text-amber-400 block">
            End-to-End Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
            How Next Gen Grading Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Configure & Enroll',
              text: 'Administrators manage students, faculty, courses, and parent–ward linkages across semesters and sections.'
            },
            {
              step: '02',
              title: 'Ingest IA Marks & Attendance',
              text: 'Faculty upload IA1 & IA2 Excel spreadsheets, log lecture attendance, and flag students falling under 75% compliance.'
            },
            {
              step: '03',
              title: 'Simulate, Review & Connect',
              text: 'Students and Parents inspect progress cards, forecast SGPA and safe leaves with LiquidGauge, access notes, and schedule PTMs.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3 shadow-2xs"
            >
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-zinc-100 dark:text-slate-950 inline-block">
                STEP {item.step}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-[#475569] dark:text-zinc-400 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475569] dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Next Gen Grading" className="w-6 h-6 object-contain" />
            <span className="font-bold text-slate-900 dark:text-white">Next Gen Grading</span>
            <span>• Institutional Academic Assistance Platform</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <a href="#portals" className="hover:text-slate-900 dark:hover:text-white">
              Portals
            </a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white">
              Features
            </a>
            <Link to="/login" className="text-slate-900 dark:text-white hover:underline">
              Sign In →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortal;
