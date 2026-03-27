import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light';

interface AppContextValue {
  theme: Theme;
  soundEnabled: boolean;
  booted: boolean;
  toggleTheme: () => void;
  toggleSound: () => void;
  setBooted: (b: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('kavya-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark';
}

function readSound(): boolean {
  try {
    const stored = localStorage.getItem('kavya-sound');
    if (stored !== null) return stored === 'true';
  } catch {}
  return true;
}

function readBooted(): boolean {
  try {
    return sessionStorage.getItem('kavya_os_booted') === 'true';
  } catch {}
  return false;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(readSound);
  const [booted, setBootedState] = useState<boolean>(readBooted);

  useEffect(() => {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${theme}-theme`);
    try {
      localStorage.setItem('kavya-theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('kavya-sound', String(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    try {
      sessionStorage.setItem('kavya_os_booted', String(booted));
    } catch {}
  }, [booted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const setBooted = useCallback((b: boolean) => {
    setBootedState(b);
  }, []);

  return (
    <AppContext.Provider
      value={{ theme, soundEnabled, booted, toggleTheme, toggleSound, setBooted }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
