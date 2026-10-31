import { createContext, useContext } from 'react';

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const THEME_STORAGE_KEY = 'theme';
export const THEME_COLOR = { dark: '#07090F', light: '#F7F8FA' } as const;

/**
 * Mirrors the inline script in index.html: dark unless the user explicitly chose light.
 * The script has already set the `.dark` class before paint, so trust the DOM first.
 */
export const getInitialIsDark = (): boolean => {
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark');
  }
  return true;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
