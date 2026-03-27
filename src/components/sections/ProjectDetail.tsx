import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mic, Brain, Volume2, Headset, Monitor, Server, Shield, Database } from 'lucide-react'
import NeonButton from '@/components/common/NeonButton'
import GlassCard from '@/components/common/GlassCard'
import SubpageLayout from '@/components/layout/SubpageLayout'
import projectDetails from '@/data/project_details.json'

const ICON_MAP: Record<string, React.ReactNode> = {
  phone: <Phone size={28} />,
  mic: <Mic size={28} />,
  brain: <Brain size={28} />,
  volume: <Volume2 size={28} />,
  headset: <Headset size={28} />,
  monitor: <Monitor size={28} />,
  server: <Server size={28} />,
  shield: <Shield size={28} />,
  database: <Database size={28} />,
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projectDetails.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="blog-post-page">
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
          <h1>Project Not Found</h1>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
            The project you're looking for doesn't exist.
          </p>
          <Link to="/">
            <NeonButton>
              <ArrowLeft size={16} /> Back to Home
            </NeonButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <SubpageLayout backTo="/#projects" backLabel="Back to Projects">
      {/* Hero */}
      <section className="section" style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <div className="container">
          <span className="blog-category-tag">CASE STUDY</span>
            <h1 className="blog-article-title" style={{ marginTop: '1rem' }}>{project.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
              {project.tagline}
            </p>
            <div className="tech-stack" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              {project.tech.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="section" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
          <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>
              The <span className="gradient-text">Problem</span>
            </h2>
            <GlassCard>
              {project.problem.map((p, i) => (
                <p key={i} style={{ marginTop: i > 0 ? '1rem' : 0 }}>{p}</p>
              ))}
            </GlassCard>
          </div>
        </section>

        {/* Architecture */}
        <section className="section" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
          <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>
              System <span className="gradient-text">Architecture</span>
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              padding: '2rem 0',
            }}>
              {project.architecture.map((node, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="glass-card stat-card" style={{ textAlign: 'center', padding: '1.5rem 1rem', minWidth: '120px' }}>
                    <div className="neon-blue" style={{ marginBottom: '0.5rem' }}>
                      {ICON_MAP[node.icon] || null}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{node.label}</div>
                  </div>
                  {i < project.architecture.length - 1 && (
                    <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contributions */}
        <section className="section" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
          <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>
              My <span className="gradient-text">Contributions</span>
            </h2>
            <div className="skills-grid">
              {project.contributions.map((contrib, i) => (
                <GlassCard key={i} hover>
                  <h3 style={{ marginBottom: '0.75rem' }}>{contrib.title}</h3>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    {contrib.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '0.4rem', color: 'var(--text-muted)' }}>{b}</li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="section" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
          <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>
              Key <span className="gradient-text">Metrics</span>
            </h2>
            <div className="stats-grid">
              {project.metrics.map((m, i) => (
                <GlassCard key={i} className="stat-card" hover>
                  <div className="stat-number gradient-text">{m.value}</div>
                  <div className="stat-label">{m.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Deep Dive */}
        <section className="section" style={{ minHeight: 'auto', paddingTop: '2rem' }}>
          <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>
              Tech Stack <span className="gradient-text">Deep Dive</span>
            </h2>
            <div className="skills-grid">
              {project.techDeepDive.map((tech, i) => (
                <GlassCard key={i} hover>
                  <h3 style={{ marginBottom: '0.5rem' }}>{tech.name}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{tech.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

      {/* Back */}
      <div className="blog-nav-bottom">
        <Link to="/#projects">
          <NeonButton glow>
            <ArrowLeft size={16} /> Back to All Projects
          </NeonButton>
        </Link>
      </div>
    </SubpageLayout>
  )
}
