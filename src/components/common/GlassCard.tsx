import { useRef, useCallback } from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  outline?: 'blue' | 'purple'
  onClick?: () => void
}

const GlassCard = ({ children, className = '', hover, outline, onClick }: GlassCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -5
      const rotateY = ((x - centerX) / centerX) * 5

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      cardRef.current.style.transition = 'transform 0.1s ease'
    },
    [isTouchDevice]
  )

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    cardRef.current.style.transition = 'transform 0.4s ease'
  }, [])

  const classes = [
    'glass-card',
    hover ? 'hover-glow' : '',
    outline ? `outline-${outline}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={cardRef}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default GlassCard
