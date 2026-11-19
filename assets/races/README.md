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

Tips:
- Landscape orientation works best (cards use a 16:10 crop, `object-fit: cover`).
- Aim for ~1200px wide and compress (JPEG) to keep the page fast.
- `.jpg` is referenced in `index.html`; if you use `.png`/`.webp`, update the
  `src` in the matching `<li class="race">` block (or rename the file to `.jpg`).
