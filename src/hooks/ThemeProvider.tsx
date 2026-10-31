import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, THEME_COLOR, THEME_STORAGE_KEY, getInitialIsDark } from './useTheme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(getInitialIsDark);

  // Keep the DOM (class + browser chrome colour) in sync with state.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    // index.html ships a light/dark media pair; the chosen theme overrides both.
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', isDark ? THEME_COLOR.dark : THEME_COLOR.light));
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      } catch {
        // Storage unavailable (private mode etc.); theme still applies for this session.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
