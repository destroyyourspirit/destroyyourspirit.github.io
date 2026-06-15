# DESTROY YOUR SPIRIT — one-pager

Static single-page promo site for **DYS (Destroy Your Spirit)**, an underground rave
collective in Milan. Built from their press kit. Hosted on **GitHub Pages**.

This file is the handoff context: it explains what the site is, how it's built, the
decisions already made, and the conventions to follow. Read it at the start of every session.

---

## The collective (content source of truth)

- **Name:** Destroy Your Spirit (DYS)
- **Founders:** Mourir Beau and Scarface
- **Scene:** Milan underground; high-intensity but intimate rave format
- **Debut series:** XXX
- **Aesthetic:** surreal/psychedelic, esoteric, spirituality-meets-hedonism, raw and human
- **Contact email:** contact@destroyyourspir.it
- **Instagram:** @Destroyyourspirit  (https://instagram.com/Destroyyourspirit)
- **Tagline in contact section:** "Join The Cult" (NOT "Join The Frenzy" — this was changed)

The full bio / format copy is already written into `index.html` in the BIO and THE FORMAT
sections. It's lightly edited from the press kit. Don't pad it or make it generic.

---

## Tech & constraints (IMPORTANT — keep it lean)

- **Plain HTML/CSS/JS in a single `index.html`.** No frameworks, no build step, no bundler,
  no npm dependencies. Everything inline in that one file.
- **Performance is a hard requirement.** An earlier version used Three.js with a per-pixel
  fragment shader running every frame — it was far too heavy and was deliberately removed.
  Do NOT reintroduce WebGL, canvas render loops, or any continuously-running animation loop.
  - Animations must be **CSS transform/opacity only** (GPU-cheap).
  - No `requestAnimationFrame` loops that run while idle. Event-driven only, rAF-throttled.
- **Theme:** red on black.
  - `--red: #d40000`  `--red-bright: #ff1414`  `--red-dim: #7a0000`  `--black: #000000`
  - Glow: `0 0 12px rgba(212,0,0,.5), 0 0 34px rgba(212,0,0,.22)`
- **Fonts (Google Fonts):**
  - Display / headings: **Anton** (heavy condensed sans). The user disliked the original
    "Pirata One" blackletter — do not go back to it. Acceptable alternatives in the same
    spirit if asked: Archivo Black, Oswald, Bebas Neue.
  - Body / UI: **Space Mono**
- **Respect `prefers-reduced-motion`** — all animation is disabled under that media query.
- Keep total page weight small (currently ~115 KB including images).

---

## Files

```
.
├── index.html          # home page: HTML + CSS + JS, no build step
├── event.html          # standalone event detail page (XXX — Milan Fashion Week Edition)
├── CNAME               # custom domain: destroyyourspir.it
├── CLAUDE.md           # this file
├── README.md           # GitHub Pages deploy instructions
├── .nojekyll           # tells GitHub Pages to serve /assets verbatim
└── assets/
    ├── face.png            # mascot head WITH EMPTY EYE SOCKETS  (source asset — preserve)
    ├── pupils.png          # the three red pupils, transparent, aligned 1:1 over face.png
    ├── favicon.png         # 64×64 favicon
    ├── event-xxx.jpg       # XXX MFW event poster (full, used on event.html hero)
    ├── event-xxx-thumb.jpg # 240px thumbnail of the poster (index listing card)
    └── mascot.png          # OLD flattened single-PNG mascot — UNUSED, safe to delete
```

> `.claude/` (launch.json + serve.cjs) is a local preview-server helper only —
> do NOT commit/deploy it. Keep it out of `main`.

### The mascot is split into two layers — do not flatten it

The mascot (a three-eyed grinning red face) was originally one PNG extracted from the press
kit. It was later **split into two transparent PNGs** so the eyes can move:

- `face.png` = the head with the three eye sockets left empty.
- `pupils.png` = only the three pupils, on a transparent canvas, positioned so it overlays
  exactly on top of `face.png` at the same dimensions.

These were produced via offline image processing (Pillow + scipy connected-components) that
is NOT reproducible inside Claude Code. **Treat `face.png` and `pupils.png` as binary source
assets. Never regenerate, recolor, or "optimize" them by redrawing.** If the user wants a new
mascot, they must supply new PNGs (and the user has been told to upload any missing images
themselves).

---

## Current behavior already implemented in index.html

Hero (mascot centered, with a SCROLL cue below it):
- **No `<h1>` text title.** A "DESTROY YOUR SPIRIT" / "MILANO • UNDERGROUND" headline block
  was previously added but the user deliberately removed it (the mascot carries the brand).
  Do not re-add a text title to the hero unless the user asks.
- `.mascot` container holds, stacked: two `.g1`/`.g2` ghost copies of `face.png`
  (chromatic-split glitch via `mix-blend-mode:screen` + transform keyframes), the `.base`
  face, and `.pupils` on top.
- The whole `.mascot` does a slow vertical **float** bob so all layers stay locked together.
- An occasional **slice glitch** (clip-path) fires on a lazy timer (~every few seconds) and
  on hover/tap. Timer-driven, not a render loop.
- **Eye tracking — DESKTOP ONLY.** A `pointermove` listener (gated behind
  `(pointer:fine)` AND `(min-width:700px)`) translates `#pupils` a few px toward the cursor,
  rAF-throttled, transform-only, clamped so pupils stay inside the sockets. Recenters when
  the cursor leaves the window. Travel distance is `var MAX = 9;` in the script — lower =
  subtler gaze, higher = wilder. This is intentionally disabled on touch/mobile for
  performance and because it's pointless there.

Sections: COLLECTIVE BIO, THE FORMAT (with an "XXX" mark), and a CONTACT section ("Join The
Cult") with the mailto link and Instagram. Scroll-reveal uses a one-shot IntersectionObserver
that unobserves each element after it fires. Static scanline + vignette overlays (no
animated blend-modes).

---

## Deploy (GitHub Pages)

- Source: deploy from `main` branch, root (`/`).
- **Relative asset paths only** (`assets/face.png`, never `/assets/...`) so the site works
  both at a project URL (`user.github.io/repo/`) and at the root.
- `.nojekyll` must stay in the repo root so GitHub serves `/assets` as-is.

### Repo naming note (already explained to the user)

- A repo named `<username>.github.io` serves at the root: `https://<username>.github.io/`.
- Any other repo name serves at a subpath: `https://<username>.github.io/<repo>/`.
  The user originally had it at a subpath and may rename the repo to fix this.
- Custom domain goal: **destroyyourspir.it** (Settings → Pages → Custom domain, then point
  DNS at GitHub Pages). Relative paths already support this — no code change needed.

### Git / GitHub workflow

- `gh` CLI is the intended path for auth (`gh auth login`, web browser flow). Claude Code
  uses the system git binary + existing credentials; no separate token needed to push.
- After making changes the user approves: stage by logical unit, commit with a clear
  conventional-commit message (e.g. `feat:`, `fix:`, `style:`, `chore:`), and push to `main`.
  GitHub Pages redeploys in ~1 minute.
- Confirm remote with `git remote -v` before first push.

---

## How to work in this project

- Make focused edits to `index.html`; preserve the lean, dependency-free, single-file setup.
- Before adding any animation or interactivity, ask: does this run only on input, and is it
  transform/opacity only? If not, find a cheaper way.
- When the user corrects something, add a rule here so it doesn't get repeated.

### Events

- `index.html` has an **EVENTS** section: a buka.xyz-style listing card (thumbnail + date +
  title + venue/artists) linking to a dedicated event page. To add an event, clone the
  `.ev-card` markup and add a new `event-*.html`.
- `event.html` is the **XXX — Milan Fashion Week Edition** page (Fri 19 Jun 2026, VACUUM,
  Milano). Structure follows the buka.xyz event-page format: kicker → poster (with a static
  inline-SVG "SPECIAL GUESTS" starburst seal) → title → genre tags → a 4-up meta grid
  (DATE/TIME/VENUE/TICKETS) → THE NIGHT copy → LINEUP (sticker-style artist labels) →
  BUY TICKETS CTA. It re-inlines the same design tokens as index.html (no shared CSS file).
- **Event data is authored from DICE.** The XXX page data was pulled from the DICE public API:
  `https://api.dice.fm/events/<24-char-id>` (the id for this event is `6a28567a76f0ab000152b401`;
  the page slug alone is rejected by the API). Ticket link, price (€8.05), 18+, start 23:30 /
  end 05:00, and the official blurb all come from there.
- **KNOWN CONFLICT (unresolved):** the poster art says venue **"Via del Fabbri 12"** but DICE
  lists **"Corso di Porta Ticinese 32, 20123 Milano"**. The page currently uses the DICE
  address. Confirm the correct one with the user before launch.

### Open follow-ups the user might pick up
- Possible additions discussed but not built: a music embed (SoundCloud/Mixcloud), a
  mailing-list signup. None implemented yet.
- Eye-tracking `MAX` travel is tunable if the gaze feels too subtle or too wild.
