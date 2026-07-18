# Implementation plan

1. Build a clean React + TypeScript + Vite source project; do not reuse the old compiled bundle.
2. Copy only inventoried content/media into a structured `public` tree.
3. Define typed factual data in `src/data/portfolio.ts`, including placeholder flags for missing education/live demos.
4. Establish accessible color, typography, spacing, radius, z-index, media, and motion tokens.
5. Render the full semantic document before adding animation.
6. Initialize GSAP ScrollTrigger and Lenis once, with fine-pointer/reduced-motion guards and cleanup.
7. Add the reversible `PORTFOLIO` O portal and hero handoff.
8. Add persistent navigation and user-controlled audio.
9. Add About, Skills, and Experience/Education acts with pin/release behavior on large screens.
10. Add the five-book pinned journey with piecewise media timing, five overlay holds, one active project video, and a stacked fallback.
11. Add Process, verified Proof, and Contact acts.
12. Validate responsive flow, keyboard order, focus, media failures, resize behavior, forward/reverse scrolling, reduced motion, lint, typecheck, and production build.

## Evidence labels

- **Observed:** visual pacing, portal behavior, catalogue hold, media expansion, proof ecosystem, final sheet transition.
- **PDF-documented:** easing recipes, duration ranges, scroll architecture, media loading, accessibility and reduced-motion rules.
- **Inferred:** project-specific composition, exact scroll budgets, breakpoints, media mapping, and React boundaries.

