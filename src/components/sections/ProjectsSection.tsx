import { Mic } from 'lucide-react'
import { Link } from 'react-router-dom'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import NeonButton from '@/components/common/NeonButton'
import projects from '@/data/projects.json'

const WaveformVisual = () => (
  <div className="project-visual ai-waveform">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="bar" />
    ))}
    <div className="ai-icon">
      <Mic size={32} />
    </div>
  </div>
)

const ChartVisual = () => (
  <div className="project-visual analytics-chart">
    <div className="chart-bar h-40" />
    <div className="chart-bar h-60" />
    <div className="chart-bar h-90" />
    <div className="chart-bar h-70" />
    <div className="chart-bar h-50" />
    <svg
      style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '60%',
        pointerEvents: 'none',
      }}
      viewBox="0 0 200 100"
      preserveAspectRatio="none"
    >
      <polyline
        points="10,80 50,50 90,20 130,40 170,30"
        fill="none"
        stroke="var(--accent-purple)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  </div>
)

const ProjectsSection = () => {
  return (
    <section id="projects" className="section">
      <div className="container">
        <RevealOnScroll>
          <SectionTitle prefix="Featured " highlight="Projects" />
        </RevealOnScroll>

        <div className="projects-grid">
          {projects.map((project, index) => {
            const outlineColor = project.visual === 'waveform' ? 'blue' : 'purple'

            return (
              <RevealOnScroll key={project.id} delay={index * 150}>
                <GlassCard
                  className={`project-card outline-${outlineColor}`}
                  outline={outlineColor as 'blue' | 'purple'}
                  hover
                >
                  {project.visual === 'waveform' ? (
                    <WaveformVisual />
                  ) : (
                    <ChartVisual />
                  )}

                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tech-stack">
                      {project.tech.map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Link to={project.link}>
                        <NeonButton variant="secondary" size="sm">
                          View Case Study
                        </NeonButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
