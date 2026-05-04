export default function Education() {
  return (
    <section id="education">
      <div className="sec-label">
        <h2>Education &amp; Certifications</h2>
      </div>
      <div className="ed-grid">
        <div className="mono">Credentials</div>
        <div className="ed-block">
          <h4>Education</h4>
          <div className="ed-row">
            <div>
              <h5>B.E. · Computer Science &amp; Engineering</h5>
              <p>
                Chitkara University, Punjab &nbsp;·&nbsp;{' '}
                <b style={{ color: 'var(--ink)', fontWeight: 500 }}>CGPA 9.06</b> (through 7th sem)
              </p>
            </div>
            <span className="date">Aug 2022 — Present</span>
          </div>
        </div>
        <div className="ed-block">
          <h4>Certifications</h4>
          <div className="ed-row">
            <div>
              <h5>AWS Certified Cloud Practitioner</h5>
              <p>Amazon Web Services</p>
            </div>
            <span className="date">2025</span>
          </div>
          <div className="ed-row">
            <div>
              <h5>Python (Advanced)</h5>
              <p>HackerRank</p>
            </div>
            <span className="date">2024</span>
          </div>
          <div className="ed-row">
            <div>
              <h5>Docker Essentials</h5>
              <p>Docker Inc.</p>
            </div>
            <span className="date">2024</span>
          </div>
          <div className="ed-row">
            <div>
              <h5>AI &amp; Machine Learning Specialization</h5>
              <p>Coursera</p>
            </div>
            <span className="date">2024</span>
          </div>
        </div>
      </div>
    </section>
  )
}
