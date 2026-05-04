import { useState } from 'react'
import { useToast } from '@/context/ToastContext'

type ChannelProps = {
  label: string
  value: React.ReactNode
  copy?: string
}

function Channel({ label, value, copy }: ChannelProps) {
  const [copied, setCopied] = useState(false)
  const { show } = useToast()

  const onCopy = async () => {
    if (!copy) return
    try {
      await navigator.clipboard.writeText(copy)
      setCopied(true)
      show('Copied: ' + copy)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      show('Copy failed')
    }
  }

  return (
    <div className="ch">
      <span className="ch__label">{label}</span>
      <span className="ch__val">{value}</span>
      {copy && (
        <button
          type="button"
          className={`ch__copy${copied ? ' copied' : ''}`}
          onClick={onCopy}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      )}
    </div>
  )
}

export default function Contact({ onDownloadResume }: { onDownloadResume: () => void }) {
  return (
    <section id="contact">
      <div className="sec-label">
        <h2>
          Contact <span className="desc">— fastest way to reach me</span>
        </h2>
      </div>
      <div className="contact-grid">
        <div className="mono">Get in touch</div>
        <div>
          <p className="contact__big reveal">
            Let&rsquo;s <span className="it">talk</span>.
          </p>
          <p className="contact__lede reveal">
            I reply to recruiter and hiring-manager emails <b>within 24 hours</b>, usually same-day.
            Best first message: a one-liner on the role, team, and location — I&rsquo;ll send back a
            tailored CV and calendar link.
          </p>

          <div className="contact__primary reveal">
            <a className="btn btn--accent" href="mailto:kavyamittal1282@gmail.com">
              ✉ Email me <span className="arrow">→</span>
            </a>
            <button type="button" className="btn btn--ghost" onClick={onDownloadResume}>
              ↓ Download Resume
            </button>
          </div>

          <div className="contact__channels reveal">
            <Channel
              label="Email"
              value={
                <a href="mailto:kavyamittal1282@gmail.com">kavyamittal1282@gmail.com</a>
              }
              copy="kavyamittal1282@gmail.com"
            />
            <Channel label="Phone" value="+91 88754 84025" copy="+918875484025" />
            <Channel
              label="LinkedIn"
              value={
                <a
                  href="https://www.linkedin.com/in/kavyamittal-dev/"
                  target="_blank"
                  rel="noopener"
                >
                  /in/kavyamittal-dev ↗
                </a>
              }
            />
            <Channel
              label="GitHub"
              value={
                <a href="https://github.com/kavyamittal28" target="_blank" rel="noopener">
                  /kavyamittal28 ↗
                </a>
              }
            />
          </div>

          <div className="contact__note">
            <span>
              <b>Availability</b> · Notice: immediate
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              <b>Preferred location</b> · Gurugram / NCR or remote
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              <b>Work auth</b> · Indian citizen
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
