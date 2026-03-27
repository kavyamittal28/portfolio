import { useState, useRef, useEffect } from 'react'
import { Monitor, Network, Server, Brain, Database, BarChart3, type LucideIcon } from 'lucide-react'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import siteData from '@/data/site.json'

const ICON_MAP: Record<string, LucideIcon> = {
  monitor: Monitor,
  network: Network,
  server: Server,
  brain: Brain,
  database: Database,
  'bar-chart': BarChart3,
}

const archNodes = siteData.architecture.map((node) => ({
  label: node.label,
  icon: ICON_MAP[node.icon] || Server,
  tooltip: node.tooltip,
}))

const ArchitectureSection = () => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return
      const nodes = containerRef.current.querySelectorAll('.arch-node')
      const containerRect = containerRef.current.getBoundingClientRect()

      const positions = Array.from(nodes).map((node) => {
        const rect = node.getBoundingClientRect()
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        }
      })
      setNodePositions(positions)
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)

    return () => {
      window.removeEventListener('resize', updatePositions)
    }
  }, [])

  return (
    <section id="architecture" className="section">
      <div className="container">
        <RevealOnScroll>
          <SectionTitle prefix="System " highlight="Architecture" />
          <p className="section-subtitle">How I design backend & AI pipelines</p>
        </RevealOnScroll>

        <RevealOnScroll>
          <GlassCard>
            <div ref={containerRef} className="sys-arch-diagram">
              {/* SVG connections */}
              <svg className="arch-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {nodePositions.length === archNodes.length &&
                  nodePositions.slice(0, -1).map((pos, i) => {
                    const next = nodePositions[i + 1]
                    return (
                      <g key={i}>
                        <line
                          x1={pos.x}
                          y1={pos.y}
                          x2={next.x}
                          y2={next.y}
                          stroke="rgba(0, 240, 255, 0.15)"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                        />
                        <circle r="3" fill="var(--accent-blue)">
                          <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path={`M${pos.x},${pos.y} L${next.x},${next.y}`}
                          />
                        </circle>
                      </g>
                    )
                  })}
              </svg>

              {/* Architecture nodes */}
              <div className="arch-nodes-container">
                {archNodes.map((node, index) => {
                  const IconComponent = node.icon

                  return (
                    <div
                      key={index}
                      className="arch-node"
                      onMouseEnter={() => setActiveTooltip(index)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <div className="arch-icon">
                        <IconComponent size={24} />
                      </div>
                      <span className="arch-label">{node.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Tooltip */}
              {activeTooltip !== null && nodePositions[activeTooltip] && (
                <div
                  className="arch-tooltip visible"
                  style={{
                    left: `${nodePositions[activeTooltip].x}px`,
                    top: `${nodePositions[activeTooltip].y - 50}px`,
                    transform: 'translate(-50%, -100%)',
                  }}
                >
                  {archNodes[activeTooltip].tooltip}
                </div>
              )}
            </div>
          </GlassCard>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default ArchitectureSection
