import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme(initial: Theme = 'light') {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return initial
    const saved = localStorage.getItem('theme') as Theme | null
    return saved ?? (document.documentElement.getAttribute('data-theme') as Theme) ?? initial
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
