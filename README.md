# andykim519.github.io

Personal website for **Andy Kim** — Software / Hardware Engineer and PCB Designer.

Live at **https://andykim519.github.io**

## What this is

A single-page portfolio showcasing projects and hobbies. Built as plain static
**HTML + CSS + vanilla JS** with **no build step**, so GitHub Pages serves it
directly from `main` (no Jekyll, no Actions, no toolchain to maintain).

## Structure

```
index.html        # all page content (hero, projects, hobbies, about, footer)
css/styles.css    # nature theme — dark greens + browns on beige
js/main.js         # mobile menu, footer year, scroll-reveal (progressive enhancement)
assets/favicon.svg # leaf favicon
.nojekyll          # tells GitHub Pages to skip Jekyll processing
```

## Editing

- **Add a project:** copy an `<article class="card">` block inside the
  `#projects` section in `index.html` and edit the title, description, and the
  `card__tech` tags. A `tag--wip` pill marks works in progress.
- **Add a hobby:** copy a `<article class="card card--hobby">` block in the
  `#hobbies` section.
- **Colors / fonts:** all theme values are CSS custom properties at the top of
  `css/styles.css` (`:root`).

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Pushing to `main` publishes automatically. In the repo's **Settings → Pages**,
confirm the source is **Deploy from a branch → `main` / root**.

> Progress / handoff notes for this project live in the personal progress hub at
> `~/personal/personal_project_progress_docs/PERSONAL_WEBSITE_PROGRESS.md`
> (kept out of this repo by convention).
