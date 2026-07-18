# Transition map

## Directly observed

1. Green field -> typographic counter: scale/letter-counter portal, not fade-to-black.
2. Portal -> tactile desk: the incoming scene is visible through the expanding counter.
3. Desk statement -> diploma: shared physical environment; only foreground content changes.
4. Diploma -> oversized type: the object folds/exits before type owns the frame.
5. Green promise -> cream catalogue: hard chapter color change.
6. Catalogue -> immersive media: heading appears first; rounded media rises and expands.
7. Immersive media -> proof UI: full-bleed image contracts/reframes into interface surfaces.
8. Proof UI -> value ecosystem: foreground elements disperse while central copy takes priority.
9. Cream value -> final green: a rounded paper sheet lifts to reveal the final field.

## PDF-documented

- Color hard-cuts are preferred between chapters; adjacent green acts use content-only handoffs.
- Standard exit is `translateY(-5% to -8%)` plus opacity during the final 10-15%.
- Media reveal is a scrubbed clip-path/scale change, usually inset 8-12% to zero and scale 1.04-1.08 to 1.
- Sticky headers release only after their body/catalogue completes.

## Inferred implementation

- Portal: CSS mask/clip layering plus GSAP scale; reduced motion swaps to a short opacity handoff.
- Standard section entrance: line wrappers translate from 110% and settle; semantic text remains intact.
- Projects: project overlay fades out before the media time advances to the next open book.
- Final act: cream proof sheet uses a rounded top edge and sticky upward reveal into the dark-green CTA.

