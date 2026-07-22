import { useEffect } from 'react'

/**
 * Fires GA4 custom events when portfolio sections scroll into view.
 * Each section is tracked once per page-load to avoid duplicate events.
 * Also tracks key user interactions like resume downloads and outbound clicks.
 *
 * Events sent:
 *   - section_view  { section_name }    — when ≥40% of a section is visible
 *   - resume_download                   — when the resume PDF is downloaded
 *   - cta_click     { cta_label, href } — when a CTA button/link is clicked
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const TRACKED_SECTIONS = [
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'testimonial',
  'contact',
]

export function useSectionAnalytics() {
  useEffect(() => {
    // Bail out if gtag isn't loaded (e.g. local dev with ad-blocker)
    if (typeof window.gtag !== 'function') return

    const seen = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id)
            window.gtag!('event', 'section_view', {
              section_name: id,
            })
          }
        }
      },
      {
        // Fire when at least 40% of the section is visible
        threshold: 0.4,
        // Slight negative margin so sections near the fold still count
        rootMargin: '0px 0px -10% 0px',
      }
    )

    // Observe all tracked sections
    for (const id of TRACKED_SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])
}

/** Fire a one-off GA4 event for resume downloads */
export function trackResumeDownload() {
  window.gtag?.('event', 'resume_download', {
    method: 'button_click',
  })
}

/** Fire a GA4 event for CTA interactions */
export function trackCtaClick(label: string, href?: string) {
  window.gtag?.('event', 'cta_click', {
    cta_label: label,
    ...(href && { link_url: href }),
  })
}
