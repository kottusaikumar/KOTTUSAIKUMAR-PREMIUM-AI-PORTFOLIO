import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  siFastapi,
  siGithub,
  siLangchain,
  siPython,
  siPytorch,
  siReact,
  siTensorflow,
  type SimpleIcon,
} from 'simple-icons'
import { personal } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 30

const technologyMarks = [
  { name: 'Python', position: 'python', icon: siPython },
  { name: 'TensorFlow', position: 'tensorflow', icon: siTensorflow },
  { name: 'PyTorch', position: 'pytorch', icon: siPytorch },
  { name: 'LangChain', position: 'langchain', icon: siLangchain },
  { name: 'GitHub', position: 'github', icon: siGithub },
  { name: 'React', position: 'react', icon: siReact },
  { name: 'FastAPI', position: 'fastapi', icon: siFastapi },
] as const

function TechnologyIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      className="resume-tech-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ color: `#${icon.hex}` }}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}

export function ResumeScrollStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLImageElement>(null)
  const ballRef = useRef<HTMLImageElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const phaseRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const [auxiliaryMediaReady, setAuxiliaryMediaReady] = useState(false)
  const frames = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => `resume-scroll/frames/resume-${String(index).padStart(2, '0')}.webp`),
    [],
  )

  useEffect(() => {
    if (reducedMotion) {
      setAuxiliaryMediaReady(false)
      return
    }

    const preload = (sources: string[]) => sources.forEach((source) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = source
    })

    let earlyFramesReady = false
    let remainingFramesReady = false
    let idleId = 0
    let fallbackId = 0

    const loadEarlyFrames = () => {
      if (earlyFramesReady) return
      earlyFramesReady = true
      preload(frames.slice(1, 4))
      setAuxiliaryMediaReady(true)
    }

    const scheduleEarlyFrames = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(loadEarlyFrames, { timeout: 1800 })
      } else {
        fallbackId = globalThis.setTimeout(loadEarlyFrames, 350)
      }
    }

    const handleCriticalLoad = () => scheduleEarlyFrames()
    if (document.readyState === 'complete') scheduleEarlyFrames()
    else window.addEventListener('load', handleCriticalLoad, { once: true })

    // The intro completion is the earliest point at which the resume interaction
    // becomes available, so prepare only the next three frames at that boundary.
    window.addEventListener('portfolio:intro-complete', loadEarlyFrames, { once: true })

    const loadRemaining = () => {
      loadEarlyFrames()
      if (remainingFramesReady) return
      remainingFramesReady = true
      preload(frames.slice(4))
      interactionEvents.forEach((event) => window.removeEventListener(event, loadRemaining))
    }
    const interactionEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    interactionEvents.forEach((event) => window.addEventListener(event, loadRemaining, { once: true, passive: true }))

    return () => {
      window.removeEventListener('load', handleCriticalLoad)
      window.removeEventListener('portfolio:intro-complete', loadEarlyFrames)
      interactionEvents.forEach((event) => window.removeEventListener(event, loadRemaining))
      if (idleId) window.cancelIdleCallback(idleId)
      if (fallbackId) window.clearTimeout(fallbackId)
    }
  }, [frames, reducedMotion])

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const card = cardRef.current
    const paper = paperRef.current
    const ball = ballRef.current
    const shadow = shadowRef.current
    const progressLine = progressRef.current
    const phase = phaseRef.current
    if (!section || !sticky || !card || !paper || !ball || !shadow || !progressLine || !phase || reducedMotion) return

    const back = section.querySelector<HTMLElement>('.resume-paper-back')
    const desk = section.querySelector<HTMLElement>('.resume-desk-scene')
    const header = section.querySelector<HTMLElement>('.resume-story-header')
    const message = section.querySelector<HTMLElement>('.resume-story-message')
    const messageLines = gsap.utils.toArray<HTMLElement>('.resume-message-line > span', section)
    const messageNote = section.querySelector<HTMLElement>('.resume-message-note')
    const marks = gsap.utils.toArray<HTMLElement>('.resume-tech-mark', section)
    const aboutGrid = document.querySelector<HTMLElement>('#about .about-grid')
    if (!back || !desk || !header || !message || !messageNote) return

    let currentFrame = -1
    const frameState = { value: 0 }
    const updateFrame = () => {
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frameState.value)))
      if (frameIndex !== currentFrame) {
        if (currentFrame === -1 && frameIndex === 0) {
          currentFrame = 0
          return
        }
        currentFrame = frameIndex
        if (frameIndex > 0) {
          paper.removeAttribute('srcset')
          paper.removeAttribute('sizes')
        }
        paper.src = frames[frameIndex]
      }
    }

    const context = gsap.context(() => {
      gsap.set(sticky, {
        yPercent: 0,
        scale: 1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: '0 1.4rem 3rem rgb(20 12 5 / 0%)',
        transformOrigin: '50% 0%',
      })
      gsap.set(card, { y: '16vh', rotationZ: -5, rotationY: 180, scale: 0.72, opacity: 1 })
      gsap.set(back, { opacity: 1 })
      gsap.set(paper, { opacity: 0 })
      gsap.set(ball, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 })
      gsap.set(shadow, { x: 0, y: '8vh', scaleX: 0.72, scaleY: 0.35, opacity: 0 })
      gsap.set(message, { opacity: 1 })
      gsap.set(messageLines, { y: 24, opacity: 0 })
      gsap.set(messageNote, { y: 12, opacity: 0 })
      gsap.set(marks, { y: 12, scale: 0.94, opacity: 0 })
      if (aboutGrid) gsap.set(aboutGrid, { y: 50 })

      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

      timeline
        .addLabel('document')
        .to(card, { y: '-2vh', rotationZ: 0, scale: 1, duration: 1.2, ease: 'power3.out' })
        .to(card, { rotationY: 0, scale: 1.08, duration: 1.45, ease: 'power3.inOut' }, 'resume')
        .to(back, { opacity: 0, duration: 0.08 }, 'resume+=0.66')
        .to(paper, { opacity: 1, duration: 0.08 }, 'resume+=0.66')
        .addLabel('resume', 1.2)
        .to(card, { scale: 1.12, rotationZ: -1.2, duration: 0.75, ease: 'power2.out' })
        .addLabel('scatter')
        .to(frameState, { value: FRAME_COUNT - 1, duration: 3.15, ease: 'power2.inOut', onUpdate: updateFrame })
        .addLabel('crumple')
        .set(ball, { opacity: 1 })
        .to(card, { opacity: 0, duration: 0.14, ease: 'power1.out' })
        .addLabel('drop')
        .to(ball, { x: '3vw', y: '-6vh', rotation: 9, duration: 0.46, ease: 'power2.out' })
        .to(shadow, { x: '3vw', y: '8vh', scaleX: 0.58, scaleY: 0.28, opacity: 0.16, duration: 0.46, ease: 'power2.out' }, '<')
        .to(ball, { x: '8vw', y: '30vh', rotation: 30, duration: 0.62, ease: 'power3.in' })
        .to(shadow, { x: '8vw', y: '35vh', scaleX: 1.04, scaleY: 0.42, opacity: 0.38, duration: 0.62, ease: 'power3.in' }, '<')
        .to(ball, { scaleX: 1.025, scaleY: 0.96, duration: 0.1, ease: 'power1.out' })
        .to(ball, { y: '26.5vh', scaleX: 1, scaleY: 1, rotation: 35, duration: 0.26, ease: 'power2.out' })
        .to(shadow, { scaleX: 0.82, scaleY: 0.34, opacity: 0.25, duration: 0.26, ease: 'power2.out' }, '<')
        .to(ball, { y: '30vh', rotation: 39, duration: 0.28, ease: 'power2.in' })
        .to(shadow, { scaleX: 1, scaleY: 0.4, opacity: 0.36, duration: 0.28, ease: 'power2.in' }, '<')
        .to(ball, { y: '29.35vh', duration: 0.12, ease: 'power1.out' })
        .to(ball, { y: '30vh', rotation: 41, duration: 0.16, ease: 'power1.in' })
        .addLabel('message')
        .to(messageLines[0], { y: 0, opacity: 1, duration: 0.62, ease: 'power4.out' })
        .to(messageLines[1], { y: 0, opacity: 1, duration: 0.62, ease: 'power4.out' }, '-=0.49')
        .to(messageLines[2], { y: 0, opacity: 1, duration: 0.62, ease: 'power4.out' }, '-=0.49')
        .to(messageNote, { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out' }, '-=0.24')
        .addLabel('logos')
        .to(marks.slice(0, 2), { y: 0, scale: 1, opacity: 1, duration: 0.42, stagger: 0.08, ease: 'power3.out' })
        .to(marks.slice(2, 4), { y: 0, scale: 1, opacity: 1, duration: 0.42, stagger: 0.08, ease: 'power3.out' }, '-=0.18')
        .to(marks.slice(4, 6), { y: 0, scale: 1, opacity: 1, duration: 0.42, stagger: 0.08, ease: 'power3.out' }, '-=0.18')
        .to(marks.slice(6), { y: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'power3.out' }, '-=0.18')
        .addLabel('hold')
        .to({}, { duration: 2.15 })
        .addLabel('exit')
        .to(ball, { x: '51vw', y: '43vh', rotation: 210, duration: 1.35, ease: 'power2.inOut' })
        .to(shadow, { x: '51vw', y: '48vh', scaleX: 1.18, opacity: 0.18, duration: 1.35, ease: 'power2.inOut' }, '<')
        .addLabel('transition')
        .to(sticky, {
          yPercent: -68,
          scale: 0.71,
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
          boxShadow: '0 1rem 2.25rem rgb(20 12 5 / 22%)',
          duration: 2.1,
          ease: 'none',
        }, 'transition')

      if (aboutGrid) timeline.to(aboutGrid, { y: 0, duration: 2.1, ease: 'none' }, 'transition')

      const duration = timeline.duration()
      timeline.to(desk, { scale: 1.075, duration, ease: 'none' }, 0)
      timeline.to(header, { y: -16, opacity: 0, duration: 0.7, ease: 'power2.in' }, 1.55)

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        animation: timeline,
        scrub: 0.28,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressLine.style.transform = `scaleX(${self.progress})`
          if (self.progress < 0.17) phase.textContent = 'Approach the source'
          else if (self.progress < 0.31) phase.textContent = 'Turn the record'
          else if (self.progress < 0.49) phase.textContent = 'Compress the paper'
          else if (self.progress < 0.64) phase.textContent = 'Land with weight'
          else if (self.progress < 0.88) phase.textContent = 'Research. Build. Deploy.'
          else phase.textContent = 'Continue to the portfolio'
        },
      })

      return () => {
        trigger.kill()
        timeline.kill()
      }
    }, section)

    updateFrame()
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => context.revert()
  }, [frames, reducedMotion])

  if (reducedMotion) {
    return (
      <section className="resume-story reduced" aria-labelledby="resume-story-title">
        <div className="resume-reduced-shell">
          <header className="resume-reduced-header">
            <p>01 / SOURCE DOCUMENT</p>
            <h2 id="resume-story-title">The work begins with the <em>record.</em></h2>
          </header>
          <div className="resume-reduced-layout">
            <figure className="resume-reduced-document">
              <img
                src="resume-scroll/responsive/resume-00-720.webp"
                srcSet="resume-scroll/responsive/resume-00-480.webp 480w, resume-scroll/responsive/resume-00-720.webp 720w, resume-scroll/frames/resume-00.webp 1000w"
                sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) 46vw, 34rem"
                alt="Kottu Saikumar's resume"
                width="1000"
                height="1415"
                fetchPriority="high"
                decoding="sync"
              />
              <figcaption>Curriculum Vitae / Source 01</figcaption>
            </figure>
            <div className="resume-reduced-summary">
              <h3>Research. Build. Deploy.</h3>
              <p>AI systems built for real problems</p>
              <a href={personal.resume} target="_blank" rel="noreferrer">
                Read resume <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className={`resume-story${reducedMotion ? ' reduced' : ''}`} aria-labelledby="resume-story-title">
      <div ref={stickyRef} className="resume-story-sticky">
        <div className="resume-desk-scene" aria-hidden="true">
          <div className="resume-cutting-mat" />
          <div className="desk-plant"><i /><i /><i /><i /></div>
          <span className="desk-object desk-note" />
          <span className="desk-object desk-pen" />
          <span className="desk-object desk-clip desk-clip-one" />
          <span className="desk-object desk-clip desk-clip-two" />
          <span className="desk-object desk-eraser" />
          <span className="desk-object desk-coffee" />
          <span className="desk-object desk-receipts" />
        </div>
        <header className="resume-story-header">
          <p>01 / SOURCE DOCUMENT</p>
          <h2 id="resume-story-title">The work begins with the <em>record.</em></h2>
        </header>
        <div className="resume-story-message">
          <h2 aria-label="Research. Build. Deploy.">
            <span className="resume-message-line"><span>RESEARCH.</span></span>
            <span className="resume-message-line"><span>BUILD.</span></span>
            <span className="resume-message-line"><span>DEPLOY.</span></span>
          </h2>
          <p className="resume-message-note">AI systems built for real problems</p>
        </div>
        <ul className="resume-tech-marks" aria-hidden="true">
          {technologyMarks.map((technology) => (
            <li className={`resume-tech-mark resume-tech-${technology.position}`} key={technology.name}>
              <TechnologyIcon icon={technology.icon} />
            </li>
          ))}
        </ul>
        <div className="resume-paper-stage">
          <div ref={cardRef} className="resume-paper-card">
            <div className="resume-paper-face resume-paper-back" aria-hidden="true">
              <div className="resume-back-mark"><span>KS</span><small>CURRICULUM VITAE / SOURCE 01</small></div>
            </div>
            <img
              ref={paperRef}
              className="resume-paper-face resume-paper resume-paper-front"
              src="resume-scroll/responsive/resume-00-720.webp"
              srcSet="resume-scroll/responsive/resume-00-480.webp 480w, resume-scroll/responsive/resume-00-720.webp 720w, resume-scroll/frames/resume-00.webp 1000w"
              sizes="(max-width: 700px) 84vw, 38rem"
              alt="Kottu Saikumar's résumé"
              width="1000"
              height="1415"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
        <div className="resume-paper-ball-stage" aria-hidden="true">
          <span ref={shadowRef} className="resume-ball-shadow" />
          <img
            ref={ballRef}
            className="resume-paper-ball"
            src={auxiliaryMediaReady ? 'resume-scroll/responsive/resume-ball-240.webp' : undefined}
            srcSet={auxiliaryMediaReady ? 'resume-scroll/responsive/resume-ball-240.webp 240w, resume-scroll/responsive/resume-ball-360.webp 360w, resume-scroll/resume-ball.webp 483w' : undefined}
            sizes="(max-width: 700px) 9rem, 17rem"
            alt=""
            width="483"
            height="425"
            decoding="async"
          />
        </div>
        <div className="resume-story-footer" aria-hidden="true">
          <span ref={phaseRef}>Approach the source</span>
          <i><span ref={progressRef} /></i>
          <b>SCROLL</b>
        </div>
      </div>
    </section>
  )
}
