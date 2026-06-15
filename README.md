# DESTROY YOUR SPIRIT — site

Static single-page promo site for **DYS (Destroy Your Spirit)**, an underground rave
collective in Milan. Red-on-black, surreal/esoteric, built around the three-eyed mascot.

No frameworks, no build step, no dependencies. Everything lives in `index.html`
(HTML + CSS + JS inline). See `CLAUDE.md` for full context and conventions.

## Files

```
.
├── index.html          # the entire site (HTML + CSS + JS, no build step)
├── CNAME               # custom domain: destroyyourspir.it
├── .nojekyll           # tells GitHub Pages to serve /assets as-is
└── assets/
    ├── face.png        # mascot head with empty eye sockets (source asset)
    ├── pupils.png      # the three red pupils, transparent, overlays face.png 1:1
    └── favicon.png     # 64×64 favicon
```

> `assets/mascot.png` is the old flattened single-PNG mascot. It is **unused** by the
> current site (the mascot is now split into `face.png` + `pupils.png` so the eyes can
> track the cursor). Kept only as a leftover; safe to delete.

## Tech notes

- **Fonts (Google Fonts):** Anton (display/headings), Space Mono (body/UI).
- **Theme:** red on black — `--red:#d40000`, `--red-bright:#ff1414`, `--red-dim:#7a0000`.
- All animation is **CSS transform/opacity only** (no WebGL, no render loops) and is
  disabled under `prefers-reduced-motion`. An earlier Three.js shader version was removed
  for performance — do not reintroduce it.

## Deploy (GitHub Pages)

- Source: deploy from the `main` branch, root (`/`).
- Custom domain `destroyyourspir.it` is set via `CNAME` (Settings → Pages → Custom domain),
  with DNS pointed at GitHub Pages.
- **Relative asset paths only** (`assets/face.png`, never `/assets/...`) so the site works
  at both a project URL and the root/custom domain.
- `.nojekyll` must stay in the repo root.

## Local preview

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```
