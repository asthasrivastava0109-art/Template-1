/**
 * wedding-view.js
 * ---------------------------------------------------------------------------
 * Turns the plain facts in src/data/weddingData.js into the ready-to-render
 * strings the page needs (formatted dates, alt text, phone links, calendar
 * entries…) and exposes them as `window.weddingView`.
 *
 * You should NOT need to edit this file for a new client — edit
 * src/data/weddingData.js instead.
 *
 * Also, before the page renders:
 *   - applies `weddingData.theme` as CSS variables (--wd-primary, …)
 *   - sets the browser tab title
 * ---------------------------------------------------------------------------
 */
(function (global) {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  function parseDate(iso) {
    var p = String(iso).split('-').map(Number);
    return { y: p[0], m: p[1], d: p[2] };
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function ordinal(n) {
    var t = n % 100;
    if (t >= 11 && t <= 13) return 'th';
    return ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  }
  function monthName(m) { return MONTHS[m - 1] || ''; }
  function telHref(phone) { return 'tel:' + String(phone).replace(/[^\d+]/g, ''); }
  function waHref(phone) { return 'https://wa.me/' + String(phone).replace(/\D/g, ''); }
  function firstLetter(s) { return String(s || '').trim().charAt(0).toUpperCase(); }

  // ["A", "B"] -> ["A", "& B"]; ["A", "B", "C"] -> ["A", ", B", "& C"]
  function nameLines(names) {
    return (names || []).map(function (n, i, all) {
      if (i === 0) return n;
      return (i === all.length - 1 ? '& ' : ', ') + n;
    });
  }

  // Absolute timestamp for "YYYY-MM-DD" + "HH:MM" at the venue's UTC offset.
  function toTime(date, time, tz) {
    return new Date(date + 'T' + (time || '00:00') + ':00' + (tz || '+00:00')).getTime();
  }
  function icsStamp(ms) {
    return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  // "9th & 10th December 2026" as parts, so the template can superscript the suffix.
  function dateParts(dates) {
    var ds = dates.map(parseDate);
    return ds.map(function (d, i) {
      var next = ds[i + 1];
      var last = !next;
      var tail = '';
      if (last || next.m !== d.m || next.y !== d.y) {
        tail = ' ' + monthName(d.m);
        if (last || next.y !== d.y) tail += ' ' + d.y;
      }
      return {
        joiner: i === 0 ? '' : last ? ' & ' : ', ',
        day: String(d.d),
        suffix: ordinal(d.d),
        tail: tail
      };
    });
  }

  // "09-10 December 2026" (same month) or "30 November - 01 December 2026".
  function dateRangeShort(dates) {
    var a = parseDate(dates[0]), b = parseDate(dates[dates.length - 1]);
    if (dates.length === 1) return pad2(a.d) + ' ' + monthName(a.m) + ' ' + a.y;
    if (a.m === b.m && a.y === b.y) return pad2(a.d) + '-' + pad2(b.d) + ' ' + monthName(a.m) + ' ' + a.y;
    return pad2(a.d) + ' ' + monthName(a.m) + ' - ' + pad2(b.d) + ' ' + monthName(b.m) + ' ' + b.y;
  }

  function build(data) {
    var c = data.couple, w = data.wedding, v = data.venue;
    var title = c.bride + ' & ' + c.groom;
    var first = parseDate(w.dates[0]);
    var initials = [firstLetter(c.bride), firstLetter(c.groom)];
    var idBase = (initials.join('') + '-' + first.y).toLowerCase();

    var events = data.events.map(function (e, i) {
      var d = parseDate(e.date);
      var left = i % 2 === 0;
      var cityRe = new RegExp(',\\s*' + String(w.city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'i');
      var loc = cityRe.test(e.venue) ? e.venue : e.venue + ', ' + w.city;
      return {
        name: e.name,
        day: pad2(d.d),
        month: monthName(d.m),
        bg: 'url(' + e.image + ') center/cover no-repeat',
        imgOrder: left ? 1 : 2,
        txtOrder: left ? 2 : 1,
        align: left ? 'left' : 'right',
        items: left ? 'flex-start' : 'flex-end',
        origin: left ? 'left center' : 'right center',
        fade: 'linear-gradient(' + (left ? 90 : 270) + 'deg,rgba(253,250,243,0) 62%,rgba(253,250,243,.55) 88%,#FDFAF3 100%)',
        timeLine: e.time,
        venueLine: 'Venue: ' + e.venue,
        attireLine: 'Wear: ' + e.dressCode,
        note: e.note,
        rail: {
          icon: 'url(' + e.icon + ') center/contain no-repeat',
          name: e.shortName,
          date: pad2(d.d) + ' ' + monthName(d.m).slice(0, 3).toUpperCase()
        },
        ics: {
          uid: String(e.shortName).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idBase + '@wedding',
          summary: e.name + ' — ' + title,
          start: icsStamp(toTime(e.date, e.startTime, w.timezone)),
          location: loc
        }
      };
    });

    function side(name, f) {
      return {
        name: name,
        parentsLabel: f.parentsLabel,
        parents: nameLines(f.parents),
        grandparentsLabel: f.grandparentsLabel,
        grandparents: nameLines(f.grandparents)
      };
    }

    var ct = data.contact;
    var firstEvent = data.events[0];

    return {
      title: title,
      initials: initials,
      dateParts: dateParts(w.dates),
      cityMonth: w.city + ' · ' + monthName(first.m) + ' ' + first.y,
      cityState: w.city + ' · ' + w.state,
      venueWithCity: v.name + ', ' + w.city,
      countdownTarget: firstEvent
        ? toTime(firstEvent.date, firstEvent.startTime, w.timezone)
        : toTime(w.dates[0], '00:00', w.timezone),
      wishesStorageKey: initials.join('').toLowerCase() + '-wishes-' + first.y,
      calendarFileName: title.replace(/[^a-z0-9]+/gi, '-') + '-Wedding.ics',

      alt: {
        envelope: c.bride + ' and ' + c.groom + ' — wedding invitation',
        seal: initials[0] + ' and ' + initials[1] + ' monogram seal',
        hero: c.bride + ' weds ' + c.groom + ' — ' + dateRangeShort(w.dates) + ', ' + w.city,
        couple: c.bride + ' and ' + c.groom,
        coupleWithFamily: c.bride + ' and ' + c.groom + ' with family',
        venueMap: 'Illustrated map of ' + w.city + ' showing ' + v.name
      },

      family: {
        bride: side(c.bride, data.family.bride),
        groom: side(c.groom, data.family.groom)
      },

      storyBeats: data.story.milestones.map(function (m, i) {
        return { num: pad2(i + 1), title: m.title, sub: m.subtitle };
      }),
      storyLeftCaption: title + ' ♡',

      events: events,
      venueRail: events.map(function (e) { return e.rail; }),
      calendarEvents: events.map(function (e) { return e.ics; }),

      blessings: {
        line: 'A line for ' + title + ' to keep forever.',
        placeholder: 'Write your blessings for ' + title + '...',
        sent: 'Your blessing has been showered on ' + title + ' ♡'
      },

      contact: {
        whatsappUrl: waHref(ct.whatsapp),
        primary: {
          name: ct.primary.name,
          relation: ct.primary.relation,
          phone: ct.primary.phone,
          tel: telHref(ct.primary.phone)
        },
        others: (ct.others || []).map(function (p) { return { phone: p, tel: telHref(p) }; })
      }
    };
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    var map = {
      primary: '--wd-primary', accent: '--wd-accent', accentDark: '--wd-accent-dark',
      accentSoft: '--wd-accent-soft', gold: '--wd-gold', goldLight: '--wd-gold-light'
    };
    Object.keys(map).forEach(function (k) {
      if (theme && theme[k]) root.style.setProperty(map[k], theme[k]);
    });
  }

  var data = global.weddingData;
  if (!data) {
    console.error('wedding-view: window.weddingData is missing — is src/data/weddingData.js loaded first?');
    return;
  }
  try {
    global.weddingView = build(data);
    applyTheme(data.theme);
    document.title = global.weddingView.title + ' | Wedding Invitation';
  } catch (e) {
    console.error('wedding-view: could not read src/data/weddingData.js — check it for a typo.', e);
  }
})(window);
