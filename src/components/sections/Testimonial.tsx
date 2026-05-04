export default function Testimonial() {
  return (
    <section id="testimonial">
      <div className="sec-label">
        <h2>
          Voices <span className="desc">— what teammates say (references on request)</span>
        </h2>
      </div>
      <div className="testi">
        <div className="mono">Reference</div>
        <div>
          <p className="testi__q reveal">
            Kavya owns outcomes end-to-end — he shipped our voice pipeline to{' '}
            <span className="it">production</span> in weeks and has stayed on as the go-to for every
            incident since.
          </p>
          <div className="testi__who reveal">
            <div className="testi__avatar">—</div>
            <div>
              <b>Engineering Lead</b>
              <br />
              Salescode.ai · Gurugram
            </div>
          </div>
          <p className="mono" style={{ marginTop: 28 }}>
            Additional references, including manager &amp; peers, available on request.
          </p>
        </div>
      </div>
    </section>
  )
}
