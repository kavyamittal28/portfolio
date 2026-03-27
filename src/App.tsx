import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import BootScreen from '@/components/BootScreen'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollPipeline from '@/components/layout/ScrollPipeline'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import CertificationsSection from '@/components/sections/CertificationsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ArchitectureSection from '@/components/sections/ArchitectureSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactSection from '@/components/sections/ContactSection'
import AIAssistant from '@/components/interactive/ai/AIAssistant'
import CmdPalette from '@/components/interactive/palette/CmdPalette'
import BlogPost from '@/components/sections/BlogPost'
import ProjectDetail from '@/components/sections/ProjectDetail'
import { useApp } from '@/context/AppContext'
import { useCallback } from 'react'

function HomePage() {
  const { toggleTheme, toggleSound } = useApp()

  const handleStartTour = useCallback(() => {
    const orb = document.querySelector('.ai-orb') as HTMLElement | null
    orb?.click()
  }, [])

  return (
    <>
      <BootScreen />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <CertificationsSection />
        <SkillsSection />
        <ArchitectureSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollPipeline />
      <AIAssistant />
      <CmdPalette
        onToggleTheme={toggleTheme}
        onToggleSound={toggleSound}
        onStartTour={handleStartTour}
      />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
