# Ritika & Shashwat — Wedding Site

Static site, ready to deploy on Vercel.

## Deploy (fastest — no account setup beyond Vercel login)

**Option A: Vercel CLI**
```bash
npm i -g vercel
cd this-folder
vercel --prod
```
Follow the prompts (link/create a project, keep default settings — it's a static
site, so no build command or output directory is needed).

**Option B: Vercel dashboard**
1. Push this folder to a GitHub repo (or drag-and-drop the folder at
   https://vercel.com/new — Vercel supports direct folder upload).
2. Import the repo/folder in the Vercel dashboard.
3. Framework preset: "Other" (no build step). Leave build & output settings
   empty/default.
4. Deploy.

## What's in here

- `index.html` — the invitation page (this is the file you called
  "Ritika & Shashwat v2.dc.html"). It renders itself client-side using React,
  ReactDOM and Babel, which `support.js` loads from a CDN (unpkg) at runtime —
  no build step is required.
- `support.js` — small runtime that parses and mounts the page above.
- `invitation.config.js` — **the one file to edit for a new client** (see
  below).
- `js/wedding-music-controller.js` — reusable background-music controller.
- `audio/wedding-instrumental.mp3` — the instrumental track (converted from
  the `.m4r` you sent).
- `media/` — every image/video the page actually references (26 files).
- `vercel.json` — sets long-lived caching for `/media/*`, `/audio/*` and
  `/support.js`.

## Background music

Implemented exactly per spec:

- **Silent on load.** No `<audio>` plays until the user clicks the central
  seal — this satisfies both desktop and mobile autoplay restrictions because
  `play()` is called synchronously inside the click handler.
- **Click sequence:** seal glow → light burst/envelope opening starts →
  `WeddingMusicController.play()` fires (audio starts at volume 0) → the
  controller fades the volume up over `fadeDuration` (4s by default) on a
  `requestAnimationFrame` loop with eased interpolation → by the time the
  envelope finishes opening (~3.2s) the track is at (or very near) the
  configured `targetVolume` (0.6 by default).
- **Singleton, single `<audio>` element.** `WeddingMusicController.getInstance()`
  always returns the same instance; a second seal click, or clicking the
  floating control repeatedly, never creates a new audio element and never
  restarts the fade-in — it just resumes from the current position at the
  target volume.
- **Pause/resume preserves position** — pausing is a plain `audio.pause()`
  (native, keeps `currentTime`); resuming calls `audio.play()` again on the
  same element.
- **Looping** uses the native `<audio loop>` attribute. This is a small,
  dependency-free implementation as requested (item 15: "do not introduce
  unnecessary libraries") — for a perfectly gapless loop on a track with
  audible silence at its tail, you'd want the Web Audio API's
  `AudioBufferSourceNode` with a trimmed buffer; happy to add that if the
  current loop point is audible with your specific file.
- **Floating control** (`js`-driven, styled inline to match the existing
  navy/ivory/gold palette) only appears once music has actually started (per
  spec item 10), shows a small animated equalizer while playing, and is fixed
  bottom-right through scroll.
- The controller exposes exactly the API you asked for: `play()`, `pause()`,
  `toggle()`, `fadeIn()`, `setVolume()`, `getCurrentTime()`, `isPlaying()`,
  `onChange()`, `destroy()`.

To swap the track for a new invitation: replace
`audio/wedding-instrumental.mp3` (any filename works — just also update
`music.src` in `invitation.config.js`).

## `invitation.config.js` — the reusable config file

This is the single file meant to change per new client:

```js
window.WEDDING_CONFIG = {
  couple: { partnerA, partnerB, displayTitle },
  wedding: { date, venueName, venueCity, venueRegion },
  images: { heroImage, coverImage, gallery: [...] },
  music: { src, initialVolume, targetVolume, fadeDuration, loop },
  colors: { primary, secondary }
};
```

**Currently wired end-to-end from this file:**
- All music behaviour (source, volume, fade timing, loop).
- The page `<title>`.
- The countdown timer's target date.
- The "Add to calendar" `.ics` file's event names, venue text and filename.
- The floating music button's accent color.

**Not yet wired (still hardcoded in `index.html`'s markup — by design, so this
first pass didn't touch layout/animation code beyond music):** the couple's
names, venue name and photo `<img>` tags appear directly in ~30–40 places
across the page's headings, section labels and `alt` text (e.g. "Ritika",
"Shashwat", "Ayodhya", `media/hero-red.png`, `media/couple.jpeg`, etc.).
Swapping images today just means replacing files in `/media` with the same
filenames; swapping the couple's names/venue text today means a
find-and-replace across `index.html`. Fully wiring every one of those to
`invitation.config.js` (so a new client needs **only** a config edit, zero
markup edits) is a mechanical follow-up pass — say the word and I'll do it.

## Notes

- The RSVP "wishes" wall is stored in the visitor's own browser
  (`localStorage`), not a shared database — each visitor only sees wishes left
  on their own device/browser. Let me know if you'd like this to be shared
  across all visitors (would need a small backend or a service like
  Supabase/Firebase).
- Fonts (Italianno, Cormorant Garamond, EB Garamond, Jost) load from Google
  Fonts over the network — no local font files needed.
- Everything else (images, styling, animations, envelope/seal/scratch-card
  interactions) is **unchanged** from the previous version — only the music
  system and the config file were added.
