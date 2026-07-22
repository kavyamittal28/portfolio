export default function Hero({ onDownloadResume }: { onDownloadResume: () => void }) {
  return (
    <section className="hero">
      <div className="hero__body">
        <span className="hero__avail">Open to opportunities · Notice: immediate</span>

        <h1 className="display reveal">
          Kavya<br />
          Mittal<span className="it">,</span><br />
          Backend &amp; AI<br />
          <span className="it">engineer.</span>
        </h1>

        <div className="hero__roles reveal">
          <span>
            Role · <b>SDET / Backend Engineer</b>
          </span>
          <span className="sep">·</span>
          <span>
            Focus · <b>Python · AI · APIs</b>
          </span>
          <span className="sep">·</span>
          <span>
            Location · <b>Gurugram, IN</b>
          </span>
        </div>

        <p className="hero__sub reveal">
          I build <b>production-grade backends</b> and ship <b>AI voice pipelines</b> that answer in
          under two seconds. Currently at <b>Salescode.ai</b> — actively exploring full-time roles
          in backend and applied AI engineering.
        </p>

        <div className="hero__actions reveal">
          <button type="button" className="btn btn--accent" onClick={onDownloadResume}>
            ↓ Download Resume <span className="arrow">→</span>
          </button>
          <a className="btn btn--ghost" href="mailto:kavyamittal1282@gmail.com">
            Email me
          </a>
          <a className="btn btn--ghost" href="#contact">
            Schedule a call
          </a>
        </div>

        <div className="snapshot reveal">
          <div className="snapshot__head">
            <span>At a glance</span>
            <span>updated · Apr 2026</span>
          </div>
          <div className="snapshot__grid">
            <div className="snap">
              <div className="snap__label">Experience</div>
              <div className="snap__val">
                1 yr 4 mos <small>Full-time · SDET</small>
              </div>
            </div>
            <div className="snap">
              <div className="snap__label">Primary stack</div>
              <div className="snap__val">
                Python · Flask <small>+ Java, SQL, AWS</small>
              </div>
            </div>
            <div className="snap">
              <div className="snap__label">Specialty</div>
              <div className="snap__val">
                AI voice · APIs <small>STT / TTS / orchestration</small>
              </div>
            </div>
            <div className="snap">
              <div className="snap__label">Availability</div>
              <div className="snap__val">
                Immediate <small>Hybrid · Remote · On-site</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

