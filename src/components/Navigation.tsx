import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Qualifications', href: '#qualifications' },
    { name: 'Projects', href: '#projects' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const isBlogPostPage = location.pathname.startsWith('/blog/');
  const isBlogListPage = location.pathname === '/blog';

  // Track active section based on scroll position
  useEffect(() => {
    // Set active section based on current route
    if (isBlogListPage || isBlogPostPage) {
      setActiveSection('blog');
      return;
    }

    // Skip observation on blog pages
    if (isBlogPostPage || isBlogListPage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlogPostPage, isBlogListPage]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    // If we're on a blog page, navigate to home first
    if (isBlogPostPage || isBlogListPage) {
      navigate('/');
      // Wait for navigation and then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      // Regular scroll behavior
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleLogoClick = () => {
    if (isBlogPostPage || isBlogListPage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-white/85 dark:bg-deep-950/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-purple-900/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer"
          >
            <div className="relative w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow">
              <span className="font-bold text-white font-display">C</span>
            </div>
            <span className="ml-2 font-bold text-2xl font-display bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Cecil
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer transition-colors font-semibold relative ${
                    isActive
                      ? 'text-purple-500 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="cursor-pointer p-2 rounded-xl bg-slate-100/80 dark:bg-deep-700/80 border border-slate-200/60 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400/30 transition-all duration-200"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer md:hidden p-2 rounded-xl bg-slate-100/80 dark:bg-deep-700/80 border border-slate-200/60 dark:border-purple-900/30"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white/95 dark:bg-deep-950/95 backdrop-blur-xl border-t border-slate-200/60 dark:border-purple-900/30"
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                whileHover={{ x: 4 }}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-500 dark:hover:text-purple-400'
                }`}
              >
                {item.name}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
