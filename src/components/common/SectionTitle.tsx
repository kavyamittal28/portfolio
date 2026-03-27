import { useRef, useEffect, useState } from 'react'
import TextScramble from './TextScramble'

interface SectionTitleProps {
  prefix: string
  highlight: string
  className?: string
}

const SectionTitle = ({ prefix, highlight, className = '' }: SectionTitleProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <h2 ref={headingRef} className={`section-title ${className}`.trim()}>
      <TextScramble text={prefix} trigger={isVisible} />{' '}
      <span className="gradient-text">
        <TextScramble text={highlight} trigger={isVisible} />
      </span>
    </h2>
  )
}

export default SectionTitle
