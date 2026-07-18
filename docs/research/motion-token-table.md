# Motion token table

| Token | Value | Source |
|---|---:|---|
| `ease-enter` | cubic-bezier(0.16, 1, 0.3, 1) | PDF-documented |
| `ease-body` | cubic-bezier(0.22, 1, 0.36, 1) | PDF-documented |
| `ease-media` | cubic-bezier(0.77, 0, 0.18, 1) | PDF-documented |
| `ease-ui` | cubic-bezier(0.25, 0.1, 0.25, 1) | PDF-documented |
| `duration-line` | 700 ms | PDF-documented |
| `duration-body` | 650 ms | PDF-documented |
| `stagger-line` | 90 ms | PDF-documented |
| `distance-enter` | 24 px | PDF-documented |
| `scale-media-from` | 1.04 | Inferred, within documented 1.02-1.08 range |
| `parallax-near` | 3% viewport delta | Inferred, intentionally restrained |
| `parallax-deep` | 8% viewport delta | PDF-documented |
| `pill-hover` | 1.02 / 180 ms | Observed + PDF-documented |
| `pill-press` | 0.98 / 120 ms | Observed + PDF-documented |
| `lenis-duration` | 1.15 s desktop only | Reference-validated |
| `scrub-lag` | 0.35-0.6 s | Inferred |

## Rules

- **Observed:** Motion pauses while content is meant to be read.
- **PDF-documented:** Transform and opacity are primary; no independent scroll listeners; one primary motion per viewport.
- **Inferred:** Reversible animation is reserved for the portal and book film. Ordinary reveal content plays once.
