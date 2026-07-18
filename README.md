# Kottu Saikumar - cinematic portfolio

A production-ready, editable React + TypeScript + Vite portfolio rebuilt from the supplied distribution and original media. It uses GSAP ScrollTrigger and Lenis for a cinematic, reversible desktop experience while preserving a semantic mobile and reduced-motion path.

## Highlights

- Reversible `PORTFOLIO` O portal into the hero.
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
- pnpm 10 or newer (npm also works if you generate an npm lockfile).

## Development

```bash
pnpm install
pnpm dev
```

Vite prints the local address. Open it in a modern browser.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

The production output is written to `dist/`.

## Content updates

All factual content and media paths live in `src/data/portfolio.ts`. Project video files are in `public/projects/videos/`, poster frames are in `public/projects/posters/`, and the book film is `public/media/three_clip_total_flow.mp4`.

Education, certification, live-demo, and availability data were not present in the supplied archive. Education is flagged as a placeholder in the central data file. No missing fact was invented.

## Deployment

This is a static Vite site. Use the following settings on any static host:

- Build command: `pnpm build`
- Publish directory: `dist`
- Node version: 20+

### Vercel

Import the repository, select the Vite preset, keep `pnpm build`, and publish `dist`.

### Netlify

Create a site from the repository with build command `pnpm build` and publish directory `dist`.

### GitHub Pages

If publishing under a repository subpath, set Vite's `base` option to `/<repository-name>/`, rebuild, and deploy `dist` with a Pages workflow. For a custom domain or user site, the default `/` base is correct.

## Accessibility and motion

- One H1 and logical H2/H3 hierarchy.
- Skip link, visible focus styles, semantic sections, lists, definitions, navigation, and footer.
- Project and audio controls are keyboard-operable.
- No autoplay audio and no forced scroll snapping.
- A no-JavaScript fallback exposes identity, project links, and email.
- Reduced motion replaces the scrubbed book journey with five normal-flow project articles and native video controls.

## Performance notes

- Hero uses responsive AVIF media with fixed dimensions.
- Below-the-fold imagery is lazy-loaded.
- The book film preloads metadata only.
- Project videos use `preload="none"` until active and inactive videos pause.
- All scroll animation uses transform, opacity, clip-path, or media time; React state is not updated every animation frame.

## Research

The `docs/research/` directory contains the required scene timeline, transition map, motion tokens, scroll budgets, media/content inventories, asset/component maps, responsive and reduced-motion plans, risk list, and implementation plan. Each distinguishes observed behavior, PDF documentation, and implementation inference.
