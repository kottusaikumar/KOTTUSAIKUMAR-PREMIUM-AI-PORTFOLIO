import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { proof } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { PROOF_FLOW_QUERY, PROOF_PIN_QUERY } from '../config/responsive'

gsap.registerPlugin(ScrollTrigger)

export function ProofWall() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky || reducedMotion) return

    const media = gsap.matchMedia()

    const createTimeline = (pinned: boolean) => {
      const chapterSheet = section.querySelector<HTMLElement>('.proof-chapter-sheet')
      const proofPage = section.querySelector<HTMLElement>('.proof-page')
      const exitSheet = section.querySelector<HTMLElement>('.proof-exit-sheet')
      const label = section.querySelector<HTMLElement>('.proof-label')
      const headline = section.querySelector<HTMLElement>('.proof-heading')
      const lines = gsap.utils.toArray<HTMLElement>('.proof-line > span', section)
      const note = section.querySelector<HTMLElement>('.proof-note')
      const cards = gsap.utils.toArray<HTMLElement>('.proof-card', section)
      const visuals = gsap.utils.toArray<HTMLElement>('.proof-visual', section)
      if (!chapterSheet || !proofPage || !exitSheet || !label || !headline || !note || cards.length !== 4 || visuals.length !== 4) return

      const travel = pinned ? (window.innerWidth < 1100 ? 96 : 148) : 34
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      const headlineRect = headline.getBoundingClientRect()
      const headlineCenter = {
        x: headlineRect.left + headlineRect.width / 2,
        y: headlineRect.top + headlineRect.height / 2,
      }
      const visualOriginOffsets = [
        { x: -46, y: -32 },
        { x: 44, y: -28 },
        { x: -52, y: 34 },
        { x: 48, y: 38 },
      ]

      gsap.set(chapterSheet, { yPercent: pinned ? 0 : -102 })
      gsap.set(proofPage, { yPercent: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 })
      gsap.set(label, { y: 0, opacity: 1 })
      gsap.set(lines, { y: 0, opacity: 1 })
      gsap.set(note, { y: 0, opacity: 1 })
      gsap.set(cards[0], { x: -travel, y: pinned ? -88 : 28, rotation: -10, scale: 0.94, opacity: 0 })
      gsap.set(cards[1], { x: travel, y: pinned ? -78 : 28, rotation: 9, scale: 0.94, opacity: 0 })
      gsap.set(cards[2], { x: -travel * 1.08, y: pinned ? 112 : 28, rotation: 8, scale: 0.93, opacity: 0 })
      gsap.set(cards[3], { x: travel * 1.08, y: pinned ? 122 : 28, rotation: -9, scale: 0.93, opacity: 0 })
      visuals.forEach((visual, index) => {
        const visualRect = visual.getBoundingClientRect()
        const origin = visualOriginOffsets[index]
        gsap.set(visual, {
          x: headlineCenter.x - (visualRect.left + visualRect.width / 2) + origin.x,
          y: headlineCenter.y - (visualRect.top + visualRect.height / 2) + origin.y,
          rotation: [-7, 6, 6, -7][index],
          scale: 0.28,
          opacity: 0,
          clipPath: 'inset(38% round 1rem)',
          filter: 'blur(7px) saturate(.7) brightness(.62)',
        })
      })

      timeline
        .addLabel('enter')
        .to(chapterSheet, { yPercent: -110, duration: pinned ? 0.24 : 0.01, ease: 'power3.inOut' })
        .addLabel('visuals', pinned ? 0.08 : 0)
        .to(visuals, {
          x: 0,
          y: 0,
          rotation: (index) => [-4, 3, 3, -3][index],
          scale: 1,
          opacity: (index) => [0.72, 0.68, 0.66, 0.7][index],
          clipPath: 'inset(0% round 1rem)',
          filter: 'blur(0px) saturate(.82) brightness(.76)',
          duration: 1.42,
          stagger: 0.11,
          ease: 'power3.out',
        })
        .addLabel('upperCards', '-=0.62')
        .to(cards[0], { x: 0, y: 0, rotation: -4, scale: 1, opacity: 1, duration: 0.92, ease: 'power3.out' })
        .to(cards[1], { x: 0, y: 0, rotation: 3, scale: 1, opacity: 1, duration: 0.92, ease: 'power3.out' }, '-=0.76')
        .addLabel('lowerCards', '-=0.16')
        .to(cards[2], { x: 0, y: 0, rotation: 2, scale: 1, opacity: 1, duration: 0.98, ease: 'power3.out' })
        .to(cards[3], { x: 0, y: 0, rotation: -3, scale: 1, opacity: 1, duration: 0.98, ease: 'power3.out' }, '-=0.8')
        .addLabel('hold')
        .to(headline, { y: pinned ? -4 : 0, duration: pinned ? 3.45 : 0.7, ease: 'none' })
        .to(cards[0], { y: pinned ? -10 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(cards[1], { y: pinned ? -14 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(cards[2], { y: pinned ? 16 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(cards[3], { y: pinned ? 21 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(visuals[0], { x: pinned ? 18 : 0, y: pinned ? -9 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(visuals[1], { x: pinned ? -14 : 0, y: pinned ? 8 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(visuals[2], { x: pinned ? 12 : 0, y: pinned ? -10 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')
        .to(visuals[3], { x: pinned ? -18 : 0, y: pinned ? 12 : 0, duration: pinned ? 3.45 : 0.01, ease: 'none' }, '<')

      if (pinned) {
        timeline
          .addLabel('exit')
          .to(cards[0], { x: -travel * 0.78, y: -72, opacity: 0.28, duration: 0.9, ease: 'power2.in' })
          .to(cards[1], { x: travel * 0.78, y: -68, opacity: 0.28, duration: 0.9, ease: 'power2.in' }, '<')
          .to(cards[2], { x: -travel * 0.86, y: 96, opacity: 0.2, duration: 0.9, ease: 'power2.in' }, '<')
          .to(cards[3], { x: travel * 0.86, y: 104, opacity: 0.2, duration: 0.9, ease: 'power2.in' }, '<')
          .to(visuals[0], { x: -travel * 1.45, y: -92, rotation: -8, opacity: 0, duration: 1.02, ease: 'power2.in' }, '<')
          .to(visuals[1], { x: travel * 1.45, y: -78, rotation: 7, opacity: 0, duration: 1.02, ease: 'power2.in' }, '<')
          .to(visuals[2], { x: -travel * 1.55, y: 112, rotation: 7, opacity: 0, duration: 1.02, ease: 'power2.in' }, '<')
          .to(visuals[3], { x: travel * 1.55, y: 118, rotation: -7, opacity: 0, duration: 1.02, ease: 'power2.in' }, '<')
          .to(proofPage, { yPercent: -104, borderBottomLeftRadius: '5rem', borderBottomRightRadius: '5rem', duration: 1.28, ease: 'power3.inOut' }, 'exit+=0.42')
      }

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: pinned ? 'top top' : 'top 78%',
        end: pinned ? () => `+=${Math.round(window.innerHeight * (window.innerWidth < 1100 ? 4.3 : 5.05))}` : 'bottom 24%',
        pin: pinned ? sticky : false,
        animation: timeline,
        scrub: pinned ? 0.35 : false,
        toggleActions: pinned ? undefined : 'play none none reverse',
        invalidateOnRefresh: true,
        anticipatePin: pinned ? 1 : 0,
      })

      if (!pinned && section.getBoundingClientRect().top <= window.innerHeight * 0.78) {
        timeline.play()
      }

      return () => {
        trigger.kill()
        timeline.kill()
      }
    }

    media.add(PROOF_PIN_QUERY, () => createTimeline(true))
    media.add(PROOF_FLOW_QUERY, () => createTimeline(false))
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => media.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={`proof-section${reducedMotion ? ' reduced' : ''}`} id="proof" aria-labelledby="proof-title">
      <div ref={stickyRef} className="proof-sticky">
        <div className="proof-exit-sheet" aria-hidden="true" />
        <div className="proof-page">
          <div className="proof-field" aria-hidden="true" />
          <div className="proof-chapter-sheet" aria-hidden="true" />
          <div className="section-shell proof-layout">
            <ul className="proof-visuals" aria-hidden="true">
              <li className="proof-visual proof-visual-1"><img src="images/proof-motion/resume-screening.webp" alt="" width="960" height="640" loading="lazy" decoding="async" /></li>
              <li className="proof-visual proof-visual-2"><img src="images/proof-motion/rag-archive.webp" alt="" width="960" height="640" loading="lazy" decoding="async" /></li>
              <li className="proof-visual proof-visual-3"><img src="images/proof-motion/food-vision.webp" alt="" width="960" height="640" loading="lazy" decoding="async" /></li>
              <li className="proof-visual proof-visual-4"><img src="images/proof-motion/analytics-deployment.webp" alt="" width="960" height="640" loading="lazy" decoding="async" /></li>
            </ul>
            <div className="proof-heading">
              <p className="eyebrow proof-label">06 / Evidence</p>
              <h2 id="proof-title">
                <span className="proof-line"><span>Measured</span></span>
                <span className="proof-line"><span>outcomes,</span></span>
                <em className="proof-line"><span>stated plainly.</span></em>
              </h2>
              <p className="proof-note">No invented impact. Only values recovered from the supplied portfolio.</p>
            </div>
            <ul className="proof-orbit" aria-label="Verified portfolio outcomes">
              {proof.map((item, index) => (
                <li className={`proof-card proof-${index + 1}`} key={item.label}>
                  <strong>{item.value}</strong><span>{item.label}</span><p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
