# Race photos

Drop a photo for each race here using these exact filenames. The site picks
them up automatically; until a file exists, the card shows a "Photo coming
soon" placeholder (no broken image).

| Race | Filename |
|------|----------|
| Golden Gate Half Marathon 2024 | `golden-gate-half-2024.jpg` |
| Lake Tahoe Marathon 2025 | `lake-tahoe-marathon-2025.jpg` |
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

- **Photo album** — add more filenames to a race's `photos` array to make the
  album slidable, e.g.
  `"berkeley-2026": { photos: ["assets/races/berkeley-half-2026.jpg", "assets/races/berkeley-half-2026-2.jpg"], note: "" }`.
  The first photo is also the card's cover image. One photo = no slider arrows.
- **Note ("How it went")** — put your race write-up in the `note` string (use a
  blank line between paragraphs). Leave it `""` to show the "coming soon"
  placeholder.
- **Stats + results link** are pulled automatically from the race card.

