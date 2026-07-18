import { useEffect, useState } from 'react'

interface PersistentPillNavProps {
  assistantOpen: boolean
  onOpenAssistant: () => void
}

export function PersistentPillNav({ assistantOpen, onOpenAssistant }: PersistentPillNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    if (!showScrollHint) return

    const dismissScrollHint = () => setShowScrollHint(false)
    const dismissWithWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) dismissScrollHint()
    }
    let touchStartY: number | null = null
    const rememberTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const dismissWithTouch = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY
      if (touchStartY !== null && currentY !== undefined && currentY < touchStartY - 4) dismissScrollHint()
    }
    const dismissWithKeyboard = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) dismissScrollHint()
    }

    window.addEventListener('wheel', dismissWithWheel, { passive: true })
    window.addEventListener('touchstart', rememberTouchStart, { passive: true })
    window.addEventListener('touchmove', dismissWithTouch, { passive: true })
    window.addEventListener('keydown', dismissWithKeyboard)

    return () => {
      window.removeEventListener('wheel', dismissWithWheel)
      window.removeEventListener('touchstart', rememberTouchStart)
      window.removeEventListener('touchmove', dismissWithTouch)
      window.removeEventListener('keydown', dismissWithKeyboard)
    }
  }, [showScrollHint])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  return (
    <nav className={`pill-nav visible${menuOpen ? ' menu-open' : ''}${showScrollHint ? '' : ' scroll-hint-hidden'}${assistantOpen ? ' assistant-active' : ''}`} aria-label="Portfolio controls">
      <div className="pill-scroll-indicator" aria-hidden="true">
        <span className="pill-scroll-dot" />
        <span>Scroll</span>
      </div>
      <div id="pill-menu" className={`pill-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#capabilities" onClick={() => setMenuOpen(false)}>Skills</a>
        <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
        <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
        <button type="button" onClick={() => { setMenuOpen(false); onOpenAssistant() }}>Ask Me</button>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </div>
      <div className="pill-dock">
        <button
          type="button"
          className="pill-assistant-button"
          aria-haspopup="dialog"
          aria-expanded={assistantOpen}
          onClick={onOpenAssistant}
        >
          <span className="pill-assistant-icon" aria-hidden="true">
            <b className="pill-monogram-k">K</b>
            <b className="pill-monogram-s">S</b>
            <i className="pill-monogram-leaf pill-monogram-leaf-one" />
            <i className="pill-monogram-leaf pill-monogram-leaf-two" />
          </span>
          <span className="pill-assistant-label">Ask AI</span>
        </button>
        <a className="pill-cta" href="#projects">View My Work</a>
        <button type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="pill-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span aria-hidden="true">{menuOpen ? '×' : 'Menu'}</span><span className="sr-only">Toggle section menu</span>
        </button>
      </div>
    </nav>
  )
}
