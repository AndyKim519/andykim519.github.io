# Race photos

Drop a photo for each race here using these exact filenames. The site picks
them up automatically; until a file exists, the card shows a "Photo coming
soon" placeholder (no broken image).

| Race | Filename |
|------|----------|
| Lake Union 10K 2024 | `lake-union-10k-2024.jpg` |
| Golden Gate Half Marathon 2024 | `golden-gate-half-2024.jpg` |
| Berkeley 10K 2024 | `berkeley-10k-2024.jpg` |
| SF Half Marathon 2025 | `sf-half-marathon-2025.jpg` |
| Lake Tahoe Marathon 2025 | `lake-tahoe-marathon-2025.jpg` |
| Golden Gate Half Marathon 2025 | `golden-gate-half-2025.jpg` |
| Napa Valley Marathon 2026 | `napa-valley-marathon-2026.jpg` |
| Berkeley Half Marathon 2026 | `berkeley-half-2026.jpg` |
| Oakland Marathon 2027 (upcoming) | `oakland-marathon-2027.jpg` |
| SF Marathon 2027 (upcoming) | `sf-marathon-2027.jpg` |

Tips:
- Landscape orientation works best (cards use a 16:10 crop, `object-fit: cover`).
- Aim for ~1200px wide and compress (JPEG) to keep the page fast.
- `.jpg` is referenced in `index.html`; if you use `.png`/`.webp`, update the
  `src` in the matching `<li class="race">` block (or rename the file to `.jpg`).

## Race detail modal (click a completed race)

Clicking a completed race opens a pop-up with a photo album (left), a note
(middle), and the stats (right). The album and note content live in the
`RACE_DETAILS` map in `js/main.js`:

- **Photo album (slidable)** — the homepage card always shows just **one** photo
  (the cover = `<race>.jpg` from the table above). The **pop-up shows an album you
  can slide through** (arrows, dots, and left/right arrow keys). To add album
  photos for a race, list their filenames in that race's `photos` array in
  `RACE_DETAILS` (the first entry is the cover). Suggested naming: keep the cover
  as `<race>.jpg` and add `<race>-2.jpg`, `<race>-3.jpg`, … e.g.

  ```js
  "berkeley-2026": {
    photos: [
      "assets/races/berkeley-half-2026.jpg",     // cover (also shown on the card)
      "assets/races/berkeley-half-2026-2.jpg",
      "assets/races/berkeley-half-2026-3.jpg"
    ],
    note: "..."
  }
  ```

  One photo = no slider (just the single image). A filename that isn't there yet
  simply doesn't show, so it's safe to list photos before adding the files — the
  album only displays the ones that exist (and a "Photo coming soon" placeholder
  if none do yet). Or just send me the photos and I'll wire them up.
- **Note ("How it went")** — put your race write-up in the `note` string (use a
  blank line between paragraphs). Leave it `""` to show the "coming soon"
  placeholder.
- **Stats + results link** are pulled automatically from the race card.

