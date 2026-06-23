import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeVariant = 'healing' | 'dawn' | 'tech';
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  variant: ThemeVariant;
  mode: ThemeMode;
  setVariant: (variant: ThemeVariant) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  
  // Auto-set variant based on mode
  const variant: ThemeVariant = mode === 'light' ? 'healing' : 'tech';

  useEffect(() => {
    // Load from localStorage
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme-mode', mode);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme-variant', variant);
    document.documentElement.setAttribute('data-theme-mode', mode);
    
    // Apply dark class to html for Tailwind dark mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [variant, mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const setVariant = (newVariant: ThemeVariant) => {
    // When manually setting variant, also update mode
    if (newVariant === 'healing') {
      setMode('light');
    } else {
      setMode('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ variant, mode, setVariant, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
