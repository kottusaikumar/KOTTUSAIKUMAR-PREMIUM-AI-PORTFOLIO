# Media inventory

## Uploaded media

| Asset | Facts | Use |
|---|---|---|
| `zero.university_website_video.mp4` | 79.51 s, 1920x1020, 29.97 fps, H.264, AAC stereo | Research only; never shipped |
| `three_clip_total_flow.mp4` | 30.04 s, 1280x720, 24 fps, H.264, AAC stereo | Signature book background, muted and scrubbed |

## Recovered portfolio media

| Asset group | Count / size notes | Use |
|---|---|---|
| Hero art | 4 subjects x AVIF/WebP/PNG responsive variants | Hero rotating identity visual; AVIF/WebP preferred |
| About portraits | Front/back PNG + WebP | Editorial portrait reveal; WebP shipped |
| Project videos | 5 MP4s, roughly 2.5-2.8 MB each | One active video per open book; muted/playsinline |
| Audio introduction | `about-intro.mp3`, 1.64 MB | User-triggered only |
| Brand logo | Vajra.ai PNG + WebP | Experience evidence |
| Contact phone frames | 150 JPEGs | Not used: conflicts with the no-phone-frame direction and adds decode cost |
| Icons | Favicon, apple touch icon | Metadata and browser UI |

## Book film timeline - directly observed

- 0-8 s: five upright books in a futuristic study.
- 8-11 s: NLP book isolates and opens.
- 11-15 s: RAG book rotates in and opens.
- 16-21 s: Deep Learning book isolates, opens, and holds.
- 22-26 s: CNN book rotates in and opens.
- 27-30 s: UI/UX book rotates in and opens.
- Strong cut boundaries occur near 10.03 s and 20.03 s, matching the three source-clip joins.

## Inferred loading policy

- Book film is `preload="metadata"`, not fetched as an LCP asset.
- Project videos are `preload="none"` until their overlay is active.
- At most one project video plays. All inactive videos pause and reset only when far outside the active segment.
- Poster fallbacks use still frames or the first decoded frame where an explicit poster is not available.

