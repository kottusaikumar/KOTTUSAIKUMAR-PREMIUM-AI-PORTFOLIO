# Responsive plan

## Desktop (>= 1024 px)

- Full portal scrub, pinned catalogue/timeline, 900 vh book journey, two-page project overlay.
- Project video occupies the left page without a device shell; HTML details occupy the right page.
- Persistent pill is bottom-center and clear of safe areas.

## Tablet (768-1023 px)

- Shorter pins and lower parallax depth.
- Two-page project layout retained only when readable; perspective is reduced.
- Skills and timeline labels remain sticky but release earlier.

## Mobile (< 768 px)

- Portal scale is shorter; no long mask tunnel.
- Normal document flow replaces long catalogue/timeline pins.
- Book film becomes a cinematic header/poster followed by stacked project video and details.
- Controls are at least 44 px; pill uses `env(safe-area-inset-bottom)`.

## Evidence

- **Observed:** only the desktop reference was captured.
- **PDF-documented:** mobile behavior is inferred in the source audit, including stacked catalogue rows and a near-full-width bottom pill.
- **Inferred:** breakpoints and exact stacking decisions above are tailored to this portfolio.

