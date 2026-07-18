import { useId, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface TextMorphProps {
  words: string[]
  activeIndex: number
  /** Morph (blur/scale/opacity cross-fade) duration in seconds. */
  duration?: number
  className?: string
  tag?: 'h2' | 'h3' | 'span' | 'div'
}

/**
 * Morphs between `words[activeIndex]` using a blurred cross-fade (gooey
 * text effect) driven by GSAP. Fully controlled — the parent owns which
 * word is active and how long it stays visible, so the title and the
 * skill grid never fall out of sync.
 */
export function TextMorph({ words, activeIndex, duration = 0.8, className = '', tag = 'h2' }: TextMorphProps) {
  const filterId = useId().replace(/:/g, '')
  const currentRef = useRef<HTMLSpanElement>(null)
  const incomingRef = useRef<HTMLSpanElement>(null)
  const incomingTextRef = useRef<HTMLSpanElement>(null)
  const prevIndexRef = useRef(activeIndex)
  const reducedMotion = useReducedMotion()
  const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  useLayoutEffect(() => {
    const current = currentRef.current
    const incoming = incomingRef.current
    const incomingText = incomingTextRef.current
    if (!current || !incoming || !incomingText) return

    if (prevIndexRef.current === activeIndex) {
      current.textContent = words[activeIndex]
      return
    }

    if (reducedMotion) {
      current.textContent = words[activeIndex]
      prevIndexRef.current = activeIndex
      return
    }

    incomingText.textContent = words[activeIndex]
    gsap.set(incoming, { opacity: 0, filter: 'blur(14px)', scale: 1.04 })
    gsap.set(current, { opacity: 1, filter: 'blur(0px)', scale: 1 })

    const tl = gsap.timeline({
      defaults: { duration, ease: 'power2.inOut' },
      onComplete: () => {
        current.textContent = words[activeIndex]
        gsap.set(current, { opacity: 1, filter: 'blur(0px)', scale: 1 })
        gsap.set(incoming, { opacity: 0 })
      },
    })
    tl.to(current, { opacity: 0, filter: 'blur(14px)', scale: 0.97 }, 0)
    tl.to(incoming, { opacity: 1, filter: 'blur(0px)', scale: 1 }, 0)

    prevIndexRef.current = activeIndex

    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  return (
    <span className={`text-morph ${className}`}>
      {/* Stable width placeholder sized to the longest role — prevents layout shift. */}
      <span className="text-morph-spacer" aria-hidden="true">{longestWord}</span>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </svg>
      <span className="text-morph-stack" style={{ filter: `url(#${filterId})` }} aria-hidden="true">
        <span className="text-morph-layer" ref={currentRef} />
        <span className="text-morph-layer" ref={incomingRef}>
          <span ref={incomingTextRef} />
        </span>
      </span>
      {/* Single accessible label for the active role — screen readers never hear duplicate copies. */}
      <Tag className="sr-only" tag={tag}>
        <span role="status" aria-live="polite" aria-atomic="true">{words[activeIndex]}</span>
      </Tag>
    </span>
  )
}

interface TagProps extends HTMLAttributes<HTMLElement> {
  tag: 'h2' | 'h3' | 'span' | 'div'
  children?: ReactNode
}

function Tag({ tag, children, ...rest }: TagProps) {
  const Component = tag
  return <Component {...rest}>{children}</Component>
}
