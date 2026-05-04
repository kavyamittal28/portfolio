import { useEffect, useState } from 'react'

export default function StickyCTA({ onDownloadResume }: { onDownloadResume: () => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector('.hero') as HTMLElement | null
      const contact = document.getElementById('contact')
      if (!hero || !contact) return
      const past = hero.getBoundingClientRect().bottom < 0
      const nearContact = contact.getBoundingClientRect().top < window.innerHeight * 0.9
      setShow(past && !nearContact)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`sticky-cta${show ? ' show' : ''}`}>
      <a className="btn" href="mailto:kavyamittal1282@gmail.com">
        ✉ Email
      </a>
      <button type="button" className="btn btn--accent" onClick={onDownloadResume}>
        ↓ Resume
      </button>
    </div>
  )
}
