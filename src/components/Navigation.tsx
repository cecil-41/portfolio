import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { EASE_OUT, useReducedMotion } from './ui';
import profile from '../data/profile.json';
import { scrollToElement } from '../utils/scroll';

const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Qualifications', href: '#qualifications' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const scrollToSelector = (href: string) => scrollToElement(document.querySelector(href));

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggleTheme } = useTheme();
  const reduced = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  const isBlogPostPage = location.pathname.startsWith('/blog/');
  const isBlogListPage = location.pathname === '/blog';
  const onBlogRoute = isBlogPostPage || isBlogListPage;
  const currentSection = onBlogRoute ? 'blog' : activeSection;

  // Track the active section from scroll position. On blog routes "blog" is pinned (derived below).
  useEffect(() => {
    if (onBlogRoute) return;

    // The active section is the last one whose top has passed a line 35% down the viewport.
    // Derived from scroll position (not IntersectionObserver) so tall sections like Experience
    // stay active when scrolling back up into them.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = NAV_ITEMS[0].href.slice(1);
      for (const item of NAV_ITEMS) {
        const element = document.querySelector(item.href);
        if (element && element.getBoundingClientRect().top <= line) current = item.href.slice(1);
      }
      // At the very bottom the last section may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = NAV_ITEMS[NAV_ITEMS.length - 1].href.slice(1);
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onBlogRoute]);

  // While the mobile menu is open: Escape closes it, the page behind can't scroll, and
  // growing to the desktop layout (where the menu is hidden) closes it too.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => desktop.matches && setIsOpen(false);

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (onBlogRoute) {
      // Go home first, then scroll once the homepage has rendered.
      navigate('/');
      setTimeout(() => scrollToSelector(href), 300);
    } else {
      setTimeout(() => scrollToSelector(href), 100);
    }
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    if (onBlogRoute) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const iconButton =
    'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line ' +
    'bg-surface/60 text-muted hover:border-muted hover:text-fg';

  return (
    <motion.nav
      aria-label="Primary"
      initial={reduced ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="fixed top-0 z-50 w-full border-b border-line bg-bg/70 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto max-w-7xl pr-[max(1.25rem,env(safe-area-inset-right))] pl-[max(1.25rem,env(safe-area-inset-left))] sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:gap-6">
          {/* Monogram + name */}
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label={`${profile.name}, back to top`}
            className="group flex min-h-11 min-w-0 cursor-pointer items-center gap-3"
          >
            {/* Decorative monogram; hidden so the accessible name starts with the visible name. */}
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface font-mono text-[0.8rem] font-medium tracking-tight text-fg group-hover:border-accent/60"
            >
              CS
            </span>
            <span className="truncate font-display text-lg font-semibold tracking-display text-fg">
              {profile.name}
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = currentSection === item.href.substring(1);
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative cursor-pointer py-2 text-sm font-medium ${
                      isActive ? 'text-fg' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                        transition={
                          reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                        }
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Light theme' : 'Dark theme'}
              className={iconButton}
            >
              {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className={`${iconButton} lg:hidden`}
            >
              {isOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: a sheet filling the screen below the bar. Links sit at the bottom,
          within thumb reach; the page behind is scroll-locked while it's open.
          (The nav is the containing block here because of its backdrop-filter, so the
          sheet is absolute + explicit height rather than fixed.) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0.01 : 0.25, ease: EASE_OUT }}
            className="absolute inset-x-0 top-full flex h-[calc(100dvh-4rem-env(safe-area-inset-top))] flex-col overflow-y-auto overscroll-contain border-t border-line bg-bg lg:hidden"
          >
            <div className="mx-auto mt-auto w-full max-w-7xl pt-10 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] sm:px-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Navigate</p>
              <ul className="border-t border-line/60">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = currentSection === item.href.substring(1);
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.href)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`flex min-h-14 w-full cursor-pointer items-center gap-4 border-b border-line/60 py-3 text-left ${
                          isActive ? 'text-fg' : 'text-muted hover:text-fg'
                        }`}
                      >
                        <span className="w-6 font-mono text-xs text-muted">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-2xl tracking-display">{item.name}</span>
                        {isActive && (
                          <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
