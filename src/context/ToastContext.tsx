import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type ToastCtx = { show: (msg: string) => void }

const Ctx = createContext<ToastCtx>({ show: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('')
  const [on, setOn] = useState(false)
  const timer = useRef<number | null>(null)

  const show = useCallback((m: string) => {
    setMsg(m)
    setOn(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOn(false), 1600)
  }, [])

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className={`toast${on ? ' on' : ''}`}>{msg}</div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
