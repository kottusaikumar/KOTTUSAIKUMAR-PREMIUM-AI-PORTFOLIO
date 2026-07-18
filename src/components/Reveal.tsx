import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) return
    const context = gsap.context(() => {
      gsap.fromTo(element, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, delay, ease: 'expo.out',
        scrollTrigger: { trigger: element, start: 'top 86%', once: true },
      })
    }, element)
    return () => context.revert()
  }, [delay, reducedMotion])

  return <div className={className} ref={ref}>{children}</div>
}
