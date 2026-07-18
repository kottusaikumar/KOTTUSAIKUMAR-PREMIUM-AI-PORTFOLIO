# Asset map

| Source | Destination | Consumer | Loading |
|---|---|---|---|
| recovered `/images/hero/*` | `public/images/hero/*` | CinematicHero | first AVIF high priority; others lazy |
| recovered portrait WebPs | `public/images/about/*` | AboutSection | lazy |
| recovered Vajra logo WebP | `public/images/branding/*` | ExperienceTimeline | lazy |
| recovered five MP4s | `public/projects/videos/*` | ProjectVideo | none/metadata when active |
| recovered intro MP3 | `public/audio/about-intro.mp3` | AudioControl | none until user action |
| uploaded book film | `public/media/three_clip_total_flow.mp4` | BookProjectJourney | metadata |
| recovered favicons | `public/*` | document metadata | browser-managed |

## Excluded

- **Observed in source:** compiled JS/CSS bundles are not reused.
- **Inferred:** 150 phone-scrub JPEGs are excluded because the new brief explicitly bans phone frames and because the sequence is a large nonessential payload.
- Reference PDFs/video remain under research inputs only and are never published.

