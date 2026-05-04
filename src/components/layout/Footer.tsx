export default function Footer() {
  const marqueeText =
    'Open to backend · platform · AI engineering roles · Python · Flask · AWS · Docker · MySQL · Playwright · Jenkins · '
  return (
    <div className="foot">
      <span>© 2026 · KM</span>
      <div className="marquee">
        <span>{marqueeText.repeat(2)}</span>
      </div>
      <span>Set in Inter Tight &amp; JetBrains Mono</span>
    </div>
  )
}
