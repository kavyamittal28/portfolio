import { useCallback } from 'react'
import { ToastProvider } from '@/context/ToastContext'
import { useTheme } from '@/hooks/useTheme'
import { useReveal } from '@/hooks/useReveal'
import { useSectionAnalytics, trackResumeDownload } from '@/hooks/useAnalytics'
import resumePdf from '@/assets/pdf/KAVYA_MITTAL.pdf?url'

import Rail from '@/components/layout/Rail'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StickyCTA from '@/components/layout/StickyCTA'

import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Education from '@/components/sections/Education'
import Testimonial from '@/components/sections/Testimonial'
import Contact from '@/components/sections/Contact'

function Portfolio() {
  const { theme, toggle } = useTheme('light')
  useReveal()
  useSectionAnalytics()

  const onDownloadResume = useCallback(() => {
    trackResumeDownload()
    const a = document.createElement('a')
    a.href = resumePdf
    a.download = 'Kavya_Mittal_Resume.pdf'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  return (
    <>
      <div className="page">
        <Rail onDownloadResume={onDownloadResume} />
        <main className="main" id="top">
          <Header
            theme={theme}
            onToggleTheme={toggle}
            onDownloadResume={onDownloadResume}
          />
          <Hero onDownloadResume={onDownloadResume} />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Testimonial />
          <Contact onDownloadResume={onDownloadResume} />
          <Footer />
        </main>
      </div>
      <StickyCTA onDownloadResume={onDownloadResume} />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Portfolio />
    </ToastProvider>
  )
}
