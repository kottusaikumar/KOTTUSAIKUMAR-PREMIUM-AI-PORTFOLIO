# Kottu Saikumar - cinematic portfolio

A production-ready, editable React + TypeScript + Vite portfolio rebuilt from the supplied distribution and original media. It uses GSAP ScrollTrigger and Lenis for a cinematic, reversible desktop experience while preserving a semantic mobile and reduced-motion path.

**Live portfolio:** [https://kottusaikumar.github.io/KOTTUSAIKUMAR-PREMIUM-AI-PORTFOLIO/](https://kottusaikumar.github.io/KOTTUSAIKUMAR-PREMIUM-AI-PORTFOLIO/)

## Highlights

- `PORTFOLIO` O portal into the scroll-controlled résumé story.
- Editorial About, Skills, Experience, Process, Proof, and Contact acts.
- Scroll-controlled 30-second five-book journey with five stable project reading holds.
- Five real project videos; only the active video plays.
- User-controlled spoken introduction; audio never autoplays.
- Responsive desktop, tablet, and mobile compositions.
- `prefers-reduced-motion` disables smooth scrolling, long pins, parallax, and media scrubbing.
- Central typed content in `src/data/portfolio.ts`.
- Full research record in `docs/research/`.

## Prerequisites

- Node.js 20 or newer.
- npm 10 or newer.

## Development

```bash
npm install
npm run dev
```

Vite prints the local address. Open it in a modern browser.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

The production output is written to `dist/`.

## Content updates

All factual content and media paths live in `src/data/portfolio.ts`. Project video files are in `public/projects/videos/`, poster frames are in `public/projects/posters/`, and the desktop book film is `public/media/book-scroll-optimized.mp4`.

Education, certification, live-demo, and availability data were not present in the supplied archive. Education is flagged as a placeholder in the central data file. No missing fact was invented.

## Deployment

This is a static Vite site. Use the following settings on any static host:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20+

### Vercel

Import the repository, select the Vite preset, keep `npm run build`, and publish `dist`.

### Netlify

Create a site from the repository with build command `npm run build` and publish directory `dist`.

### GitHub Pages

The included workflow builds with npm and publishes `dist` to the `gh-pages` branch. Vite uses relative asset URLs so the same build works under this repository subpath.

## Accessibility and motion

- One H1 and logical H2/H3 hierarchy.
- Skip link, visible focus styles, semantic sections, lists, definitions, navigation, and footer.
- Project and audio controls are keyboard-operable.
- No autoplay audio and no forced scroll snapping.
- A no-JavaScript fallback exposes identity, project links, and email.
- Reduced motion replaces the scrubbed book journey with five normal-flow project articles and native video controls.

## Performance notes

- The first résumé frame is responsive, preloaded, and rendered with fixed dimensions.
- Below-the-fold imagery is lazy-loaded.
- The book film preloads metadata only.
- Project videos use `preload="none"` until active and inactive videos pause.
- All scroll animation uses transform, opacity, clip-path, or media time; React state is not updated every animation frame.

## Research

The `docs/research/` directory contains the required scene timeline, transition map, motion tokens, scroll budgets, media/content inventories, asset/component maps, responsive and reduced-motion plans, risk list, and implementation plan. Each distinguishes observed behavior, PDF documentation, and implementation inference.
