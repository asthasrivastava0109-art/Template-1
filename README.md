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
- `src/data/weddingData.js` — **the one file to edit for a new client** (see
  below). `src/data/types.d.ts` describes its shape for editor autocomplete.
- `js/wedding-view.js` — turns the data into formatted dates, links, alt text
  and calendar entries, and applies the theme colours. No need to edit it.
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
`music.src` in `src/data/weddingData.js`).

## `src/data/weddingData.js` — the reusable data file

**New client = edit `src/data/weddingData.js` + replace images/music.**
No component or markup changes are needed.

It holds, in plain editable text:

| Key | What it controls |
| --- | --- |
| `couple` | Bride, groom, tagline (names also drive the page title, alt text, monogram, blessing text) |
| `wedding` | Celebration dates (`YYYY-MM-DD`), city, state, time zone |
| `venue` | Venue name, address, Google Maps link, pin position on the illustrated map |
| `family` | Parents and grandparents for each side, with their labels |
| `events` | Every event: name, date, start time, display time, venue, dress code, note, images. The countdown targets the first event; "Add to calendar" is built from this list |
| `story` | Timeline milestones, quote, photo caption |
| `contact` | WhatsApp RSVP number, main contact, extra numbers |
| `assets` | Every photo/illustration path |
| `music` | Track, volume, fade-in, loop |
| `theme` | Main text/accent colours (applied as CSS variables `--wd-*`) |
| `sections` | Show/hide each section (`true` / `false`) |
| `animations` | Falling petals, mouse parallax, reveal-on-scroll |

It's plain JavaScript (not `.ts`) because the site has no build step — the
browser loads it directly. `// @ts-check` plus `types.d.ts` still give type
checking and autocomplete in VS Code.

**Images with text drawn into them.** These must be redesigned for each new
couple — editing the data file cannot change text inside a picture:
`cover.png` (envelope), `seal-disc.png` (monogram), `hero-red.png`,
`countdown-clean.png`, `venue-map.jpg`, `rsvp-clean.png`. They're marked
`TEXT IN IMAGE` in the data file.

**Link previews.** The page title is set from the data when the page loads.
WhatsApp/social link previews read the raw HTML and will show the generic
"Wedding Invitation" title.

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
