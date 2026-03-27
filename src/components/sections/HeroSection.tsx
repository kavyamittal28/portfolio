import { useState, useEffect, useRef, useCallback } from 'react'
import NeonButton from '@/components/common/NeonButton'
import Terminal from '@/components/interactive/terminal/Terminal'
import siteData from '@/data/site.json'
import { useApp } from '@/context/AppContext'

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

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
)

const DARK_COLORS = [
  'rgba(0, 240, 255, 0.55)',
  'rgba(0, 240, 255, 0.35)',
  'rgba(157, 0, 255, 0.45)',
  'rgba(157, 0, 255, 0.28)',
]

const LIGHT_COLORS = [
  'rgba(0, 120, 160, 0.65)',
  'rgba(0, 100, 140, 0.45)',
  'rgba(100, 0, 180, 0.55)',
  'rgba(80, 0, 160, 0.38)',
]

const HeroSection = () => {
  const [typedText, setTypedText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationIdRef = useRef<number>(0)
  const { theme } = useApp()

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

  // Re-color particles when theme changes
  useEffect(() => {
    const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS
    particlesRef.current.forEach((p) => {
      p.color = colors[Math.floor(Math.random() * colors.length)]
    })
  }, [theme])

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

    const colors = DARK_COLORS

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
      const isLight = document.body.classList.contains('light-theme')
      const lineColor = isLight ? '0, 100, 150' : '0, 240, 255'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }

        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cdx = p.x - p2.x
          const cdy = p.y - p2.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)

          if (cdist < 150) {
            const alpha = (1 - cdist / 150) * (isLight ? 0.25 : 0.15)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`
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
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section id="home" className="hero-section section">
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="hero-glow" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text" data-depth="0.3">
            <p className="hero-greeting">Hello World, I am</p>
            <h1 className="hero-name">Kavya Mittal</h1>
            <p className="hero-role gradient-text">Backend &amp; AI Engineer</p>
            <p className="description" style={{ minHeight: '1.6em' }}>
              <span className="typing-text">{typedText}</span>
            </p>
            <div className="hero-cta">
              <NeonButton onClick={scrollToProjects} glow>
                View Projects →
              </NeonButton>
              <NeonButton variant="secondary" onClick={scrollToContact}>
                Get In Touch
              </NeonButton>
            </div>
            <div className="hero-social">
              <a
                href="https://github.com/kavyamittal28"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/kavyamittal-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="mailto:kavyamittal1282@gmail.com"
                className="hero-social-link"
                aria-label="Email"
              >
                <EmailIcon />
              </a>
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
