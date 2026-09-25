/**
 * invitation.config.js
 * ---------------------------------------------------------------------------
 * ONE place to edit when turning this template into a new couple's
 * invitation. This file just sets a plain global object (`window.WEDDING_CONFIG`)
 * — it is loaded before everything else and has no build step.
 *
 * It currently drives:
 *   - background music (source, volume, fade-in timing, loop)
 *   - the page <title>
 *   - the countdown target date/time
 *   - the .ics "Add to calendar" file contents (event names, times, venue)
 *   - the floating music button's accent color
 *
 * NOTE ON IMAGES / COUPLE NAMES IN THE PAGE BODY:
 *   The current page design has the couple's names, the venue name, and the
 *   photos written directly into the markup in ~30-40 places (headings,
 *   image `alt` text, section labels, etc.) rather than pulled from a single
 *   variable. Wiring every one of those to this config is a bigger follow-up
 *   pass (safe to do, just a lot of surface area) — ask and it can be done.
 *   For now, to swap photos for a new couple, replace the files in /media
 *   keeping the SAME filenames (they're listed below as `heroImage` /
 *   `gallery` so you can see which role each file plays), and use
 *   find-and-replace for the name/venue text in index.html.
 * ---------------------------------------------------------------------------
 */
window.WEDDING_CONFIG = {
  couple: {
    partnerA: "Ritika",
    partnerB: "Shashwat",
    displayTitle: "Ritika & Shashwat"
  },

  wedding: {
    // ISO 8601, used to drive the countdown timer.
    date: "2026-12-09T12:00:00+05:30",
    venueName: "Trimurti Hotel",
    venueCity: "Ayodhya",
    venueRegion: "Uttar Pradesh"
  },

  images: {
    // Role -> current file in /media. Replace the file, keep the name, or
    // point these at a new filename once image srcs are fully wired to config.
    heroImage: "media/hero-red.png",
    coverImage: "media/cover.png",
    gallery: [
      "media/ic-haldi.jpg",
      "media/ic-sangeet.jpg",
      "media/ic-wedding.jpg",
      "media/ic-reception.jpg"
    ]
  },

  music: {
    // Local, easily-replaceable asset. Swap the file and/or this path to
    // change the soundtrack for a new invitation.
    src: "/audio/wedding-instrumental.mp3",
    initialVolume: 0,
    targetVolume: 0.6,
    fadeDuration: 4000, // ms, smooth fade-in after the seal is clicked
    loop: true
  },

  colors: {
    primary: "#1F2E4D",   // navy — used on the floating music control, etc.
    secondary: "#B8955A"  // antique gold — accent color
  }
};
