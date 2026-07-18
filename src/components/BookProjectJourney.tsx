import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ProjectVideo } from './ProjectVideo'
import { MediaErrorFallback } from './MediaErrorFallback'

const filmTimeline: Array<[number, number]> = [
  [0, 0], [0.075, 5], [0.135, 9], [0.17, 9], [0.18, 10.4], [0.28, 10.4],
  [0.345, 13], [0.375, 13], [0.39, 14.2], [0.49, 14.2],
  [0.545, 17.5], [0.575, 17.5], [0.59, 19], [0.72, 19],
  [0.7201, 23.8], [0.77, 23.8], [0.79, 25], [0.89, 25],
  [0.91, 28], [0.94, 28], [0.95, 29.2], [1, 29.2],
]

const cnnCoverStart = 0.72
const cnnCoverEnd = 0.79

type OverlayWindow = {
  enterStart: number
  enterEnd: number
  exitStart?: number
  exitEnd?: number
  hardExit?: boolean
}

const overlayWindows: OverlayWindow[] = [
  { enterStart: 0.182, enterEnd: 0.205, exitStart: 0.263, exitEnd: 0.282 },
  { enterStart: 0.392, enterEnd: 0.415, exitStart: 0.473, exitEnd: 0.492 },
  // Keep the Deep Learning spread opaque while the source film seeks past its
  // unusable in-between frames. Reveal only the decoded, clean CNN cover.
  { enterStart: 0.592, enterEnd: 0.615, exitStart: 0.72, exitEnd: 0.72, hardExit: true },
  { enterStart: 0.792, enterEnd: 0.815, exitStart: 0.873, exitEnd: 0.892 },
  { enterStart: 0.952, enterEnd: 0.975 },
]

const pageGeometry = [
  { center: '49.7%', width: '63.8%', top: '7.8%', bottom: '8.5%' },
  { center: '49.7%', width: '62.3%', top: '7.7%', bottom: '8.7%' },
  { center: '49.7%', width: '63.7%', top: '7.5%', bottom: '8.5%' },
  { center: '49.7%', width: '51.0%', top: '20.5%', bottom: '14.5%' },
  { center: '49.7%', width: '49.8%', top: '23.5%', bottom: '14.5%' },
] as const

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

function smoothstep(start: number, end: number, value: number) {
  const progress = clamp((value - start) / (end - start))
  return progress * progress * (3 - 2 * progress)
}

function filmTimeAt(progress: number) {
  for (let index = 1; index < filmTimeline.length; index += 1) {
    const previous = filmTimeline[index - 1]
    const next = filmTimeline[index]
    if (progress <= next[0]) {
      const local = clamp((progress - previous[0]) / (next[0] - previous[0]))
      const eased = local * local * (3 - 2 * local)
      return previous[1] + (next[1] - previous[1]) * eased
    }
  }
  return filmTimeline[filmTimeline.length - 1][1]
}

function overlayStateAt(progress: number) {
  for (let index = 0; index < overlayWindows.length; index += 1) {
    const { enterStart, enterEnd, exitStart, exitEnd, hardExit } = overlayWindows[index]
    if (progress >= enterStart && (exitEnd === undefined || progress <= exitEnd)) {
      const enter = smoothstep(enterStart, enterEnd, progress)
      const leave = exitStart !== undefined && exitEnd !== undefined
        ? hardExit
          ? (progress < exitStart ? 1 : 0)
          : 1 - smoothstep(exitStart, exitEnd, progress)
        : 1
      const opacity = Math.min(enter, leave)
      const scale = 0.9 + (0.1 * enter)
      return { index, opacity, scale, y: (1 - enter) * 10 - ((1 - leave) * 4) }
    }
  }
  return { index: -1, opacity: 0, scale: 0.9, y: 10 }
}

