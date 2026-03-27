import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import siteData from '@/data/site.json';

const NAV_LINKS = siteData.navLinks;

function getISTTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utc + 5.5 * 60 * 60_000);
}

function formatISTClock(ist: Date): string {
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const seconds = ist.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${h}:${mm}:${ss} ${ampm} IST`;
}

function isOnline(ist: Date): boolean {
  const day = ist.getDay();
  const hour = ist.getHours();
  // Mon-Fri (1-5), 9 AM - 7 PM IST
  return day >= 1 && day <= 5 && hour >= 9 && hour < 19;
}

export default function Navbar() {
  const { theme, soundEnabled, toggleTheme, toggleSound } = useApp();
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [istTime, setIstTime] = useState(getISTTime);

  // IST clock tick
  useEffect(() => {
    const id = setInterval(() => setIstTime(getISTTime()), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll tracking: scrolled state + active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map((l: { href: string }) => l.href.slice(1));
      let current = sections[0];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = sectionId;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
    },
    [],
  );

  const online = isOnline(istTime);

  return (
    <nav className={`glass-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <a
          className="logo"
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
        >
          K<span>.</span>M
        </a>

        {/* Desktop nav links */}
        <ul className="nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={activeSection === href.slice(1) ? 'active' : ''}
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.ul
              className="nav-links active"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={
                      activeSection === href.slice(1) ? 'active' : ''
                    }
                    onClick={(e) => handleNavClick(e, href)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="nav-actions">
          <div className="ist-clock">
            <span className={`status-dot ${online ? 'online' : 'offline'}`} />
            <span className="clock-time">{formatISTClock(istTime)}</span>
            <span className="status-text">
              {online ? 'Online' : 'Offline'}
            </span>
          </div>

          <button
            className="glass-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="glass-icon"
            onClick={toggleSound}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 size={18} />
            ) : (
              <VolumeX size={18} />
            )}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
