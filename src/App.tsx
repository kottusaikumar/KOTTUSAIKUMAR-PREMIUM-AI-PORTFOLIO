import { lazy, Suspense, useState } from 'react'
import { AboutSection } from './components/AboutSection'
import { BookProjectJourney } from './components/BookProjectJourney'
import { CapabilitiesSection } from './components/capabilities/CapabilitiesSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceTimeline } from './components/ExperienceTimeline'
import { PersistentPillNav } from './components/PersistentPillNav'
import { PortfolioPortalIntro } from './components/PortfolioPortalIntro'
import { ProcessSection } from './components/ProcessSection'
import { ProofWall } from './components/ProofWall'
import { ResumeScrollStory } from './components/ResumeScrollStory'
import { useScrollSystem } from './hooks/useScrollSystem'

const PortfolioAssistant = lazy(() => import('./components/PortfolioAssistant').then((module) => ({
  default: module.PortfolioAssistant,
})))

function App() {
  useScrollSystem()
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantLoaded, setAssistantLoaded] = useState(false)

  const openAssistant = () => {
    setAssistantLoaded(true)
    setAssistantOpen(true)
  }

  return (
    <>
      <PortfolioPortalIntro />
      <PersistentPillNav assistantOpen={assistantOpen} onOpenAssistant={openAssistant} />
      <main id="main-content" tabIndex={-1}>
        <h1 className="sr-only">Kottu Saikumar - Full-Stack AI Developer</h1>
        <ResumeScrollStory />
        <AboutSection />
        <CapabilitiesSection />
        <ExperienceTimeline />
        <BookProjectJourney />
        <ProcessSection />
        <ProofWall />
        <ContactSection onOpenAssistant={openAssistant} />
      </main>
      {assistantLoaded ? (
        <Suspense fallback={null}>
          <PortfolioAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
        </Suspense>
      ) : null}
    </>
  )
}

export default App
