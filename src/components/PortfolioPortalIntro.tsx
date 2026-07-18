import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

const word = 'PORTFOLIO'.split('')

export function PortfolioPortalIntro() {
  const overlayRef = useRef<HTMLElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const portalORef = useRef<HTMLSpanElement>(null)
  const constructionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const overlay = overlayRef.current
    const field = fieldRef.current
    const wordmark = wordRef.current
    const portalO = portalORef.current
    const construction = constructionRef.current

    if (!overlay || !field || !wordmark || !portalO || !construction || reducedMotion) {
      setVisible(false)
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let context: gsap.Context | undefined
    let cancelled = false

    const buildTransition = async () => {
      await document.fonts.ready
      if (cancelled) return

      const wordRect = wordmark.getBoundingClientRect()
      const oRect = portalO.getBoundingClientRect()
      const oCenterX = oRect.left + oRect.width / 2
      const oCenterY = oRect.top + oRect.height / 2
      const centerDeltaX = window.innerWidth / 2 - oCenterX
      const centerDeltaY = window.innerHeight / 2 - oCenterY
      const originX = oCenterX - wordRect.left
      const originY = oCenterY - wordRect.top
      const viewportRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.72
      const portalState = { radius: 0 }
      const updateMask = () => field.style.setProperty('--portal-radius', `${portalState.radius}px`)

      context = gsap.context(() => {
        const horizontalGuides = construction.querySelectorAll('.portal-guide-horizontal')
        const verticalGuides = construction.querySelectorAll('.portal-guide-vertical')
        const constructionFrame = construction.querySelector('.portal-construction-frame')
        const outlineWord = construction.querySelector('.portal-outline-wordmark')

        gsap.set(wordmark, {
          transformOrigin: `${originX}px ${originY}px`,
          opacity: 0,
          force3D: true,
        })
        gsap.set(horizontalGuides, { scaleX: 0, transformOrigin: '50% 50%' })
        gsap.set(verticalGuides, { scaleY: 0, transformOrigin: '50% 50%' })
        gsap.set(constructionFrame, { scale: 0.92, opacity: 0 })
        gsap.set(outlineWord, { opacity: 0 })
        updateMask()

        const finish = () => {
          document.body.style.overflow = previousOverflow
          window.dispatchEvent(new CustomEvent('portfolio:intro-complete'))
          setVisible(false)
        }

        gsap.timeline({ onComplete: finish })
          .to(horizontalGuides, {
            scaleX: 1,
            duration: 0.28,
            stagger: 0.04,
            ease: 'power1.inOut',
          }, 0.1)
          .to(verticalGuides, {
            scaleY: 1,
            duration: 0.26,
            stagger: 0.04,
            ease: 'power1.inOut',
          }, 0.18)
          .to(constructionFrame, {
            scale: 1,
            opacity: 0.34,
            duration: 0.28,
            ease: 'power1.inOut',
          }, 0.2)
          .to(outlineWord, {
            opacity: 0.48,
            duration: 0.28,
            ease: 'power1.inOut',
          }, 0.28)
          .to(wordmark, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
          }, 0.86)
          .to(construction, {
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
          }, 0.9)
          .to({}, { duration: 0.08 })
          .to(wordmark, {
            x: centerDeltaX,
            y: centerDeltaY,
            scale: 1.25,
            duration: 0.34,
            ease: 'power2.inOut',
          })
          .to(wordmark, {
            scale: 7,
            duration: 0.42,
            ease: 'power2.inOut',
          })
          .to(wordmark, {
            scale: 28,
            duration: 0.46,
            ease: 'power3.in',
          })
          .to(portalState, {
            radius: viewportRadius,
            duration: 0.46,
            ease: 'power3.in',
            onUpdate: updateMask,
          }, '<')
          .to(wordmark, {
            opacity: 0,
            duration: 0.16,
            ease: 'none',
          }, '-=0.12')
          .to(overlay, {
            opacity: 0,
            duration: 0.1,
            ease: 'none',
          })
      }, overlay)
    }

    void buildTransition()

    return () => {
      cancelled = true
      context?.revert()
      document.body.style.overflow = previousOverflow
    }
  }, [reducedMotion])

  if (!visible || reducedMotion) return null

  return (
    <section ref={overlayRef} className="portal-intro" aria-label="Portfolio introduction" aria-live="polite">
      <div ref={fieldRef} className="portal-green-field" aria-hidden="true" />
      <div ref={constructionRef} className="portal-construction-mark" aria-hidden="true">
        <span className="portal-construction-line portal-guide-horizontal portal-guide-top" />
        <span className="portal-construction-line portal-guide-horizontal portal-guide-middle" />
        <span className="portal-construction-line portal-guide-horizontal portal-guide-bottom" />
        <span className="portal-construction-line portal-guide-vertical portal-guide-left" />
        <span className="portal-construction-line portal-guide-vertical portal-guide-center" />
        <span className="portal-construction-line portal-guide-vertical portal-guide-right" />
        <span className="portal-construction-frame" />
        <span className="portal-outline-wordmark">PORTFOLIO</span>
      </div>
      <div ref={wordRef} className="portal-wordmark" aria-label="Portfolio">
        {word.map((letter, index) => (
          <span key={`${letter}-${index}`} ref={index === 1 ? portalORef : undefined} aria-hidden="true">{letter}</span>
        ))}
      </div>
    </section>
  )
}
