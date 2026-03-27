import { useEffect, useRef, useState } from 'react'
import { Code, Server, Database, Cloud, FlaskConical, Monitor, type LucideIcon } from 'lucide-react'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import skills from '@/data/skills.json'

const categoryIconMap: Record<string, LucideIcon> = {
  code: Code,
  server: Server,
  database: Database,
  cloud: Cloud,
  'flask-conical': FlaskConical,
  monitor: Monitor,
}

const CENTER = 200
const MAX_RADIUS = 140

function polarToXY(angle: number, radius: number) {
  return {
    x: CENTER + radius * Math.cos(angle - Math.PI / 2),
    y: CENTER + radius * Math.sin(angle - Math.PI / 2),
  }
}

function getPolygonPoints(values: number[], count: number): string {
  return values
    .map((val, i) => {
      const angle = (2 * Math.PI * i) / count
      const { x, y } = polarToXY(angle, MAX_RADIUS * val)
      return `${x},${y}`
    })
    .join(' ')
}

interface TooltipData {
  label: string
  value: number
  techs: string
  x: number
  y: number
}

const SkillsSection = () => {
  const radarRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const radarData = skills.radar
  const count = radarData.length
  const ringLevels = [0.25, 0.5, 0.75, 1.0]

  useEffect(() => {
    const el = radarRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handlePointHover = (
    item: (typeof radarData)[number],
    index: number,
    e: React.MouseEvent<SVGCircleElement>
  ) => {
    const svg = e.currentTarget.closest('svg')
    const container = radarRef.current
    if (!svg || !container) return
    const containerRect = container.getBoundingClientRect()
    const svgRect = svg.getBoundingClientRect()
    const angle = (2 * Math.PI * index) / count
    const { x, y } = polarToXY(angle, MAX_RADIUS * item.value)

    const tooltipX = svgRect.left - containerRect.left + (x / 400) * svgRect.width
    const tooltipY = svgRect.top - containerRect.top + (y / 400) * svgRect.height

    setTooltip({
      label: item.label,
      value: Math.round(item.value * 100),
      techs: item.techs,
      x: tooltipX,
      y: tooltipY - 10,
    })
  }

  const handlePointLeave = () => {
    setTooltip(null)
  }

  return (
    <section id="skills" className="section">
      <div className="container">
        <RevealOnScroll>
          <SectionTitle prefix="Skills & " highlight="Tech Stack" />
        </RevealOnScroll>

        <RevealOnScroll>
          <div ref={radarRef} className="radar-chart-container">
            <svg className="skill-radar" viewBox="0 0 400 400">
              <defs>
                <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid rings */}
              <g className="radar-rings">
                {ringLevels.map((level) => (
                  <polygon
                    key={level}
                    className="radar-ring"
                    points={getPolygonPoints(
                      Array(count).fill(level),
                      count
                    )}
                  />
                ))}
              </g>

              {/* Axis lines */}
              <g className="radar-axes">
                {radarData.map((_, i) => {
                  const angle = (2 * Math.PI * i) / count
                  const { x, y } = polarToXY(angle, MAX_RADIUS)
                  return (
                    <line
                      key={i}
                      x1={CENTER}
                      y1={CENTER}
                      x2={x}
                      y2={y}
                    />
                  )
                })}
              </g>

              {/* Data polygon */}
              <polygon
                className={`radar-data ${animated ? 'animated' : ''}`}
                points={getPolygonPoints(
                  radarData.map((d) => d.value),
                  count
                )}
              />

              {/* Interactive data points */}
              <g className="radar-points">
                {radarData.map((item, i) => {
                  const angle = (2 * Math.PI * i) / count
                  const { x, y } = polarToXY(angle, MAX_RADIUS * item.value)
                  return (
                    <circle
                      key={i}
                      className={animated ? 'animated' : ''}
                      cx={x}
                      cy={y}
                      onMouseEnter={(e) => handlePointHover(item, i, e)}
                      onMouseLeave={handlePointLeave}
                    />
                  )
                })}
              </g>

              {/* Labels */}
              <g className="radar-labels">
                {radarData.map((item, i) => {
                  const angle = (2 * Math.PI * i) / count
                  const { x, y } = polarToXY(angle, MAX_RADIUS + 25)
                  return (
                    <text key={i} x={x} y={y} dominantBaseline="middle">
                      {item.label}
                    </text>
                  )
                })}
              </g>
            </svg>

            {/* Tooltip */}
            <div
              className={`radar-tooltip ${tooltip ? 'visible' : ''}`}
              style={{
                left: tooltip ? `${tooltip.x}px` : 0,
                top: tooltip ? `${tooltip.y}px` : 0,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {tooltip && (
                <>
                  <strong style={{ color: 'var(--accent-blue)' }}>
                    {tooltip.label}
                  </strong>
                  <span style={{ marginLeft: '0.5rem', color: 'var(--accent-purple)' }}>
                    {tooltip.value}%
                  </span>
                  <br />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    {tooltip.techs}
                  </span>
                </>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {/* Skills grid */}
        <div className="skills-grid">
          {skills.categories.map((category, index) => {
            const IconComponent = categoryIconMap[category.icon]

            return (
              <RevealOnScroll key={index} delay={index * 80}>
                <GlassCard className="skill-category" hover>
                  <h3>
                    {IconComponent && (
                      <span className="neon-blue">
                        <IconComponent size={18} />
                      </span>
                    )}
                    {category.title}
                  </h3>
                  <div className="skill-tags">
                    {category.items.map((item, i) => (
                      <span key={i} className="tag">
                        {item}
                      </span>
                    ))}
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

export default SkillsSection
