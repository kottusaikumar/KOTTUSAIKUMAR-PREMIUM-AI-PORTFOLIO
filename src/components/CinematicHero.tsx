import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { personal, roles } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function CinematicHero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    let interval: number | undefined
    const initialHold = window.setTimeout(() => {
      setRoleIndex((current) => (current + 1) % roles.length)
      interval = window.setInterval(() => setRoleIndex((current) => (current + 1) % roles.length), 3600)
    }, 10000)
    return () => {
      window.clearTimeout(initialHold)
      if (interval) window.clearInterval(interval)
    }
  }, [reducedMotion])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || reducedMotion) return

    const copyElements = hero.querySelectorAll('.hero-reveal')
    const headlineLines = hero.querySelectorAll('.hero-line > span')
    const visual = hero.querySelector('.hero-visual')
    const character = hero.querySelector('.hero-character')
    const frames = hero.querySelectorAll('.hero-resume-frame')
    const index = hero.querySelector('.hero-index')
    let timeline: gsap.core.Timeline | undefined

    gsap.set(copyElements, { opacity: 0, y: 24 })
    gsap.set(headlineLines, { yPercent: 112, rotate: 1.5 })
    gsap.set(visual, { clipPath: 'inset(0 0 0 100%)' })
    gsap.set(character, { opacity: 0, xPercent: 8, scale: 1.08, filter: 'blur(10px)' })
    gsap.set(frames, { opacity: 0, scale: 0.78, y: 34 })
    gsap.set(index, { opacity: 0 })

    const play = () => {
      if (fallback) window.clearTimeout(fallback)
      timeline?.kill()
      timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(visual, { clipPath: 'inset(0 0 0 0%)', duration: 0.85, ease: 'power2.inOut' }, 0)
        .to(frames, { opacity: 0.92, scale: 1, y: 0, duration: 0.72, stagger: 0.1 }, 0.16)
        .to(copyElements, { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 }, 0.22)
        .to(headlineLines, { yPercent: 0, rotate: 0, duration: 0.84, stagger: 0.1 }, 0.3)
        .to(character, { opacity: 1, xPercent: 0, scale: 1, filter: 'blur(0px)', duration: 1.08 }, 0.54)
        .to(index, { opacity: 1, duration: 0.4 }, 0.88)
        .to(frames, { opacity: 0.16, scale: 0.96, duration: 0.7, stagger: 0.06 }, 1.45)
    }

    window.addEventListener('portfolio:intro-complete', play, { once: true })
    const fallback = window.setTimeout(play, 6800)

    return () => {
      window.removeEventListener('portfolio:intro-complete', play)
      window.clearTimeout(fallback)
      timeline?.kill()
    }
  }, [reducedMotion])

  return (
    <section ref={heroRef} className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-reveal">{personal.name} <span>/</span> {personal.location}</p>
        <h1 id="hero-title">
          <span className="hero-line"><span>Engineering</span></span>
          <span className="hero-line"><span>intelligence into</span></span>
          <em className="hero-line"><span>usable systems.</span></em>
        </h1>
        <div className="role-rotator hero-reveal" aria-live="polite">{roles[roleIndex]}</div>
        <p className="hero-note hero-reveal">{personal.heroNote}</p>
        <div className="hero-actions hero-reveal">
          <a className="button primary" href="#projects">View selected work</a>
          <a className="button ghost" href={personal.resume} target="_blank" rel="noreferrer">Open resume</a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-blueprint" aria-hidden="true" />
        <div className="hero-resume-frame hero-frame-skills" aria-hidden="true">
          <span>CORE STACK</span><strong>PY / SQL</strong><small>ML · RAG · React</small>
        </div>
        <div className="hero-resume-frame hero-frame-proof" aria-hidden="true">
          <span>VERIFIED RESULT</span><strong>94%</strong><small>CNN accuracy</small>
        </div>
        <picture className="hero-character">
          <source media="(max-width: 640px)" srcSet="images/hero/full-stack-ai-developer-480w.avif" type="image/avif" />
          <source media="(max-width: 1100px)" srcSet="images/hero/full-stack-ai-developer-900w.avif" type="image/avif" />
          <source srcSet="images/hero/full-stack-ai-developer-1350w.avif" type="image/avif" />
          <img src="images/hero/full-stack-ai-developer-1350w.webp" alt="Full-Stack AI Developer character artwork representing Kottu Saikumar" width="1350" height="1800" fetchPriority="high" decoding="async" />
        </picture>
        <span className="hero-index" aria-hidden="true">KS / 01</span>
      </div>
      <a className="scroll-hint" href="#about">Scroll to explore <span aria-hidden="true">↓</span></a>
    </section>
  )
}
