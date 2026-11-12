import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DrapeBackground from '../../components/ui/DrapeBackground';
import Carousel3D from '../../components/ui/Carousel3D';
import PublicNavbar from '../../components/common/PublicNavbar';
import {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  ClipboardCheck,
  FileSpreadsheet,
  FolderDown,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Calculator
} from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

const HERO_CAROUSEL_SLIDES = [
  {
    id: 'student',
    image: '/profile-student.png',
    alt: 'Student role card — Ayaan Khan',
    badge: 'Student Suite',
    title: 'Student Portal & LiquidGauge Analytics',
    subtitle: 'Track live IA marks, 75% eligibility buffers & digital ID cards'
  },
  {
    id: 'staff',
    image: '/profile-staff.png',
    alt: 'Faculty role card — Arjun Menon',
    badge: 'Faculty & Grading',
    title: 'Faculty Assessment & Excel Batch Upload',
    subtitle: 'Upload IA spreadsheets, mark sessions & share study materials'
  },
  {
    id: 'admin',
    image: '/profile-admin.png',
    alt: 'Administrator role card — Meera Nair',
    badge: 'Campus Control',
    title: 'Institutional Oversight & Timetables',
    subtitle: 'Publish exam rules, verify results & oversee campus broadcasts'
  }
];

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
    <div
      id="home"
      className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-200 scroll-smooth"
    >
      {/* Top Capsule Navigation Header matching worker public portal design */}
      <PublicNavbar
        isAuthenticated={isAuthenticated}
        onOpenDashboard={() => redirectByRole(role)}
      />

      {/* Hero Section powered by KokonutUI Interactive DrapeBackground */}
      <DrapeBackground
        wind={0.95}
        pleat={34}
        interactive={true}
        className="min-h-[600px] lg:min-h-[660px] border-b border-zinc-200 dark:border-zinc-800"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Side: Hero Copy, Actions & Institutional Stats */}
            <div className="lg:col-span-6 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 shadow-xs pointer-events-auto">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Learn From Today • Academic Department Assistance</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  The Best Way For{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Your Learning
                  </span>{' '}
                  &amp; Grading.
                </h1>
                <p className="text-base sm:text-lg text-[#334155] dark:text-zinc-300 leading-relaxed max-w-[56ch] mx-auto lg:mx-0">
                  Our academic department assistance system delivers automated grading, batch Excel IA marks ingestion, mandatory 75% attendance tracking, and digital progress cards for students, faculty, and parents.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pointer-events-auto">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-[0_8px_20px_-6px_rgba(245,158,11,0.55)] transition-all"
                >
                  <span>Explore Portals</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-zinc-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  <span>Read Project Features</span>
                </a>
              </div>

              {/* Public Portal Key Stats Bar */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 px-5 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs pointer-events-auto w-full max-w-md">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
                    10+
                  </p>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                    Institutions
                  </p>
                </div>
                <div className="border-x border-zinc-200 dark:border-white/10 px-3">
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
                    500+
                  </p>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                    Students Managed
                  </p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
                    100%
                  </p>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                    Automated PTM
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-[#475569] dark:text-zinc-400">
                Tip: Sweep your cursor across the curtain or drag any fold behind this section.
              </p>
            </div>

            {/* Right Side: Interactive 3D Carousel */}
            <div className="lg:col-span-6 w-full flex items-center justify-center pointer-events-auto">
              <Carousel3D slides={HERO_CAROUSEL_SLIDES} />
            </div>
          </div>
        </div>
      </DrapeBackground>

      {/* Section 1 (#about & #portals): Platform Capabilities & Role-Based Portals Explorer */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 scroll-mt-20">
        <div id="portals" className="space-y-2 max-w-[70ch]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#B45309] dark:text-amber-400 block">
            Platform Capabilities • 4 Dedicated Workspaces
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
            Built for Effortless Academic Excellence
          </h2>
          <p className="text-sm sm:text-base text-[#475569] dark:text-zinc-400 leading-relaxed">
            Empowering administrators, faculty, students, and parents with seamless role-tailored portals, batch Excel schema validation, real-time attendance analytics, and automated digital progress cards.
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
      <section id="features" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-[70ch]">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#B45309] dark:text-amber-400 block">
              System Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
              Core Features &amp; Project Functions
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-zinc-400 leading-relaxed">
              High-throughput Excel ingestion, automated 75% attendance compliance audits, interactive physics simulators, and PTM-ready digital progress cards.
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

      {/* Section 3: Workflow Pipeline (#how-it-works) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 scroll-mt-20">
        <div className="space-y-2 max-w-[70ch]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#B45309] dark:text-amber-400 block">
            End-to-End Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3]">
            How Next Gen Grading Works
          </h2>
          <p className="text-sm sm:text-base text-[#475569] dark:text-zinc-400 leading-relaxed">
            Three streamlined steps from spreadsheet assessment ingestion to verified attendance statistics and digital progress cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01 / INGESTION',
              title: 'Upload Assessment Marks',
              text: 'Faculty download pre-populated Excel templates with department course codes and upload IA1 & IA2 marks with automated row validation.',
              metric: 'Zero database commit errors on parse'
            },
            {
              step: '02 / ANALYTICS',
              title: 'Compute Attendance & Stats',
              text: 'The engine automatically calculates attendance percentages from stored session registers, LiquidGauge projections, and flags shortage cases.',
              metric: 'Real-time 75% threshold audit'
            },
            {
              step: '03 / PUBLISH',
              title: 'Generate Progress Cards',
              text: 'Official digital progress cards with institutional summaries are ready for instant student review, parent access, and PTM consultations.',
              metric: 'Instant portal sync & printable cards'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-zinc-100 dark:text-slate-950 inline-block">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-[#475569] dark:text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
              <p className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800 text-xs font-semibold text-amber-700 dark:text-amber-400">
                {item.metric}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA & Contact (#contact) */}
      <footer id="contact" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#475569] dark:text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Next Gen Grading" className="w-6 h-6 object-contain" />
              <span className="font-bold text-slate-900 dark:text-white">
                Next Gen Grading • Academic Department Assistance
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>© 2026 Next Gen Grading. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold">
            <a href="#home" className="hover:text-slate-900 dark:hover:text-white">
              Home
            </a>
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white">
              About
            </a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">
              How It Works
            </a>
            <Link to="/login" className="text-teal-700 dark:text-teal-400 hover:underline">
              Portal Login →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortal;
