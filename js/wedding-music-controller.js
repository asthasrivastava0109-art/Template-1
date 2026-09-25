/**
 * WeddingMusicController
 * ---------------------------------------------------------------------------
 * Small, dependency-free, reusable controller for the invitation's
 * background instrumental. One singleton instance, one <audio> element,
 * ever — safe to call play()/toggle() from as many places as you like.
 *
 * Reads its defaults from window.WEDDING_CONFIG.music (see
 * invitation.config.js) so a new couple's template only needs a new audio
 * file + a config edit, never a code change here.
 *
 * Usage:
 *   const music = WeddingMusicController.getInstance();
 *   music.play();              // starts (or resumes) with a fade-in the
 *                               // first time, resumes instantly after that
 *   music.pause();              // pauses, keeps position
 *   music.toggle();
 *   music.onChange(state => ...); // subscribe to { playing, started } changes
 * ---------------------------------------------------------------------------
 */
(function (global) {
  "use strict";

  var DEFAULT_CONFIG = {
    src: "/audio/wedding-instrumental.mp3",
    initialVolume: 0,
    targetVolume: 0.6,
    fadeDuration: 4000,
    loop: true
  };

  function readConfig() {
    var fromWindow = (global.WEDDING_CONFIG && global.WEDDING_CONFIG.music) || {};
    return Object.assign({}, DEFAULT_CONFIG, fromWindow);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function WeddingMusicController(config) {
    this.config = Object.assign({}, DEFAULT_CONFIG, config || readConfig());
    this.audio = null;
    this.started = false; // true once the very first play() has begun
    this.fading = false;
    this.listeners = [];
    this._fadeRaf = null;
  }

  WeddingMusicController.prototype._ensureAudio = function () {
    if (this.audio) return this.audio;
    var audio = new Audio(this.config.src);
    audio.loop = !!this.config.loop;
    audio.preload = "auto"; // don't block page load; browser fetches lazily/in background
    audio.volume = clamp01(this.config.initialVolume);
    audio.addEventListener("play", this._emit.bind(this));
    audio.addEventListener("pause", this._emit.bind(this));
    this.audio = audio;
    return audio;
  };

  /** Start playback. First call fades in from initialVolume -> targetVolume.
   *  Any later call (e.g. seal clicked twice, resume after pause) just
   *  resumes from the current position at the current/target volume —
   *  it never restarts the track or re-fades unnecessarily. */
  WeddingMusicController.prototype.play = function () {
    var self = this;
    var audio = this._ensureAudio();

    if (this.started && !audio.paused) {
      // Already playing — a duplicate trigger (e.g. a second seal click)
      // must be a no-op, not a restart.
      return Promise.resolve();
    }

    var firstStart = !this.started;
    this.started = true;

    var playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        // Autoplay/gesture rejection — leave state consistent, UI can retry.
        self._emit();
      });
    }

    if (firstStart) {
      this.fadeIn();
    } else {
      // Resuming from pause: jump straight back to the target volume,
      // no re-fade, no restart from the beginning.
      audio.volume = clamp01(this.config.targetVolume);
    }

    this._emit();
    return playPromise || Promise.resolve();
  };

  /** Pause playback in place. Position is preserved (native <audio> behaviour). */
  WeddingMusicController.prototype.pause = function () {
    if (this.audio && !this.audio.paused) this.audio.pause();
    this._emit();
  };

  WeddingMusicController.prototype.toggle = function () {
    if (this.audio && this.started && !this.audio.paused) this.pause();
    else this.play();
  };

  /** Smoothly ramp volume from initialVolume to targetVolume over fadeDuration ms. */
  WeddingMusicController.prototype.fadeIn = function () {
    var self = this;
    var audio = this._ensureAudio();
    var from = clamp01(this.config.initialVolume);
    var to = clamp01(this.config.targetVolume);
    var duration = Math.max(0, this.config.fadeDuration || 0);

    if (this._fadeRaf) cancelAnimationFrame(this._fadeRaf);
    if (duration === 0) {
      audio.volume = to;
      return;
    }

    audio.volume = from;
    this.fading = true;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;
      var t = Math.min(1, elapsed / duration);
      audio.volume = from + (to - from) * easeInOutCubic(t);
      if (t < 1) {
        self._fadeRaf = requestAnimationFrame(step);
      } else {
        self.fading = false;
        self._fadeRaf = null;
      }
    }
    this._fadeRaf = requestAnimationFrame(step);
  };

  WeddingMusicController.prototype.setVolume = function (v) {
    var audio = this._ensureAudio();
    audio.volume = clamp01(v);
  };

  WeddingMusicController.prototype.getCurrentTime = function () {
    return this.audio ? this.audio.currentTime : 0;
  };

  WeddingMusicController.prototype.isPlaying = function () {
    return !!(this.audio && this.started && !this.audio.paused);
  };

  WeddingMusicController.prototype.onChange = function (fn) {
    this.listeners.push(fn);
    return function unsubscribe() {
      var i = this.listeners.indexOf(fn);
      if (i > -1) this.listeners.splice(i, 1);
    }.bind(this);
  };

  WeddingMusicController.prototype._emit = function () {
    var state = { playing: this.isPlaying(), started: this.started };
    this.listeners.forEach(function (fn) {
      try { fn(state); } catch (e) {}
    });
  };

  WeddingMusicController.prototype.destroy = function () {
    if (this._fadeRaf) cancelAnimationFrame(this._fadeRaf);
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.started = false;
    this.listeners = [];
  };

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  // --- Singleton accessor: guarantees exactly one audio element ever exists ---
  WeddingMusicController.getInstance = function () {
    if (!global.__weddingMusicInstance) {
      global.__weddingMusicInstance = new WeddingMusicController(readConfig());
    }
    return global.__weddingMusicInstance;
  };

  global.WeddingMusicController = WeddingMusicController;
})(window);
