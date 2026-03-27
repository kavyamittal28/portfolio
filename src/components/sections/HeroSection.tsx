import { useState, useEffect, useRef, useCallback } from 'react'
import NeonButton from '@/components/common/NeonButton'
import Terminal from '@/components/interactive/terminal/Terminal'
import siteData from '@/data/site.json'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

const ROLE_TEXT = siteData.hero.roleText
const TYPING_SPEED = siteData.hero.typingSpeed

const HeroSection = () => {
  const [typedText, setTypedText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationIdRef = useRef<number>(0)

  // Typing effect
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < ROLE_TEXT.length) {
        setTypedText(ROLE_TEXT.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, TYPING_SPEED)

    return () => clearInterval(interval)
  }, [])

  // Particle canvas system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const colors = [
      'rgba(0, 240, 255, 0.5)',
      'rgba(0, 240, 255, 0.3)',
      'rgba(157, 0, 255, 0.4)',
      'rgba(157, 0, 255, 0.25)',
    ]

    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    particlesRef.current = particles

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mouse = mouseRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }

        // Apply velocity with damping
        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cdx = p.x - p2.x
          const cdy = p.y - p2.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)

          if (cdist < 150) {
            const alpha = (1 - cdist / 150) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      cancelAnimationFrame(animationIdRef.current)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const scrollToProjects = useCallback(() => {
    const el = document.getElementById('projects')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <section id="home" className="hero-section section">
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text" data-depth="0.3">
            <p className="subtitle">// Backend &amp; AI Engineer</p>
            <h1>
              Hi, I'm <span className="gradient-text">Kavya Mittal</span>
            </h1>
            <p className="description" style={{ minHeight: '1.6em' }}>
              <span className="typing-text">{typedText}</span>
            </p>
            <div className="hero-cta">
              <NeonButton onClick={scrollToProjects} glow>
                View Projects →
              </NeonButton>
              <NeonButton
                variant="secondary"
                href="/assets/pdf/KAVYA_MITTAL.pdf"
                download="Kavya_Mittal_Resume.pdf"
              >
                Download Resume
              </NeonButton>
            </div>
          </div>
          <div data-depth="0.5">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
