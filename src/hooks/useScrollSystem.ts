import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function useScrollSystem() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.9 })
    const onScroll = () => ScrollTrigger.update()
    const tick = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', onScroll)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', onScroll)
      lenis.destroy()
    }
  }, [reducedMotion])

  return reducedMotion
}
