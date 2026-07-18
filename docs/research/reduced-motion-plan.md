# Reduced-motion plan

## PDF-documented baseline

- Disable parallax, scrub, marquee, magnetic behavior, and smooth scrolling.
- Replace motion reveals with immediate or short opacity changes.
- Preserve navigation, headings, focus order, and all content.

## Portfolio implementation

- Portal: static `PORTFOLIO` title followed by a simple hero crossfade.
- Skills/experience: normal flow; no pinned distance.
- Book journey: static film poster plus five stacked project articles; videos use native controls and never autoplay.
- Persistent pill: no transform animation; hover color change only.
- Counters: render final values immediately.
- All hidden animation initial states are scoped under `.motion-ready`, so content remains visible if JavaScript fails.

## Validation

- Emulate `prefers-reduced-motion: reduce` in browser tests.
- Confirm every project and link is reachable by keyboard without traversing artificial scroll space.

