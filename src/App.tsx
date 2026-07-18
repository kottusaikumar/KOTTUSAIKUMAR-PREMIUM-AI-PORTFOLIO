import { useState } from 'react'
import { AboutSection } from './components/AboutSection'
import { BookProjectJourney } from './components/BookProjectJourney'
import { CapabilitiesSection } from './components/capabilities/CapabilitiesSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceTimeline } from './components/ExperienceTimeline'
import { PersistentPillNav } from './components/PersistentPillNav'
import { PortfolioPortalIntro } from './components/PortfolioPortalIntro'
import { PortfolioAssistant } from './components/PortfolioAssistant'
import { ProcessSection } from './components/ProcessSection'
import { ProofWall } from './components/ProofWall'
import { ResumeScrollStory } from './components/ResumeScrollStory'
import { useScrollSystem } from './hooks/useScrollSystem'

function App() {
  useScrollSystem()
  const [assistantOpen, setAssistantOpen] = useState(false)

  return (
    <>
      <PortfolioPortalIntro />
      <PersistentPillNav assistantOpen={assistantOpen} onOpenAssistant={() => setAssistantOpen(true)} />
      <main id="main-content" tabIndex={-1}>
        <h1 className="sr-only">Kottu Saikumar - Full-Stack AI Developer</h1>
        <ResumeScrollStory />
        <AboutSection />
        <CapabilitiesSection />
        <ExperienceTimeline />
        <BookProjectJourney />
        <ProcessSection />
        <ProofWall />
        <ContactSection onOpenAssistant={() => setAssistantOpen(true)} />
      </main>
      <PortfolioAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </>
  )
}

export default App
