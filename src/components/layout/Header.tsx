type Props = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onDownloadResume: () => void
}

export default function Header({ theme, onToggleTheme, onDownloadResume }: Props) {
  return (
    <div className="head">
      <div className="head__left">
        <span className="mono">Kavya Mittal</span>
        <span className="mono k">/ Portfolio · 2026</span>
      </div>
      <div className="head__right">
        <a
          className="pill"
          href="https://www.linkedin.com/in/kavyamittal-dev/"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
        >
          LinkedIn ↗
        </a>
        <a
          className="pill"
          href="https://github.com/kavyamittal28"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
        >
          GitHub ↗
        </a>
        <button type="button" className="pill pill--dot" onClick={onToggleTheme}>
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
        <a className="pill" href="#contact">
          Email
        </a>
        <button type="button" className="pill pill--solid" onClick={onDownloadResume}>
          ↓ Resume
        </button>
      </div>
    </div>
  )
}
