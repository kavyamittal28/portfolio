import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  User,
  Briefcase,
  Wrench,
  FolderOpen,
  BookOpen,
  Mail,
  Sun,
  Volume2,
  Download,
  Terminal,
  Bot,
  Keyboard,
  Code2,
  Cloud,
  Container,
  Atom,
  Rocket,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Category = 'Navigation' | 'Action' | 'Skill' | 'Project';

interface CommandItem {
  id: string;
  label: string;
  category: Category;
  icon: LucideIcon;
  action: () => void;
}

interface CmdPaletteProps {
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onStartTour: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function scrollTo(selector: string): void {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function focusTerminal(): void {
  const el = document.getElementById('terminal');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Attempt to focus the terminal input if present
    setTimeout(() => {
      const input = el.querySelector<HTMLInputElement>('input');
      input?.focus();
    }, 400);
  }
}

function downloadResume(): void {
  const link = document.createElement('a');
  link.href = '/src/assets/pdf/KAVYA_MITTAL.pdf';
  link.download = 'Kavya_Mittal_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Simple fuzzy match: every character in the query appears in order within the text. */
function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let j = 0;
  for (let i = 0; i < lower.length && j < q.length; i++) {
    if (lower[i] === q[j]) {
      j++;
    }
  }
  return j === q.length;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function CmdPalette({
  onToggleTheme,
  onToggleSound,
  onStartTour,
}: CmdPaletteProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build the command items (stable references via useMemo)
  const items: CommandItem[] = useMemo(() => {
    const close = () => setVisible(false);

    const nav = (selector: string) => () => {
      scrollTo(selector);
      close();
    };

    return [
      // Navigation
      { id: 'nav-home', label: 'Home', category: 'Navigation', icon: Home, action: nav('#home') },
      { id: 'nav-about', label: 'About', category: 'Navigation', icon: User, action: nav('#about') },
      { id: 'nav-experience', label: 'Experience', category: 'Navigation', icon: Briefcase, action: nav('#experience') },
      { id: 'nav-skills', label: 'Skills', category: 'Navigation', icon: Wrench, action: nav('#skills') },
      { id: 'nav-projects', label: 'Projects', category: 'Navigation', icon: FolderOpen, action: nav('#projects') },
      { id: 'nav-blog', label: 'Blog', category: 'Navigation', icon: BookOpen, action: nav('#blog') },
      { id: 'nav-contact', label: 'Contact', category: 'Navigation', icon: Mail, action: nav('#contact') },

      // Actions
      {
        id: 'act-theme',
        label: 'Toggle Theme',
        category: 'Action',
        icon: Sun,
        action: () => { onToggleTheme(); close(); },
      },
      {
        id: 'act-sound',
        label: 'Toggle Sound',
        category: 'Action',
        icon: Volume2,
        action: () => { onToggleSound(); close(); },
      },
      {
        id: 'act-resume',
        label: 'Download Resume',
        category: 'Action',
        icon: Download,
        action: () => { downloadResume(); close(); },
      },
      {
        id: 'act-terminal',
        label: 'Focus Terminal',
        category: 'Action',
        icon: Terminal,
        action: () => { focusTerminal(); close(); },
      },
      {
        id: 'act-tour',
        label: 'Start Tour',
        category: 'Action',
        icon: Bot,
        action: () => { onStartTour(); close(); },
      },
      {
        id: 'act-shortcuts',
        label: 'Keyboard Shortcuts',
        category: 'Action',
        icon: Keyboard,
        action: () => {
          // Scroll to a shortcuts section if it exists, otherwise just close
          const el = document.getElementById('keyboard-shortcuts');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          close();
        },
      },

      // Skills
      { id: 'skill-python', label: 'Python', category: 'Skill', icon: Code2, action: nav('#skills') },
      { id: 'skill-flask', label: 'Flask', category: 'Skill', icon: Code2, action: nav('#skills') },
      { id: 'skill-aws', label: 'AWS', category: 'Skill', icon: Cloud, action: nav('#skills') },
      { id: 'skill-docker', label: 'Docker', category: 'Skill', icon: Container, action: nav('#skills') },
      { id: 'skill-react', label: 'React', category: 'Skill', icon: Atom, action: nav('#skills') },

      // Projects
      {
        id: 'proj-scai',
        label: 'SCAI Project',
        category: 'Project',
        icon: Rocket,
        action: () => { scrollTo('#projects'); close(); },
      },
      {
        id: 'proj-saleslens',
        label: 'SalesLens Project',
        category: 'Project',
        icon: BarChart3,
        action: () => { scrollTo('#projects'); close(); },
      },
    ];
  }, [onToggleTheme, onToggleSound, onStartTour]);

  // Filtered items based on fuzzy search across label + category
  const filteredItems = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter(
      (item) => fuzzyMatch(item.label, q) || fuzzyMatch(item.category, q),
    );
  }, [items, query]);

  // Clamp selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  // Open / close helpers
  const open = useCallback(() => {
    setVisible(true);
    setQuery('');
    setSelectedIndex(0);
    // Focus the input after the overlay renders
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (visible) {
          close();
        } else {
          open();
        }
      }

      if (e.key === 'Escape' && visible) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, open, close]);

  // Keyboard navigation within the palette
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) {
          item.action();
        }
      }
    },
    [filteredItems, selectedIndex],
  );

  // Scroll selected item into view within the results container
  useEffect(() => {
    if (!resultsRef.current) return;
    const selected = resultsRef.current.children[selectedIndex] as HTMLElement | undefined;
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close],
  );

  return (
    <div
      className={`command-palette${visible ? ' visible' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="cmd-palette-content glass-card">
        <div className="cmd-palette-search">
          <input
            ref={inputRef}
            className="cmd-palette-input"
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="Search commands"
          />
        </div>

        <div className="cmd-palette-results" ref={resultsRef}>
          {filteredItems.length === 0 && (
            <div className="cmd-palette-empty">No matching commands.</div>
          )}
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`cmd-palette-item${index === selectedIndex ? ' selected' : ''}`}
                onClick={() => item.action()}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="cmd-icon">
                  <Icon size={18} />
                </div>
                <span className="cmd-label">{item.label}</span>
                <span className="cmd-badge">{item.category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
