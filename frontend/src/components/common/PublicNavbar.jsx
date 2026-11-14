import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, Moon, Sun } from 'lucide-react';
import { getStoredMode, toggleColorMode } from '../../utils/theme';
import { playHapticChime } from '../../utils/sound';

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

/**
 * Top navigation bar matching the capsule pill slider design with theme switch and teal login button.
 */
export const PublicNavbar = React.memo(function PublicNavbar({
  isAuthenticated = false,
  onOpenDashboard
}) {
  const [activeNav, setActiveNav] = useState('home');
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mode, setMode] = useState(() => getStoredMode());
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, ready: false });

  const capsuleRef = useRef(null);
  const itemRefs = useRef({});

  const targetNav = hoveredNav || activeNav;

  const updatePillPosition = useCallback((navId) => {
    const capsuleEl = capsuleRef.current;
    const itemEl = itemRefs.current[navId];
    if (!capsuleEl || !itemEl) return;
    setPillStyle({
      left: itemEl.offsetLeft,
      width: itemEl.offsetWidth,
      ready: true
    });
  }, []);

  useLayoutEffect(() => {
    updatePillPosition(targetNav);
  }, [targetNav, updatePillPosition]);

  useEffect(() => {
    const onResize = () => updatePillPosition(targetNav);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [targetNav, updatePillPosition]);

  // Sync theme pill label & icon whenever mode changes elsewhere
  useEffect(() => {
    const syncMode = () => setMode(getStoredMode());
    window.addEventListener('mode-changed', syncMode);
    window.addEventListener('theme-changed', syncMode);
    window.addEventListener('storage', syncMode);
    return () => {
      window.removeEventListener('mode-changed', syncMode);
      window.removeEventListener('theme-changed', syncMode);
      window.removeEventListener('storage', syncMode);
    };
  }, []);

  // Track active section while scrolling
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sectionIds = NAV_LINKS.map((n) => n.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0 && visible[0].target?.id) {
          setActiveNav(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleToggleTheme = () => {
    const next = toggleColorMode();
    playHapticChime();
    setMode(next);
  };

  const handleNavClick = (id) => {
    setActiveNav(id);
    setHoveredNav(null);
  };

  const isDark = mode === 'dark';

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-[#181920]/85 backdrop-blur-md transition-colors duration-200 pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="Next Gen Grading" className="w-7 h-7 object-contain" />
          <span className="text-lg sm:text-[20px] font-bold tracking-tight leading-none text-slate-900 dark:text-white">
            Next Gen{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Grading
            </span>
          </span>
        </Link>

        {/* Center: Desktop Glass Capsule Navigation with Sliding Pill */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center"
          onMouseLeave={() => setHoveredNav(null)}
        >
          <div
            ref={capsuleRef}
            className="relative flex items-center p-1 rounded-full border border-zinc-200 dark:border-white/12 bg-zinc-100/90 dark:bg-slate-900/85 shadow-xs"
          >
            {/* Sliding Amber Pill Indicator */}
            <div
              aria-hidden="true"
              style={{
                transform: `translate3d(${pillStyle.left}px, 0, 0)`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.ready ? 1 : 0
              }}
              className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_16px_rgba(245,158,11,0.45)] transition-[transform,width,opacity] duration-300 ease-out"
            />

            {NAV_LINKS.map((item) => {
              const isHighlighted = targetNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors duration-200 whitespace-nowrap ${
                    isHighlighted
                      ? 'text-white'
                      : 'text-slate-700 hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Right: Theme Switcher Pill & Teal Login Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title="Switch Theme"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/15 bg-zinc-100 dark:bg-slate-800/90 text-slate-800 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-200/80 dark:hover:bg-slate-700/90 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white text-xs sm:text-[13px] font-bold shadow-[0_6px_16px_-4px_rgba(13,148,136,0.5)] transition-all cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white text-xs sm:text-[13px] font-bold shadow-[0_6px_16px_-4px_rgba(13,148,136,0.5)] transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Scrollable Quick Nav Pills (< lg) */}
      <div className="lg:hidden border-t border-zinc-200/60 dark:border-white/10 px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 w-max">
          {NAV_LINKS.map((item) => {
            const isCurrent = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-slate-800/80 text-slate-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
});

export default PublicNavbar;
