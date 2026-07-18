# Five-book cinematic shelf motion audit

## Reference findings

- The supplied 27.06-second zero.university capture uses one continuous media field rather than a sequence of hard cuts.
- Its projects act begins with an editorial setup, lets the media scale into full bleed, then keeps the camera drifting while foreground cards enter, settle, overlap briefly, and release.
- Readable content is still during its hold. Motion is concentrated in the background camera and in short entrance/exit windows.
- The persistent bottom control stays visually independent from the scene.

## Source-film findings

- `three_clip_total_flow.mp4` is a 30.04-second, 1280x720, 23.99 fps H.264 film containing the complete journey: five-book establishing shot, NLP open, RAG travel/open, Deep Learning travel/open, CNN travel/open, and UI/UX travel/open.
- The original stream used a conventional inter-frame GOP structure. Continuous `currentTime` changes therefore required the browser to decode from earlier keyframes, producing visible seek jumps.
- No narrative frames were missing. The defect was random-access density, so synthetic visual generation was not appropriate.

## Implemented timing map

| Scroll progress | Film time | Scene |
|---:|---:|---|
| 0.00-0.12 | 0.0-8.0 s | Establish all five books and slowly approach NLP |
| 0.12-0.18 | 8.0-10.4 s | NLP opens |
| 0.18-0.28 | 10.4 s hold | NLP video and details grow onto the pages |
| 0.28-0.38 | 10.4-14.2 s | Pull out and travel to RAG |
| 0.38-0.48 | 14.2 s hold | RAG page content |
| 0.48-0.58 | 14.2-19.0 s | Travel to Deep Learning |
| 0.58-0.68 | 19.0 s hold | Deep Learning page content |
| 0.68-0.78 | 19.0-25.0 s | Travel to CNN |
| 0.78-0.88 | 25.0 s hold | CNN page content |
| 0.88-0.96 | 25.0-29.2 s | Travel to UI/UX |
| 0.96-1.00 | 29.2 s hold | UI/UX page content |

## Technical correction

- Added `book-scroll-optimized.mp4`, encoded at 24 fps with every frame as an I-frame for deterministic forward and reverse seeking.
- Scroll updates are coalesced into one animation-frame commit.
- The project overlay starts only after the physical pages are visible, grows from 74% to 100%, holds at full size, then fades during release.
- The section uses a 980-vh runway, Lenis duration 1.15 seconds, and no scroll snapping.

## Validation

- All five desktop page states were measured at a 720-pixel viewport height: each details page had `scrollHeight === clientHeight` (506 px), with no nested overflow.
- Forward frame test across the NLP opening produced monotonic film times from 8.000 to 10.388 seconds.
- Reverse test produced monotonic times from 10.400 back to 8.012 seconds with zero wrong-direction frames.
- The establishing, opening, hold, travel, and final frames were compared visually in the live browser.
