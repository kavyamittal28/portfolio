import { useRef, useEffect, useState } from 'react'

interface TextScrambleProps {
  text: string
  trigger?: boolean
  className?: string
}

const CHARS = '!<>-_\\/[]{}#@$%^&*()+=01'

const TextScramble = ({ text, trigger, className = '' }: TextScrambleProps) => {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(0)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    let progress = 0

    const scramble = () => {
      intervalId = setInterval(() => {
        progress += 0.5

        const result = text
          .split('')
          .map((char, i) => {
            if (i < progress) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        setDisplay(result)

        if (progress >= text.length) {
          clearInterval(intervalId)
          setDisplay(text)
        }
      }, 30)
    }

    scramble()
    frameRef.current += 1

    return () => {
      clearInterval(intervalId)
    }
  }, [text, trigger])

  return <span className={className}>{display}</span>
}

export default TextScramble
