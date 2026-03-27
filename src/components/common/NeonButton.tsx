import { useCallback } from 'react'

interface NeonButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'sm'
  glow?: boolean
  href?: string
  download?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

const NeonButton = ({
  children,
  variant = 'primary',
  size = 'default',
  glow,
  href,
  download,
  onClick,
  type = 'button',
  className = '',
}: NeonButtonProps) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    glow ? 'glow-effect' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const createRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      const target = e.currentTarget
      const rect = target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ripple.setAttribute('aria-hidden', 'true')
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`

      target.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    },
    []
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      createRipple(e)
      onClick?.()
    },
    [createRipple, onClick]
  )

  if (href) {
    return (
      <a href={href} download={download} className={classes} onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={handleClick}>
      {children}
    </button>
  )
}

export default NeonButton
