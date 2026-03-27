import { useEffect, useRef } from 'react'
import { Cloud, Code, Container, Brain, type LucideIcon } from 'lucide-react'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import certifications from '@/data/certifications.json'

const iconMap: Record<string, LucideIcon> = {
  cloud: Cloud,
  code: Code,
  container: Container,
  brain: Brain,
}

const CertificationsSection = () => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gridEl = gridRef.current
    if (!gridEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const cards = gridEl.querySelectorAll('.cert-card')
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('stamped')
            }, i * 200)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(gridEl)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section id="certifications" className="section">
      <div className="container">
        <RevealOnScroll>
          <SectionTitle prefix="Certifications & " highlight="Achievements" />
        </RevealOnScroll>

        <div ref={gridRef} className="certs-grid">
          {certifications.map((cert, index) => {
            const IconComponent = iconMap[cert.icon]

            return (
              <RevealOnScroll key={index} delay={index * 100}>
                <GlassCard className="cert-card" hover>
                  <div className="cert-badge-stamp" />
                  <div className="cert-icon">
                    {IconComponent && <IconComponent size={40} />}
                  </div>
                  <h3 className="cert-name">{cert.name}</h3>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <p className="cert-date">{cert.year}</p>
                </GlassCard>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CertificationsSection