// Desktop-only: lets the pointer scroll the case-study content that lives inside the
// pinned book stage without fighting the outer Lenis-driven page scroll. While the
// internal content has room left to move, wheel input is trapped and applied directly
// to the container; once it hits its top/bottom boundary the event is left alone so it
// bubbles to Lenis/ScrollTrigger and the outer cinematic timeline resumes.
function useBookPageScroll(
  scrollRef: RefObject<HTMLDivElement | null>,
  railRef: RefObject<HTMLDivElement | null>,
  thumbRef: RefObject<HTMLDivElement | null>,
  active: boolean,
  skip: boolean,
) {
  useEffect(() => {
    const el = scrollRef.current
    if (!el || skip) return

    let idleTimer = 0
    let rafId = 0

    const setRailVisibility = (mode: 'idle' | 'active' | 'hidden') => {
      const rail = railRef.current
      if (!rail) return
      rail.classList.toggle('is-active', mode === 'active')
      rail.classList.toggle('is-idle', mode === 'idle')
      rail.classList.toggle('is-hidden', mode === 'hidden')
    }

    const updateRail = () => {
      rafId = 0
      const thumb = thumbRef.current
      if (!thumb) return
      const maxScroll = el.scrollHeight - el.clientHeight
      if (maxScroll <= 1) {
        setRailVisibility('hidden')
        return
      }
      const ratio = el.clientHeight / el.scrollHeight
      const thumbHeightPct = Math.max(ratio * 100, 10)
      const progress = clamp(el.scrollTop / maxScroll)
      thumb.style.height = `${thumbHeightPct}%`
      thumb.style.top = `${progress * (100 - thumbHeightPct)}%`
      setRailVisibility('active')
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => setRailVisibility('idle'), 1400)
    }

    const scheduleRailUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(updateRail)
    }

    const handleWheel = (event: WheelEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight
      if (maxScroll <= 1) return

      const goingDown = event.deltaY > 0
      const atBottom = el.scrollTop >= maxScroll - 1
      const atTop = el.scrollTop <= 1

      // At a boundary, in the direction of travel: release control so the outer
      // cinematic scroll (Lenis + ScrollTrigger) picks up the same gesture.
      if ((goingDown && atBottom) || (!goingDown && atTop)) return

      event.preventDefault()
      event.stopPropagation()
      el.scrollTop += event.deltaY
      scheduleRailUpdate()
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('scroll', scheduleRailUpdate, { passive: true })

    const resizeObserver = new ResizeObserver(scheduleRailUpdate)
    resizeObserver.observe(el)
    scheduleRailUpdate()

    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('scroll', scheduleRailUpdate)
      resizeObserver.disconnect()
      window.clearTimeout(idleTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset to the top exactly once when this project becomes the active one. Runs only
  // on the false -> true transition, never repeatedly while it stays active.
  useEffect(() => {
    if (!skip && active && scrollRef.current) scrollRef.current.scrollTop = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

function ProjectDetails({
  project,
  active,
  mobile = false,
  mediaReady,
  overlayRef,
  index = 0,
}: {
  project: Project
  active: boolean
  mobile?: boolean
  mediaReady: boolean
  overlayRef?: (node: HTMLElement | null) => void
  index?: number
}) {
  const geometry = pageGeometry[index]
  const pageStyle = mobile ? undefined : ({
    '--page-center': geometry.center,
    '--page-width': geometry.width,
    '--page-top': geometry.top,
    '--page-bottom': geometry.bottom,
  } as CSSProperties)

  const scrollRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const keyboardScrollable = !mobile && active
  const reducedMotion = useReducedMotion()

  useBookPageScroll(scrollRef, railRef, thumbRef, active, mobile || reducedMotion)

  return (
    <article
      ref={overlayRef}
      className={mobile ? 'mobile-project' : `book-overlay book-overlay-${index + 1} book-overlay-compact`}
      style={pageStyle}
      aria-hidden={!mobile && !active}
    >
      <div className="book-left-page">
        <div className="project-media-label"><span>Project film</span><span>{project.number} / 05</span></div>
        <ProjectVideo project={project} active={active} mediaReady={mediaReady} controls={mobile} />
      </div>
      <div className="book-right-page">
        <div
          ref={scrollRef}
          className="project-page-scroll"
          tabIndex={mobile ? undefined : active ? 0 : -1}
          aria-label={keyboardScrollable ? `${project.title} project details` : undefined}
        >
          <div className="project-number"><span>{project.number} / 05</span><span>{project.book}</span></div>
          <h3>{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <dl className="project-facts">
            <div><dt>Focus</dt><dd>{project.focus}</dd></div>
            <div><dt>Highlight</dt><dd>{project.highlight}</dd></div>
          </dl>
          <div className="tag-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
          {project.details.length > 0 && (
            <div className="project-detail-groups">
              {project.details.map((detail) => (
                <section className="project-detail-group" key={detail.label}>
                  <h4>{detail.label}</h4>
                  <ul>{detail.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
          )}
          <div className="project-links">
            <a href={project.github} target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a>
            {project.live && <a href={project.live} target="_blank" rel="noreferrer">View demo <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
        {!mobile && (
          <div ref={railRef} className="page-scroll-rail" aria-hidden="true">
            <div ref={thumbRef} className="page-scroll-thumb" />
          </div>
        )}
      </div>
    </article>
  )
}

export function BookProjectJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const bookVideoRef = useRef<HTMLVideoElement>(null)
  const bookCanvasRef = useRef<HTMLCanvasElement>(null)
  const bookFreezeRef = useRef<HTMLImageElement>(null)
  const overlayRefs = useRef<Array<HTMLElement | null>>([])
  const targetTimeRef = useRef(0)
  const progressRef = useRef(0)
  const activeRef = useRef(-1)
  const [active, setActive] = useState(-1)
  const [filmFailed, setFilmFailed] = useState(false)
  const [projectMediaReady, setProjectMediaReady] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setProjectMediaReady(true)
      observer.disconnect()
    }, { rootMargin: '1200px 0px 1200px 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const video = bookVideoRef.current
    const canvas = bookCanvasRef.current
    const freezeFrame = bookFreezeRef.current
    if (!section || !video || !canvas || !freezeFrame || reducedMotion) return

    const media = gsap.matchMedia()

    // Everything below only runs for the cinematic desktop layout. On tablet/mobile the
    // pinned stage is display:none, so we never touch the 21 MB book video at all.
    media.add('(min-width: 981px)', () => {
      const frameProbe = document.createElement('canvas')
      frameProbe.width = 32
      frameProbe.height = 18
      const frameProbeContext = frameProbe.getContext('2d', { willReadFrequently: true })
      let cnnCoverDecoded = freezeFrame.complete && freezeFrame.naturalWidth > 0
      let armed = false
      let seekFrame = 0

      const handleCnnCoverReady = () => {
        cnnCoverDecoded = true
        if (progressRef.current >= cnnCoverStart && progressRef.current < cnnCoverEnd) {
          freezeFrame.style.opacity = '1'
        }
      }

      const paintFrame = () => {
        if (!video.videoWidth || !video.videoHeight) return
        frameProbeContext?.drawImage(video, 0, 0, frameProbe.width, frameProbe.height)
        const pixels = frameProbeContext?.getImageData(0, 0, frameProbe.width, frameProbe.height).data
        if (pixels) {
          let luminance = 0
          for (let index = 0; index < pixels.length; index += 4) {
            luminance += (pixels[index] * 0.2126) + (pixels[index + 1] * 0.7152) + (pixels[index + 2] * 0.0722)
          }
          const averageLuminance = luminance / (pixels.length / 4)
          if (averageLuminance < 12) return
        }
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.style.opacity = '1'
      }

      const applyOverlays = (progress: number) => {
        const scene = overlayStateAt(progress)
        const visibleScene = scene.opacity > 0.002 ? scene.index : -1

        overlayRefs.current.forEach((overlay, index) => {
          if (!overlay) return
          const visible = index === visibleScene
          overlay.style.opacity = visible ? `${scene.opacity}` : '0'
          overlay.style.visibility = visible ? 'visible' : 'hidden'
          overlay.style.pointerEvents = visible && scene.opacity > 0.85 ? 'auto' : 'none'
          overlay.style.transform = visible
            ? `translate3d(-50%, ${scene.y}px, 0) scale(${scene.scale})`
            : 'translate3d(-50%, 10px, 0) scale(.9)'
        })

        if (visibleScene !== activeRef.current) {
          activeRef.current = visibleScene
          setActive(visibleScene)
        }
      }

      const flushSeek = () => {
        seekFrame = 0
        if (video.readyState < 1 || video.seeking) return
        if (Math.abs(video.currentTime - targetTimeRef.current) >= 1 / 48) {
          video.currentTime = targetTimeRef.current
        } else {
          paintFrame()
        }
      }
      const scheduleSeek = () => {
        if (!seekFrame) seekFrame = requestAnimationFrame(flushSeek)
      }
      const handleSeeked = () => {
        paintFrame()
        if (Math.abs(video.currentTime - targetTimeRef.current) >= 1 / 48) scheduleSeek()
      }
      // Fetch the book video only once the section
      // is genuinely about to be scrolled into view, so it never competes with initial load.
      const armMedia = () => {
        if (armed) return
        armed = true
        video.preload = 'auto'
        video.src = 'media/book-scroll-optimized.mp4'
        video.load()
      }

      const intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          armMedia()
          intersectionObserver.disconnect()
        }
      }, { rootMargin: '800px 0px 800px 0px' })
      intersectionObserver.observe(section)

      video.addEventListener('seeked', handleSeeked)
      video.addEventListener('loadeddata', paintFrame)
      freezeFrame.addEventListener('load', handleCnnCoverReady)

      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress
          progressRef.current = progress
          targetTimeRef.current = filmTimeAt(progress)
          freezeFrame.style.opacity = cnnCoverDecoded && progress >= cnnCoverStart && progress < cnnCoverEnd ? '1' : '0'
          section.style.setProperty('--shelf-progress', `${progress}`)
          section.style.setProperty('--heading-opacity', `${1 - smoothstep(0.075, 0.155, progress)}`)

          // Approaching the shelf while the clip is still loading: arm it immediately
          // so scrubbing doesn't stall waiting on the IntersectionObserver.
          if (!armed && progress > 0) armMedia()

          if (video.readyState >= 1 && Math.abs(video.currentTime - targetTimeRef.current) >= 1 / 48) {
            scheduleSeek()
          }

          applyOverlays(progress)
        },
      })

      return () => {
        video.removeEventListener('seeked', handleSeeked)
        video.removeEventListener('loadeddata', paintFrame)
        freezeFrame.removeEventListener('load', handleCnnCoverReady)
        intersectionObserver.disconnect()
        scrollTrigger.kill()
        cancelAnimationFrame(seekFrame)
      }
    })

    return () => {
      media.revert()
    }
  }, [reducedMotion])

  const refresh = () => {
    const video = bookVideoRef.current
    if (video) video.currentTime = targetTimeRef.current
    ScrollTrigger.refresh()
  }

  return (
    <section ref={sectionRef} className="book-journey" id="projects" aria-labelledby="projects-title">
      <div className="book-sticky">
        <header className="book-heading">
          <p className="eyebrow">04 / Tangibility</p>
          <h2 id="projects-title">Five projects. <em>One cinematic shelf.</em></h2>
        </header>
        <div className="book-stage">
          {filmFailed ? <MediaErrorFallback label="Book journey" /> : (
            <video
              ref={bookVideoRef}
              className="book-film book-film-source"
              poster={projectMediaReady ? 'media/book-poster.jpg' : undefined}
              muted
              playsInline
              preload="none"
              width="1280"
              height="720"
              aria-label="A cinematic shelf of five technical books opening one at a time"
              onLoadedMetadata={refresh}
              onError={() => setFilmFailed(true)}
            />
          )}
          <img className="book-film book-film-poster" src={projectMediaReady ? 'media/book-poster.jpg' : undefined} alt="" aria-hidden="true" width="1280" height="720" loading="lazy" decoding="async" />
          <canvas ref={bookCanvasRef} className="book-film book-film-canvas" aria-hidden="true" />
          <img ref={bookFreezeRef} className="book-film book-film-freeze" src={projectMediaReady ? 'media/book-cnn-cover.webp' : undefined} alt="" aria-hidden="true" width="1280" height="720" decoding="async" />
          <div className="book-shade" aria-hidden="true" />
          <div className="book-overlays">
            {projects.map((project, index) => (
              <ProjectDetails
                project={project}
                index={index}
                active={active === index}
                mediaReady={projectMediaReady}
                overlayRef={(node) => { overlayRefs.current[index] = node }}
                key={project.id}
              />
            ))}
          </div>
          <div className="book-scroll-cue" aria-hidden="true"><span>Travel through the shelf</span><i /></div>
          <div className="book-progress" aria-label={active >= 0 ? `Project ${active + 1} of ${projects.length}` : 'Five project shelf'}>
            {projects.map((project, index) => <span className={active === index ? 'active' : ''} key={project.id}>{project.number}</span>)}
          </div>
        </div>
      </div>
      <div className="mobile-book-intro">
        <img src={projectMediaReady ? 'media/book-poster.jpg' : undefined} alt="Five technical books representing the selected portfolio projects" width="1280" height="720" loading="lazy" />
      </div>
      <div className="mobile-project-list">
        {projects.map((project, index) => (
          <ProjectDetails project={project} index={index} active mediaReady={projectMediaReady} mobile key={project.id} />
        ))}
      </div>
    </section>
  )
}
