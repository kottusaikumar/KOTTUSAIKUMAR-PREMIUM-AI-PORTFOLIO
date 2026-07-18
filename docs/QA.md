# QA record

## Automated

- TypeScript project check: passed.
- ESLint with zero warnings: passed.
- Vite production build: passed.
- Browser console: no warnings or errors during desktop/mobile inspection.

## Browser checks

- Desktop intro and portal composition inspected at the default desktop viewport.
- Hero and About anchor entry inspected.
- Book film progress verified through a late hold at `currentTime = 29.2` with one active project overlay.
- Reverse scroll verified by a decreasing book-film time (`29.2` to `23.60`).
- Responsive resize verified at 390 x 844: five project articles switch to a readable vertical layout with native video controls.
- Mobile horizontal overflow: 0 px.
- Skip link resolves as a focusable anchor; all controls use native button/link elements and visible `:focus-visible` styling.
- Reduced-motion implementation verified by code path: Lenis and scrub setup do not initialize, and the five normal-flow project articles are displayed by the CSS media branch.

## Content checks

- Five projects are ordered exactly as NLP, RAG, Deep Learning, CNN, UI/UX.
- No phone frame assets are used.
- Audio does not autoplay.
- No unverified live links, certifications, availability statements, outcomes, or education facts were added.
