# Component map

## Inferred implementation architecture

```text
App
|- LoadingScreen
|- PortfolioPortalIntro
|- CinematicHero
|- PersistentPillNav
|  |- AudioControl
|- AboutSection
|- SkillsCatalogue
|- ExperienceTimeline
|- BookProjectJourney
|  |- ProjectBookOverlay
|     |- ProjectVideo
|     `- MediaErrorFallback
|- ProcessSection
|- ProofWall
`- ContactSection
   `- Footer
```

## Shared primitives

- `Reveal`: IntersectionObserver/GSAP entrance, content visible without JS.
- `SplitLines`: authored semantic line wrappers; no destructive character splitting.
- `MediaFrame`: aspect ratio, clipping, loading and failure state.
- `useReducedMotion`: one media-query source shared by motion components.
- `initSmoothScroll`: single Lenis/GSAP/ScrollTrigger bootstrap with cleanup.

## Source distinctions

- **PDF-documented:** section/container/reveal/pinned-title/media-frame taxonomy and single scroll orchestrator.
- **Observed:** persistent pill, pinned catalogue, full-bleed media, chapter color changes.
- **Inferred:** exact React component boundaries and data contracts.

