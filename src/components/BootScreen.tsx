import { useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { soundEngine } from '@/utils/soundEngine'

const bootLines = [
  { text: 'KAVYA_OS v2.0', type: 'header', delay: 100 },
  { text: 'Initializing React runtime...', type: 'system', delay: 400 },
  { text: '[OK] Loading profile modules', type: 'success', delay: 700 },
  { text: '[OK] Connecting AWS services', type: 'success', delay: 1000 },
  { text: '[OK] Starting Python runtime', type: 'success', delay: 1300 },
  { text: '[OK] Mounting Docker containers', type: 'success', delay: 1600 },
  { text: '[OK] Deploying microservices', type: 'success', delay: 1900 },
  { text: '[OK] AI modules online', type: 'success', delay: 2200 },
  { text: 'All systems operational.', type: 'system', delay: 2600 },
  { text: '> Deploying portfolio...', type: 'command', delay: 3000 },
]

export default function BootScreen() {
  const { booted, setBooted } = useApp()
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [dissolving, setDissolving] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const completeBoot = useCallback(() => {
    if (booted || !mountedRef.current) return
    setDissolving(true)
    cleanup()
    const t = setTimeout(() => {
      if (mountedRef.current) setBooted(true)
    }, 600)
    timersRef.current.push(t)
  }, [booted, setBooted, cleanup])

  useEffect(() => {
    if (booted) return

    bootLines.forEach((line, i) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return
        setVisibleLines(prev => [...prev, i])
        setProgress(((i + 1) / bootLines.length) * 100)
        if (soundEngine.enabled) soundEngine.boot(i)
      }, line.delay)
      timersRef.current.push(t)
    })

    const endTimer = setTimeout(completeBoot, 3400)
    timersRef.current.push(endTimer)

    return cleanup
  }, [booted, completeBoot, cleanup])

  useEffect(() => {
    if (booted) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') completeBoot()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [booted, completeBoot])

  if (booted) return null

  return (
    <div id="boot-screen" className={dissolving ? 'hidden' : ''}>
      <div className="boot-terminal">
        {bootLines.map((line, i) =>
          visibleLines.includes(i) ? (
            <div
              key={i}
              className={`boot-line boot-line-${line.type} ${dissolving ? 'dissolving' : ''}`}
              style={{ animationDelay: dissolving ? `${i * 50}ms` : '0s' }}
            >
              {line.type === 'success' ? (
                <><span className="ok">[OK]</span> {line.text.replace('[OK] ', '')}</>
              ) : (
                line.text
              )}
            </div>
          ) : null
        )}
      </div>
      <div className="boot-progress-bar">
        <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <button className="boot-skip-btn" onClick={completeBoot}>
        Press ESC or click to skip
      </button>
    </div>
  )
}
