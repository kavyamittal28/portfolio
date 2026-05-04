import { useEffect, useState } from 'react'

export function useISTClock() {
  const [time, setTime] = useState('—')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const ist = new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000)
      setTime(
        String(ist.getHours()).padStart(2, '0') + ':' + String(ist.getMinutes()).padStart(2, '0')
      )
    }
    tick()
    const id = window.setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  return time
}
