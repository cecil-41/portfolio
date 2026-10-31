import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { EASE_OUT, useReducedMotion } from './ui';
import profile from '../data/profile.json';

const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Qualifications', href: '#qualifications' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const scrollToSelector = (href: string) => {
  const element = document.querySelector(href);
  if (!element) return;
  const offset = 80;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

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

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line ' +
    'bg-surface/60 text-muted hover:border-muted hover:text-fg';

  return (
    <motion.nav
      aria-label="Primary"
      initial={reduced ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="fixed top-0 z-50 w-full border-b border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Monogram + name */}
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label={`${profile.name}, back to top`}
            className="group flex cursor-pointer items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface font-mono text-[0.8rem] font-medium tracking-tight text-fg group-hover:border-accent/60">
              CS
            </span>
            <span className="font-display text-lg font-semibold tracking-display text-fg">
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

          <div className="flex items-center gap-2">
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

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.3, ease: EASE_OUT }}
            className="overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
              {NAV_ITEMS.map((item, i) => {
                const isActive = currentSection === item.href.substring(1);
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.href)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`flex w-full cursor-pointer items-center gap-4 border-b border-line/60 py-3.5 text-left last:border-b-0 ${
                        isActive ? 'text-fg' : 'text-muted hover:text-fg'
                      }`}
                    >
                      <span className="w-6 font-mono text-xs text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-lg tracking-display">{item.name}</span>
                      {isActive && (
                        <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
