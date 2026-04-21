type Project = {
  idx: string
  title: string
  subtitle: string
  role: string
  desc: string
  outcomes: { val: string; label: string }[]
  tags: string[]
  meta: { year: string; type: string; company: string; arrow: string }
  href?: string
}

const PROJECTS: Project[] = [
  {
    idx: '01',
    title: 'SCAI',
    subtitle: '— AI Voice Calling Agent',
    role: 'Backend & AI Engineer',
    desc: 'Implemented backend APIs, managed AI-driven voice workflows, and maintained real-time conversational pipelines. Integrated STT/TTS providers across AWS, Google and 11 Labs with retries and observability.',
    outcomes: [
      { val: '< 2s', label: 'Real-time latency' },
      { val: '90–95%', label: 'STT accuracy' },
      { val: '2 lang.', label: 'Hindi · Mex. Spanish' },
    ],
    tags: ['Python', 'Flask', 'AWS', 'Docker', '11 Labs', 'Google STT'],
    meta: { year: '2025', type: 'Prod. service', company: 'Salescode.ai', arrow: '↗ visit live' },
    href: 'https://salesagent.salescode.ai/',
  },
  {
    idx: '02',
    title: 'SalesLens',
    subtitle: '— Analytics Dashboard',
    role: 'Backend Engineer',
    desc: 'Built backend services, optimized complex SQL queries, and developed secure real-time analytics dashboards with role-based access control (RBAC).',
    outcomes: [
      { val: '500+', label: 'Data points validated' },
      { val: 'RBAC', label: 'Role-based access' },
      { val: 'Real-time', label: 'Dashboards' },
    ],
    tags: ['Python', 'REST', 'MySQL', 'AWS RDS', 'React'],
    meta: { year: '2025', type: 'Internal prod.', company: 'Salescode.ai', arrow: '↗ case study' },
  },
  {
    idx: '03',
    title: 'Automation Framework',
    subtitle: '— regression, gone.',
    role: 'Framework Author · SDET',
    desc: 'Designed and built an end-to-end automation framework using Playwright (web) and Flutter integration tests (mobile), plugged into Jenkins CI/CD. Included DB validation scripts and API testing frameworks across 500+ data points.',
    outcomes: [
      { val: '100%', label: 'Manual regression removed' },
      { val: '500+', label: 'Data points covered' },
      { val: 'CI/CD', label: 'Jenkins pipelines' },
    ],
    tags: ['Playwright', 'Flutter', 'Jenkins', 'JMeter', 'CI/CD'],
    meta: { year: '2025', type: 'Internal tool', company: 'Salescode.ai', arrow: '↗ overview' },
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <div className="sec-label">
        <h2>
          Featured Projects{' '}
          <span className="desc">— what I built, my role, and the outcome</span>
        </h2>
      </div>

      <div className="projects">
        {PROJECTS.map((p) => (
          <a
            key={p.idx}
            className="project reveal"
            href={p.href ?? '#'}
            {...(p.href ? { target: '_blank', rel: 'noopener' } : {})}
          >
            <div className="project__idx">{p.idx}</div>
            <div>
              <h3 className="project__title">
                {p.title} <span className="it">{p.subtitle}</span>
              </h3>
              <div className="project__role">
                Role · <b>{p.role}</b>
              </div>
              <p className="project__desc">{p.desc}</p>
              <div className="project__outcomes">
                {p.outcomes.map((o) => (
                  <div key={o.label}>
                    <div className="o-val">{o.val}</div>
                    <div className="o-label">{o.label}</div>
                  </div>
                ))}
              </div>
              <div className="project__tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="project__meta">
              <div className="row">
                <span>Year</span>
                <b>{p.meta.year}</b>
              </div>
              <div className="row">
                <span>Type</span>
                <b>{p.meta.type}</b>
              </div>
              <div className="row">
                <span>Company</span>
                <b>{p.meta.company}</b>
              </div>
              <div className="arrow">{p.meta.arrow}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
