// @ts-check
/**
 * ===========================================================================
 *  WEDDING DATA — the ONLY file you need to edit for a new client.
 * ===========================================================================
 *
 *  New client checklist:
 *    1. Edit the text below (names, dates, venue, family, events, contacts).
 *    2. Replace the images in /media and the song in /audio
 *       (keep the same filenames, or change the paths in `assets` / `music`).
 *    3. Push to GitHub — the site redeploys automatically.
 *
 *  Rules for editing:
 *    - Only change the text between the quotes "like this".
 *    - Keep every comma, bracket and quote mark in place.
 *    - Dates are written as "YYYY-MM-DD" (e.g. "2026-12-09").
 *    - Times are written in 24-hour format "HH:MM" (e.g. "19:00" = 7 PM).
 *    - Set a section to `false` to hide it from the page.
 *
 *  IMPORTANT — some images have wedding details DRAWN INTO THEM.
 *  Editing this file will NOT change the text inside those images; they must
 *  be redesigned for every new couple. They are marked "TEXT IN IMAGE" below.
 * ===========================================================================
 */

/** @type {import('./types').WeddingData} */
window.weddingData = {
  // ---------------------------------------------------------------- COUPLE
  couple: {
    bride: "Ritika",
    groom: "Shashwat",
    tagline: "A new chapter, a beautiful beginning."
  },

  // --------------------------------------------------------------- WEDDING
  wedding: {
    // Every day of the celebrations, in order. Shown as "9th & 10th December 2026".
    dates: ["2026-12-09", "2026-12-10"],
    city: "Ayodhya",
    state: "Uttar Pradesh",
    // Time zone of the venue. India = "+05:30".
    timezone: "+05:30"
  },

  // ----------------------------------------------------------------- VENUE
  venue: {
    name: "Trimurti Hotel",
    address: "Ayodhya, Uttar Pradesh",
    mapsUrl: "https://maps.app.goo.gl/dk86EyGh8HaQpvgB8",
    // Where the pulsing pin sits on the illustrated venue map (percent from left / top).
    mapPin: { left: "64%", top: "40.8%" }
  },

  // ---------------------------------------------------------------- FAMILY
  family: {
    bride: {
      parentsLabel: "Daughter of",
      parents: ["Smt. Vibha Jaiswal", "Shri Ashok Kumar Jaiswal"],
      grandparentsLabel: "Granddaughter of",
      grandparents: ["Smt. Girija Jaiswal", "Late Shri Ram Shankar Jaiswal"]
    },
    groom: {
      parentsLabel: "Son of",
      parents: ["Smt. Neelam Jaiswal", "Shri Surendra Kumar Jaiswal"],
      grandparentsLabel: "Grandson of",
      grandparents: ["Smt. Rama Jaiswal", "Shri Pooran Nath Jaiswal"]
    }
  },

  // ---------------------------------------------------------------- EVENTS
  // The countdown timer counts down to the FIRST event.
  // Add or remove events freely; the layout alternates left/right automatically.
  events: [
    {
      name: "Haldi Carnival",
      shortName: "Haldi",                       // used in the small venue strip
      date: "2026-12-09",
      startTime: "12:00",                       // for the countdown + calendar file
      time: "12:00 PM onwards · lunch to follow", // shown on the page
      venue: "Poolside Lawn, Trimurti Hotel",
      dressCode: "Yellow shades + floral prints",
      note: "A splash of yellow, a pinch of joy, endless smiles.",
      image: "media/ev-haldi.jpg",
      icon: "media/ic-haldi.jpg"
    },
    {
      name: "The Sangeet Night",
      shortName: "Sangeet",
      date: "2026-12-09",
      startTime: "19:00",
      time: "7:00 PM onwards",
      venue: "Lawn, Trimurti Hotel",
      dressCode: "Energetic, celebratory, glamorous",
      note: "Dance, drama and cocktails — let the Sangeet Night set the rhythm.",
      image: "media/ev-sangeet.jpg",
      icon: "media/ic-sangeet.jpg"
    },
    {
      name: "Vows of Forever",
      shortName: "Wedding",
      date: "2026-12-10",
      startTime: "13:00",
      time: "1:00 PM onwards",
      venue: "Trimurti Hotel, Ayodhya",
      dressCode: "Traditional",
      note: "The pheras — seven steps, one lifetime.",
      image: "media/ev-pheras.jpg",
      icon: "media/ic-wedding.jpg"
    },
    {
      name: "Wedding Reception",
      shortName: "Reception",
      date: "2026-12-10",
      startTime: "19:00",
      time: "7:00 PM onwards",
      venue: "Trimurti Hotel, Ayodhya",
      dressCode: "Formal / festive",
      note: "Celebrating the newlyweds — come and join us & bless us by your valuable presence.",
      image: "media/ev-reception.jpg",
      icon: "media/ic-reception.jpg"
    }
  ],

  // ----------------------------------------------------------------- STORY
  story: {
    // Timeline on the right of "Our story". Numbers (01, 02…) are added automatically.
    milestones: [
      { title: "We knew each other", subtitle: "For a long time" },
      { title: "And finally, we met", subtitle: "" },
      { title: "Our better half", subtitle: "We found in each other" },
      { title: "Vows of Forever", subtitle: "10 December 2026 · Ayodhya" }
    ],
    quote: "We knew each other for a long time and finally when we met, we found in each other — our better half.",
    // Caption under the right-hand photo (the left one shows the couple's names).
    photoCaption: "Together, always ♡"
  },

  // --------------------------------------------------------------- CONTACT
  contact: {
    // Number that opens WhatsApp from the "Joyfully accept" RSVP button.
    whatsapp: "+91 94150 39150",
    // Main contact shown with a name.
    primary: {
      name: "Shri Ashok Kumar Jaiswal",
      relation: "Ritika's father",
      phone: "+91 94150 39150"
    },
    // Extra numbers shown below the main contact.
    others: ["+91 81716 59766", "+91 63872 58883"]
  },

  // ---------------------------------------------------------------- IMAGES
  assets: {
    envelope: "media/cover.png",             // TEXT IN IMAGE: names, dates, city, R|S seal
    seal: "media/seal-disc.png",             // TEXT IN IMAGE: couple's initials
    hero: "media/hero-red.png",              // TEXT IN IMAGE: names, dates, city
    scratchCardPhoto: "media/hands.jpeg",    // photo hidden under the scratch card
    countdown: "media/countdown-clean.png",  // TEXT IN IMAGE: city, dates
    familiesBackground: "media/families-clean.png",
    storyPhotos: {
      left: "media/couple.jpeg",
      middle: "media/ritual.jpeg",
      right: "media/story-new.jpeg"
    },
    storyBackground: "media/story-ghat.png",
    banner: "media/band-clean.png",          // background of the date + venue banner
    venueMap: "media/venue-map.jpg",         // TEXT IN IMAGE: venue name, local landmarks
    blessingsScene: "media/bless2-clean.png",
    blessingsElders: "media/bless2-elders.png",
    coupleCutout: "media/couple-cutout.png", // couple photo with transparent background
    rsvpBackground: "media/rsvp-clean.png"   // TEXT IN IMAGE: names
  },

  // ----------------------------------------------------------------- MUSIC
  music: {
    src: "/audio/wedding-instrumental.mp3",
    initialVolume: 0,
    targetVolume: 0.6,   // 0 = silent, 1 = full volume
    fadeDuration: 4000,  // milliseconds to fade in after the seal is clicked
    loop: true
  },

  // ----------------------------------------------------------------- THEME
  // Main text/accent colours. Petal and sparkle colours are part of the design.
  theme: {
    primary: "#1F2E4D",     // navy — headings, buttons, music button
    accent: "#8A1F2B",      // deep red — bride's name, main headings
    accentDark: "#6E1A26",  // darker red — names on the scratch card, RSVP
    accentSoft: "#8A2E2E",  // softer red — labels, event names
    gold: "#B8955A",        // gold — ornaments
    goldLight: "#C9A96A"    // light gold — lines and borders
  },

  // -------------------------------------------------------------- SECTIONS
  // Set to false to hide a section. The envelope and hero are always shown.
  sections: {
    scratchCard: true,
    countdown: true,
    family: true,
    story: true,
    banner: true,
    events: true,
    venue: true,
    blessings: true,
    rsvp: true
  },

  // ------------------------------------------------------------ ANIMATIONS
  animations: {
    fallingPetals: true,   // petals drifting across the page
    parallax: true,        // images gently follow the mouse (desktop only)
    revealOnScroll: true   // content fades up as you scroll
  }
};
