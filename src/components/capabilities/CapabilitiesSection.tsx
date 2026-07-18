import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { roles, skills, skillsForRole, certifications } from '../../data/capabilities'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { TextMorph } from './TextMorph'
import { SkillTile } from './SkillTile'
import './capabilities.css'

gsap.registerPlugin(ScrollTrigger)

const ROLE_HOLD_MS = 2600
const MORPH_MS = 800

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const [activeRoleIndex, setActiveRoleIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [manualRole, setManualRole] = useState<number | null>(null)

  const cyclingEnabled = !reducedMotion && manualRole === null

  // Single synchronized timer drives both the title morph and the grid highlight.
  useEffect(() => {
    if (!cyclingEnabled || !inView) return
    const id = window.setTimeout(() => {
      setActiveRoleIndex((i) => (i + 1) % roles.length)
    }, ROLE_HOLD_MS + MORPH_MS)
    return () => window.clearTimeout(id)
  }, [cyclingEnabled, inView, activeRoleIndex])

  const displayedRoleIndex = manualRole ?? activeRoleIndex
  const activeRole = roles[displayedRoleIndex]
  const activeSkillIds = useMemo(() => skillsForRole(activeRole.id), [activeRole])

  // Pause/resume cycling based on viewport visibility — do not restart on every tiny intersection change.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Entrance timeline: label -> title -> panel -> tile stagger.
  //
  // Root cause of the empty grid: `.skill-tile` in capabilities.css declares a
  // CSS `transition` on `opacity`/`transform` (for the role-highlight
  // crossfade). GSAP also drives `opacity`/`transform` directly via inline
  // styles for this entrance stagger. Every animation frame GSAP writes a new
  // inline value, and each write re-triggers the CSS transition, so the
  // browser keeps chasing a moving target and the tiles visually never
  // leave their opacity:0 "from" state even though the GSAP timeline
  // reports onComplete. Fix: the CSS transition only applies once
  // `.is-revealed` is present (added below on entrance completion), so
  // nothing fights the entrance tween while it's running. `clearProps` then
  // hands the properties back to CSS so later role-driven restyling animates
  // via the (now safe) CSS transition instead of stale inline styles.
  useEffect(() => {
    const section = sectionRef.current
    const panel = panelRef.current
    if (!section || !panel) return

    const reveal = () => panel.classList.add('is-revealed')

    if (reducedMotion) {
      // No JS-driven animation runs, so nothing needs to be released later.
      reveal()
      return
    }

    const context = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 78%', once: true } })
      tl.from('.capabilities-eyebrow', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' })
        .from('.capabilities-title-row', { opacity: 0, y: 16, duration: 0.55, ease: 'power2.out' }, '-=0.25')
        .from(panel, { opacity: 0, y: 28, duration: 0.6, ease: 'expo.out' }, '-=0.2')
        .from('.skill-tile', {
          opacity: 0,
          y: 10,
          duration: 0.4,
          stagger: 0.012,
          ease: 'power1.out',
          clearProps: 'opacity,transform',
        }, '-=0.3')
        .add(reveal)
    }, section)

    // Safety net: if the ScrollTrigger never fires (offscreen edge cases,
    // a killed context, or any other GSAP/ScrollTrigger failure) the grid
    // must still become visible rather than staying stuck at opacity 0.
    const fallback = window.setTimeout(() => {
      gsap.set([section.querySelectorAll('.skill-tile'), '.capabilities-eyebrow', '.capabilities-title-row', panel], {
        clearProps: 'opacity,transform',
      })
      reveal()
    }, 6000)

    return () => {
      window.clearTimeout(fallback)
      context.revert()
    }
  }, [reducedMotion])

  const featuredIds = activeRole.featuredSkillIds

  return (
    <section className="capabilities-section" id="capabilities" ref={sectionRef} aria-labelledby="capabilities-title">
      <div className="section-shell capabilities-shell">
        <p className="eyebrow capabilities-eyebrow">02 / CAPABILITIES</p>

        <div className="capabilities-title-row" id="capabilities-title">
          <TextMorph
            words={roles.map((r) => r.label)}
            activeIndex={displayedRoleIndex}
            tag="h2"
            className="capabilities-role-title"
          />
        </div>

        {reducedMotion ? (
          <div className="capabilities-role-filters" role="group" aria-label="Filter skills by role">
            {roles.map((role, index) => (
              <button
                key={role.id}
                type="button"
                className={index === displayedRoleIndex ? 'is-active' : ''}
                onClick={() => setManualRole(index)}
                aria-pressed={index === displayedRoleIndex}
              >
                {role.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="capabilities-panel" ref={panelRef}>
          <div
            className="skill-grid"
            key={activeRole.id}
            role="list"
            aria-label={`Skills, highlighting those used as a ${activeRole.label}`}
          >
            {skills.map((skill) => {
              const isActive = activeSkillIds.has(skill.id)
              const isFeatured = isActive && featuredIds.includes(skill.id)
              return (
                <SkillTile
                  key={skill.id}
                  skill={skill}
                  isActive={isActive}
                  isFeatured={isFeatured}
                  usePeel={false}
                  useCssFold={false}
                  accent={activeRole.accent}
                />
              )
            })}
          </div>
        </div>

        <div className="capabilities-certifications">
          <p className="capabilities-certifications-label">Certifications &amp; Training</p>
          <ul>
            {certifications.map((cert) => (
              <li key={cert.title}>
                <span className="cert-title">{cert.title}</span>
                <span className="cert-issuer"> — {cert.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
