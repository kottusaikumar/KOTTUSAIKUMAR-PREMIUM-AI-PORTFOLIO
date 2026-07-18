# Performance risk list

| Risk | Severity | Mitigation | Basis |
|---|---|---|---|
| 30 s book MP4 blocks first paint | High | metadata preload only; poster/loading layer; initialize scrub after metadata | Inferred |
| Five project videos decode together | High | preload none; play only active video; pause on leave | PDF-documented |
| 900 vh pin causes mobile jank | High | disable desktop journey below 768 px and in reduced motion | Inferred |
| ScrollTrigger duplicates in React StrictMode | High | GSAP context cleanup and centralized initializer | Brief/PDF |
| Smooth scroll fights touch/native inertia | Medium | Lenis desktop fine-pointer only | PDF-documented |
| Hero art over-delivery | Medium | responsive AVIF/WebP and dimensions | Recovered source + PDF |
| Split text harms accessibility | Medium | semantic authored line wrappers; no character splitter | PDF-documented |
| `will-change` retains too many layers | Medium | apply only to active pinned/media elements | PDF-documented |
| Remote fonts delay paint | Medium | system/local fallback-first stack; no blocking font request | Inferred |
| Video currentTime seeks thrash | Medium | requestAnimationFrame scheduling and delta threshold | Inferred |
| Broken media hides content | High | visible HTML fallback and error message | Brief |

