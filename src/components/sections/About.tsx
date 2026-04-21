export default function About() {
  return (
    <section id="about">
      <div className="sec-label">
        <h2>
          About <span className="desc">— a 30-second read</span>
        </h2>
      </div>
      <div className="about-grid">
        <div className="mono" style={{ paddingTop: 6 }}>
          The elevator
        </div>
        <p className="about__lede reveal">
          I care about the <span className="mark">unglamorous parts</span> of software — the retry
          logic, the p99 latency, the migration that doesn&rsquo;t wake anyone at 2 a.m.
        </p>
        <div className="about__body reveal">
          <p>
            Backend-focused software engineer building <b>AI-driven microservices</b> and
            production-grade systems. End-to-end ownership of AI workflows at Salescode.ai — STT,
            TTS, and conversational orchestration across AWS, Google and 11 Labs — achieving{' '}
            <b>~90–95% accuracy</b> for Hindi and Mexican Spanish under a sub-2-second latency SLA.
          </p>
          <p>
            Skilled in{' '}
            <b>Python, Java, LLM integrations, REST APIs, SQL optimization</b>, and AWS deployments.
            I also built the QA automation layer (Playwright + Flutter) that eliminated 100% of
            manual regression effort and validates 500+ data points through CI/CD.
          </p>
        </div>
      </div>

      <div className="about__cards reveal">
        <div className="about__lookingfor">
          <h5>What I&rsquo;m looking for</h5>
          <ul>
            <li>Backend, platform, or AI engineering roles with real ownership</li>
            <li>Teams that ship to production and care about reliability</li>
            <li>A culture of moving fast and learning from real users</li>
          </ul>
        </div>

        <div className="why-hire">
          <h5>Why hire me</h5>
          <div className="why-hire__grid">
            <div>
              <b>End-to-end ownership.</b>
              From API design to AWS deploy, I ship features without hand-offs.
            </div>
            <div>
              <b>Production SLAs, not demos.</b>
              Sub-2s latency, 90–95% accuracy — running live, not in a notebook.
            </div>
            <div>
              <b>Backend × QA hybrid.</b>
              I build the service <em>and</em> the automation that keeps it honest.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
