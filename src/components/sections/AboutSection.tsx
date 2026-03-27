import { useState, useEffect, useRef, useCallback } from 'react'
import { GraduationCap } from 'lucide-react'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'

interface StatConfig {
  target: number
  suffix: string
  label: string
  decimals: number
}

const STATS: StatConfig[] = [
  { target: 11, suffix: '', label: 'Months Experience', decimals: 0 },
  { target: 9.06, suffix: '', label: 'CGPA', decimals: 2 },
  { target: 2, suffix: '+', label: 'Major AI Products Built', decimals: 0 },
]

const ANIMATION_DURATION = 1500

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

const AnimatedCounter = ({ target, suffix, decimals }: { target: number; suffix: string; decimals: number }) => {
  const [value, setValue] = useState(0)
  const counterRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = counterRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
            const easedProgress = easeOutQuart(progress)
            const currentValue = easedProgress * target

            setValue(currentValue)

            if (progress < 1) {
              requestAnimationFrame(step)
            }
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [target])

  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()

  return (
    <div ref={counterRef} className="stat-number gradient-text">
      {displayValue}{suffix}
    </div>
  )
}

const AboutSection = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionTitle prefix="About" highlight="Me" />

        <RevealOnScroll>
          <div className="about-grid">
            <svg className="about-monogram" width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="Kavya Mittal monogram">
              <defs>
                <linearGradient id="monogram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-blue)" />
                  <stop offset="100%" stopColor="var(--accent-purple)" />
                </linearGradient>
              </defs>
              <circle
                cx="90"
                cy="90"
                r="85"
                fill="none"
                stroke="url(#monogram-gradient)"
                strokeWidth="3"
              />
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="rgba(20, 20, 35, 0.6)"
              />
              <text
                x="90"
                y="98"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="'Space Grotesk', sans-serif"
                fontSize="48"
                fontWeight="700"
                fill="url(#monogram-gradient)"
              >
                KM
              </text>
            </svg>

            <div className="about-text">
              <p>
                I'm a Backend & AI Engineer at Salescode.ai with hands-on experience building
                production-grade AI systems. My work spans designing scalable microservices,
                developing AI voice and analytics products, and automating end-to-end testing
                pipelines.
              </p>
              <p>
                I thrive at the intersection of backend engineering and artificial intelligence,
                turning complex problems into reliable, performant solutions. From STT/TTS
                pipelines processing real-time audio to analytics dashboards serving hundreds of
                data points, I focus on building systems that scale.
              </p>

              <div className="education-card">
                <div className="edu-icon">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3>Chitkara University, Punjab</h3>
                  <p className="highlight">B.Tech in Computer Science & Engineering</p>
                  <p className="date">2022 – Present | CGPA: 9.06</p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="stats-grid">
            {STATS.map((stat) => (
              <GlassCard key={stat.label} className="stat-card" hover>
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
                <div className="stat-label">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default AboutSection
