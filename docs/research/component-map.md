# Component map

## Inferred implementation architecture

```text
App
|- PortfolioPortalIntro
|- PersistentPillNav
|- ResumeScrollStory
|- AboutSection
|  `- AudioControl
|- CapabilitiesSection
|  |- TextMorph
|  `- SkillTile
|- ExperienceTimeline
|- BookProjectJourney
|  |- ProjectBookOverlay
|     |- ProjectVideo
|     `- MediaErrorFallback
|- ProcessSection
|  `- KineticGrid
|- ProofWall
|- ContactSection
`- PortfolioAssistant
```

## Shared primitives

- `Reveal`: IntersectionObserver/GSAP entrance, content visible without JS.
- `useReducedMotion`: one media-query source shared by motion components.
- `useMediaQuery`: shared responsive mode selection.
- `useScrollSystem`: single Lenis/GSAP/ScrollTrigger bootstrap with cleanup.

## Source distinctions

- **PDF-documented:** section/container/reveal/pinned-title/media-frame taxonomy and single scroll orchestrator.
- **Observed:** persistent pill, pinned catalogue, full-bleed media, chapter color changes.
- **Inferred:** exact React component boundaries and data contracts.
