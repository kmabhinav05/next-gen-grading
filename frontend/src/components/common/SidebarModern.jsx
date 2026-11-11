import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  FileText,
  ClipboardCheck,
  FolderDown,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  GraduationCap,
  Users,
  Award,
  Link as LinkIcon,
  Upload,
  X
} from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

export const SidebarModern = ({ isOpen = false, onClose = () => {} }) => {
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items customized per role while matching the visual layout of the reference
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/subjects', label: 'My Courses', icon: BookOpen },
          { to: '/admin/reports', label: 'Class Reports', icon: FileSpreadsheet, badge: 2 },
          { to: '/admin/students', label: 'Students', icon: GraduationCap },
          { to: '/admin/staff', label: 'Faculty Directory', icon: Users },
          { to: '/admin/parents', label: 'Parents Roster', icon: Users },
          { to: '/admin/parent-student', label: 'Linkages', icon: LinkIcon },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];
      case 'STAFF':
        return [
          { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/staff/upload-marks', label: 'Upload Marks', icon: Upload, badge: 'IA2' },
          { to: '/staff/attendance', label: 'Attendance', icon: ClipboardCheck },
          { to: '/staff/class-report', label: 'Class Reports', icon: FileSpreadsheet },
          { to: '/profile', label: 'Faculty ID', icon: Award },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];
      case 'STUDENT':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/resources', label: 'Resources & Notes', icon: FolderDown, badge: 'New' },
          { to: '/student/progress-card', label: 'Progress Card', icon: FileText },
          { to: '/student/attendance', label: 'Attendance', icon: ClipboardCheck },
          { to: '/profile', label: 'Digital 3D ID', icon: Award },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];
      case 'PARENT':
        return [
          { to: '/parent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/parent/progress-card', label: 'Ward Progress', icon: FileText },
          { to: '/parent/attendance', label: 'Attendance', icon: ClipboardCheck },
          { to: '/profile', label: 'Guardian Info', icon: Award },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  const handleHelpClick = () => {
    playHapticChime();
    if (role === 'STUDENT') {
      window.dispatchEvent(new CustomEvent('open-chatbot'));
    } else {
      navigate('/settings');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-6 px-4">
      <div className="space-y-7">
        {/* Brand Header matching reference logo */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-[#FEDC56] flex items-center justify-center shadow-xs shrink-0 font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M20 4L8.12 15.88" />
                <circle cx="18" cy="9" r="2" />
                <circle cx="18" cy="15" r="2" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-tight uppercase">
                Next Gen
              </h1>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                Academy
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isMatch =
              location.pathname === item.to ||
              (item.to !== '/' && item.to !== '/admin/dashboard' && item.to !== '/staff/dashboard' && item.to !== '/student/dashboard' && item.to !== '/parent/dashboard' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  playHapticChime();
                  onClose();
                }}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isMatch
                    ? 'bg-[#FEDC56] text-slate-950 font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {/* Active Left Indicator Notch matching the reference design */}
                {isMatch && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-slate-950 rounded-r-full" />
                )}

                <div className="flex items-center gap-3.5">
                  <item.icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isMatch ? 'text-slate-950 stroke-[2.4]' : 'text-[#64748B] stroke-[1.8]'
                    }`}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isMatch
                        ? 'bg-slate-950 text-[#FEDC56]'
                        : typeof item.badge === 'number'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Help Center Widget - Matching Reference Image */}
      <div className="mt-8 pt-4">
        <div className="relative rounded-[26px] bg-[#19192B] text-white p-4.5 pt-7 text-center shadow-lg">
          {/* Floating Yellow Circle with ? icon */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FEDC56] text-slate-950 font-black text-base flex items-center justify-center shadow-md ring-4 ring-white">
            ?
          </div>

          <h3 className="text-xs font-bold text-white tracking-tight">Help center</h3>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Have a problem?<br />Send us a message!
          </p>

          <button
            type="button"
            onClick={handleHelpClick}
            className="mt-3.5 w-full py-2 px-3 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            Go to help center
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Column) */}
      <aside className="w-[220px] xl:w-[230px] shrink-0 hidden lg:block bg-white rounded-[32px] border border-slate-100 shadow-xs">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Drawer content */}
          <aside className="fixed inset-y-0 left-0 w-[270px] max-w-[85vw] bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default SidebarModern;
