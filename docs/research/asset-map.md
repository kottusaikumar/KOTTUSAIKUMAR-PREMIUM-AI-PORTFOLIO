# Asset map

| Source | Destination | Consumer | Loading |
|---|---|---|---|
| social preview artwork | `public/images/hero/full-stack-ai-developer-1350w.webp` | document metadata | social crawlers |
| recovered portrait assets | `public/images/about/about-portrait-back.webp`, `about-portrait-cutout.png` | AboutSection | lazy |
| recovered Vajra logo WebP | `public/images/branding/*` | ExperienceTimeline | lazy |
| recovered five MP4s | `public/projects/videos/*` | ProjectVideo | none/metadata when active |
| recovered intro MP3 | `public/audio/about-intro.mp3` | AudioControl | none until user action |
| optimized book film | `public/media/book-scroll-optimized.mp4` | BookProjectJourney | loaded near the desktop Projects section |
| résumé animation frames | `public/resume-scroll/frames/*`, `responsive/*` | ResumeScrollStory | staged preload by viewport and interaction |
| recovered favicons | `public/*` | document metadata | browser-managed |

## Excluded

- **Observed in source:** compiled JS/CSS bundles are not reused.
- Unreferenced legacy hero variants, source films, portrait variants, and prototype media are not published.
- Reference PDFs/video remain under research inputs only and are never published.
