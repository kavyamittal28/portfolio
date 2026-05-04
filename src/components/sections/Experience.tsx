export default function Experience() {
  return (
    <section id="experience">
      <div className="sec-label">
        <h2>
          Experience <span className="desc">— roles, scope, and measurable impact</span>
        </h2>
      </div>
      <div className="xp">
        <div className="xp__aside">
          <span className="mono">Timeline</span>
          <p>Professional history, most recent first.</p>
        </div>
        <div>
          <article className="xp-item reveal">
            <div className="xp-item__head">
              <h3 className="xp-item__role">
                Software Development Engineer in Test{' '}
                <span className="at">/ Salescode.ai</span>
              </h3>
              <span className="xp-item__dates">
                <span className="badge">Current</span> Apr 2025 — Present · Gurugram
              </span>
            </div>
            <div className="xp-item__body">
              <div className="xp-block">
                <h4>Backend &amp; AI Engineering</h4>
                <ul>
                  <li>
                    Built and maintained Python microservices powering AI voice &amp; analytics
                    products at <span className="metric">sub-2s</span> response latency in
                    real-time pipelines.
                  </li>
                  <li>
                    Owned end-to-end AI workflows for <b>STT, TTS and conversational AI</b> across
                    AWS, Google &amp; 11 Labs — <span className="metric">~90–95% accuracy</span>{' '}
                    for Hindi &amp; Mexican Spanish.
                  </li>
                  <li>
                    Designed and deployed <b>RESTful APIs</b> for scalable frontend-backend
                    communication and implemented SQL query optimizations for real-time analytics
                    dashboards.
                  </li>
                  <li>
                    Deployed production services on <b>AWS (EC2, S3)</b> using Docker, Nginx,
                    Linux — and handled live production issue resolution.
                  </li>
                  <li>
                    Collaborated with cross-functional teams to deliver AI-driven features to
                    production with <b>full ownership of backend product development</b>.
                  </li>
                </ul>
              </div>
              <div className="xp-block">
                <h4>Automation &amp; Quality Engineering</h4>
                <ul>
                  <li>
                    Developed UI automation (<b>Playwright</b>) and mobile automation (
                    <b>Flutter</b>) — eliminated{' '}
                    <span className="metric">100% of manual regression effort</span>.
                  </li>
                  <li>
                    Built DB validation scripts and API testing frameworks validating{' '}
                    <b>500+ data points</b>, integrated with <b>Jenkins CI/CD</b>.
                  </li>
                  <li>
                    Implemented end-to-end, functional, and integration testing workflows —
                    near-complete automation of test scenarios.
                  </li>
                </ul>
              </div>
            </div>
            <div className="xp__stack">
              <span className="tag">Python</span>
              <span className="tag">Flask</span>
              <span className="tag">AWS</span>
              <span className="tag">Docker</span>
              <span className="tag">MySQL</span>
              <span className="tag">Playwright</span>
              <span className="tag">Jenkins</span>
              <span className="tag">LLM / AI</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
