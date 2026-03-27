import { useEffect, useRef, useCallback } from 'react'
import { Server, Bot, MapPin } from 'lucide-react'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import experienceData from '@/data/experience.json'

interface CommitData {
  date: string
  metric: string
  hash: string
  msg: string
  diffs: string[]
}

interface CategoryData {
  title: string
  icon: string
  color: string
  bullets: string[]
}

interface ExperienceData {
  role: string
  company: string
  location: string
  date: string
  categories: CategoryData[]
  commits: CommitData[]
}

const ICON_MAP: Record<string, React.ReactNode> = {
  server: <Server size={16} />,
  bot: <Bot size={16} />,
}

const COLOR_MAP: Record<string, string> = {
  blue: 'neon-blue',
  purple: 'neon-purple',
}

const CommitTimeline = ({ commits }: { commits: CommitData[] }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<(HTMLDivElement | null)[]>([])

  // Animate nodes on scroll with stagger
  useEffect(() => {
    const nodes = nodesRef.current.filter(Boolean) as HTMLDivElement[]
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const node = entry.target as HTMLDivElement
            const index = parseInt(node.dataset.index || '0', 10)
            setTimeout(() => {
              node.classList.add('visible')
            }, index * 150)
            observer.unobserve(node)
          }
        })
      },
      { threshold: 0.1 }
    )

    nodes.forEach((node) => observer.observe(node))

    return () => {
      observer.disconnect()
    }
  }, [commits])

  // Horizontal scroll with mouse wheel - only when explicitly scrolling horizontally
  const handleWheel = useCallback((e: WheelEvent) => {
    const track = trackRef.current?.parentElement
    if (!track) return

    const isScrollable = track.scrollWidth > track.clientWidth
    if (!isScrollable) return

    // Only convert vertical scroll to horizontal when shift is held,
    // or when there's actual horizontal delta (trackpad)
    const hasHorizontalIntent = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)
    if (!hasHorizontalIntent) return

    const delta = e.shiftKey ? e.deltaY : e.deltaX
    const atStart = track.scrollLeft === 0 && delta < 0
    const atEnd =
      Math.abs(track.scrollLeft + track.clientWidth - track.scrollWidth) < 1 &&
      delta > 0

    if (!atStart && !atEnd) {
      e.preventDefault()
      track.scrollLeft += delta
    }
  }, [])

  useEffect(() => {
    const container = trackRef.current?.parentElement
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  return (
    <div className="commit-timeline">
      <div ref={trackRef} className="commit-track">
        <div className="commit-line" />
        {commits.map((commit, index) => (
          <div
            key={commit.hash}
            className="commit-node"
            data-index={index}
            ref={(el) => {
              nodesRef.current[index] = el
            }}
          >
            <div
              className={`commit-dot${commit.hash === 'HEAD' ? ' active' : ''}`}
            />
            <GlassCard className="commit-card">
              <div className="commit-hash">{commit.hash}</div>
              <div className="commit-msg">{commit.msg}</div>
              <div className="commit-diff">
                {commit.diffs.map((diff, di) => {
                  const isAdd = diff.startsWith('+')
                  const isDel = diff.startsWith('-')
                  return (
                    <span
                      key={di}
                      className={isAdd ? 'diff-add' : isDel ? 'diff-del' : ''}
                    >
                      {diff}
                    </span>
                  )
                })}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  )
}

const ExperienceSection = () => {
  const experiences = experienceData as ExperienceData[]

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionTitle prefix="Work" highlight="Experience" />

        <div className="timeline">
          {experiences.map((exp, expIndex) => (
            <RevealOnScroll key={expIndex} delay={expIndex * 100}>
              <div className="timeline-item">
                <div className={`timeline-marker${expIndex === 0 ? ' pulse' : ''}`} />

                <GlassCard>
                  <div className="timeline-header">
                    <div>
                      <h3 className="role">{exp.role}</h3>
                      <p className="company">
                        <span className="highlight">{exp.company}</span>
                        <span className="location">
                          <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.2rem' }} />
                          {exp.location}
                        </span>
                      </p>
                    </div>
                    <span className="date-badge">{exp.date}</span>
                  </div>

                  {exp.categories.map((cat, catIndex) => (
                    <div key={catIndex} className="exp-category">
                      <h4 className={`category-title ${COLOR_MAP[cat.color] || ''}`}>
                        {ICON_MAP[cat.icon] || null}
                        {cat.title}
                      </h4>
                      <ul className="exp-list">
                        {cat.bullets.map((bullet, bi) => (
                          <li key={bi}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <CommitTimeline commits={exp.commits} />
                </GlassCard>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
