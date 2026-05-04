import { useISTClock } from '@/hooks/useISTClock'
import { useActiveSection } from '@/hooks/useActiveSection'

const NAV_IDS = ['top', 'about', 'experience', 'projects', 'skills', 'education', 'testimonial', 'contact']
const NAV_LABELS: Record<string, string> = {
  top: 'Overview',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  education: 'Education',
  testimonial: 'Voices',
  contact: 'Contact',
}

export default function Rail({ onDownloadResume }: { onDownloadResume: () => void }) {
  const time = useISTClock()
  const active = useActiveSection(NAV_IDS)

  return (
    <aside className="rail" aria-label="Secondary navigation">
      <div className="rail__logo">
        KM<span style={{ color: 'var(--accent)' }}>/</span>Portfolio
      </div>
      <nav className="rail__nav">
        {NAV_IDS.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            data-num={String(i).padStart(2, '0')}
            className={active === id ? 'is-active' : ''}
          >
            {NAV_LABELS[id]}
          </a>
        ))}
      </nav>
      <button type="button" className="rail__cta" onClick={onDownloadResume}>
        ↓ Download Resume
      </button>
      <div className="rail__meta">
        <div>
          <span className="dot"></span>
          <b>Open to work</b>
          <br />
          Full-time · Hybrid / Remote
        </div>
        <div>
          <b>Gurugram, IN</b>
          <br />
          <span>{time}</span> IST
        </div>
        <div>
          Currently at
          <br />
          <b>Salescode.ai</b> · SDET
        </div>
      </div>
    </aside>
  )
}
