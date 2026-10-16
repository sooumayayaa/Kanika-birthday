/* =====================================================================
   CONFIG — everything you'd want to change lives in this one file.
   Paths are relative to index.html. Leave a path as "" to turn it off.
   ===================================================================== */

const CONFIG = {
  // ---- The pages (your Canva exports, same size for all) -------------
  pages: {
    cover: "assets/pages/1-cover.png",
    cakeLit: "assets/pages/2-cake-lit.png", // candle burning
    cakeUnlit: "assets/pages/3-cake-unlit.png", // shown after she blows
    envelopeClosed: "assets/pages/4-envelope-closed.png", // until she clicks
    envelopeOpen: "assets/pages/4-envelope-open.png", // fades in when she clicks
    letter: "assets/pages/5-letter.png", // the paper that slides out and opens big
  },

  // ---- Background song -------------------------------------------------
  // Starts on her first click (browsers don't allow sound before that),
  // fades out while the video plays and fades back in afterwards.
  music: {
    file: "", // e.g. "assets/music/song.mp3"
    volume: 0.35, // keep it soft so it sits under the sound effects
    fadeSeconds: 2,
  },

  // ---- Sound effects (file names are case-sensitive on GitHub Pages) --
  sounds: {
    pageTurn: "assets/sounds/page-turn.mp3",
    blowOut: "assets/sounds/blow-out.mp3",
    envelopeOpen: "assets/sounds/envelope-open.mp3",
    volume: 0.9, // 0 = silent, 1 = full
  },

  // ---- Your voice notes ------------------------------------------------
  voice: {
    // Plays on her first tap, only on a phone. The page doesn't turn until
    // she taps again. Example: "open this on your laptop!"
    openOnLaptop: "", // e.g. "assets/voice/open-on-laptop.mp3"

    // Plays if she hasn't blown the candle after this many seconds.
    blowHint: "", // e.g. "assets/voice/blow-hint.mp3"
    blowHintAfterSeconds: 8,
  },

  // ---- Blowing out the candle -----------------------------------------
  blow: {
    // How loud the blow has to be. Lower = easier to trigger.
    // If it goes out from talking, raise it. If blowing does nothing, lower it.
    sensitivity: 0.12,
    // How long (milliseconds) she has to keep blowing.
    holdMs: 250,
    // Backup: clicking the flame also blows it out (e.g. if the mic is blocked).
    tapCandleBackup: true,
  },

  // ---- Your CapCut video (plays after the candle goes out) ------------
  video: "assets/video/birthday.mp4",
  secondsBeforeVideo: 2.5, // time to watch the smoke rise before the video fades in

  // ---- The letter ------------------------------------------------------
  // Written on the letter image when it opens. Line breaks are kept.
  // Leave it as `` if you design the letter in Canva instead and replace
  // assets/pages/5-letter.png with that image.
  // Example:
  //   letter: `Dear Kanika,
  //
  //   ...`,
  letter: ``,
};
