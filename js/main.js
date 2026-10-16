/* =====================================================================
   How the site works. The content (images, sounds, text) is in config.js.

   Flow:
   1. Closed card      click / → key  → card opens (cover on the left, cake on the right)
   2. Cake             she blows into the mic → candle goes out, smoke rises
   3. Video            plays in a box over the darkened card → page turns by itself
   4. Envelope         click → closed envelope changes to the open one
   5. Letter           click the open envelope → the letter opens over the darkened card

   The background song plays the whole time, except during the video.
   ===================================================================== */

const $ = (id) => document.getElementById(id);

// ---- Laptop: open card (two pages). Phone: one page at a time ---------
// Decided by the screen shape when the page loads.
const spread = window.innerWidth > window.innerHeight;
document.body.classList.add(spread ? "spread" : "single");
if (!spread) document.querySelectorAll(".spread-only").forEach((page) => page.remove());

// ---- Put the content from config.js into the page -------------------
document.querySelectorAll(".img-cover").forEach((img) => (img.src = CONFIG.pages.cover));
$("img-cake-lit").src = CONFIG.pages.cakeLit;
$("img-cake-unlit").src = CONFIG.pages.cakeUnlit;
$("img-cake-back")?.setAttribute("src", CONFIG.pages.cakeUnlit);
$("img-envelope").src = CONFIG.pages.envelopeOpen;

if (CONFIG.pages.envelopeClosed) $("envelope-closed").src = CONFIG.pages.envelopeClosed;
else $("envelope-closed").remove();

const video = $("video");
if (CONFIG.video) video.src = CONFIG.video;

// ---- Sounds ---------------------------------------------------------
function loadSound(src, volume = CONFIG.sounds.volume) {
  if (!src) return null;
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;
  return audio;
}

const sounds = {
  pageTurn: loadSound(CONFIG.sounds.pageTurn),
  blowOut: loadSound(CONFIG.sounds.blowOut),
  envelopeOpen: loadSound(CONFIG.sounds.envelopeOpen),
  openOnLaptop: loadSound(CONFIG.voice.openOnLaptop),
  blowHint: loadSound(CONFIG.voice.blowHint),
};

const music = loadSound(CONFIG.music.file, 0);
if (music) music.loop = true;

function play(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {}); // ignore if the browser blocks it
}

function isPlaying(sound) {
  return sound && !sound.paused && !sound.ended;
}

// Smoothly changes a sound's volume to `target` over `seconds`.
// Pauses it when it reaches 0, so it carries on from the same spot later.
function fade(sound, target, seconds) {
  if (!sound) return;
  cancelAnimationFrame(sound.fadeFrame);
  if (target > 0 && sound.paused) sound.play().catch(() => {});

  const start = sound.volume;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min(1, (now - startTime) / (seconds * 1000));
    sound.volume = start + (target - start) * progress;
    if (progress < 1) sound.fadeFrame = requestAnimationFrame(step);
    else if (target === 0) sound.pause();
  }
  sound.fadeFrame = requestAnimationFrame(step);
}

// Browsers only allow sound after the visitor has clicked something.
// On her first click we start the song and quietly "unlock" every sound and
// the video, so they can play later on their own (e.g. when she blows).
let unlocked = false;
let audioContext = null; // used to listen to the microphone

function unlockMedia() {
  if (unlocked) return;
  unlocked = true;

  const toUnlock = [sounds.blowOut, sounds.envelopeOpen, sounds.blowHint];
  if (CONFIG.video) toUnlock.push(video);

  for (const media of toUnlock) {
    if (!media) continue;
    media.muted = true;
    media
      .play()
      .then(() => {
        media.pause();
        media.currentTime = 0;
      })
      .catch(() => {})
      .finally(() => (media.muted = false));
  }

  fade(music, CONFIG.music.volume, CONFIG.music.fadeSeconds);
  audioContext = new AudioContext();
}

// ---- The card (page-flip library, see lib/) --------------------------
const pageFlip = new St.PageFlip($("book"), {
  width: 1414, // size of the page images; only the ratio matters
  height: 2000,
  size: "stretch",
  // Phone: a huge minWidth forces one page at a time (see #book in style.css).
  minWidth: spread ? 100 : 5000,
  maxWidth: 10000,
  maxHeight: 10000,
  usePortrait: !spread,
  showCover: true, // the cover sits alone, like a closed card
  flippingTime: 1100, // milliseconds per page turn
  maxShadowOpacity: 0.6,
  drawShadow: true,
  useMouseEvents: false, // we decide when a page may turn (code below)
  showPageCorners: false,
});
const pages = [...document.querySelectorAll(".page")];
pageFlip.loadFromHTML(pages);

// Which page is on the right-hand side (or the only page, on a phone).
function currentPage() {
  const index = pageFlip.getCurrentPageIndex();
  const right = spread && index > 0 ? index + 1 : index;
  return pages[right]?.id;
}

function setClosed(closed) {
  $("book-holder").classList.toggle("closed", closed);
}
setClosed(true);

let busy = false; // true while a page is turning or something is playing
let blown = false;
let envelopeOpened = false;

pageFlip.on("changeState", (e) => {
  busy = e.data !== "read";
});

// Runs every time a page turn finishes.
pageFlip.on("flip", () => {
  if (currentPage() === "page-cake" && !blown) startListeningForBlow();
  else stopListeningForBlow();
});

function turnForward() {
  setClosed(false);
  play(sounds.pageTurn);
  pageFlip.flipNext("bottom");
}

function turnBack() {
  if (pageFlip.getCurrentPageIndex() <= 1) setClosed(true); // back to the closed card
  play(sounds.pageTurn);
  pageFlip.flipPrev("bottom");
}

// ---- What a click / key press does on each page -----------------------
const onPhone = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
let laptopVoicePlayed = false;

function next() {
  if (busy) return;
  const page = currentPage();

  if (page === "page-cover") {
    // On a phone, the first tap plays the "open on your laptop" voice note.
    if (onPhone && sounds.openOnLaptop && !laptopVoicePlayed) {
      laptopVoicePlayed = true;
      play(sounds.openOnLaptop);
      return;
    }
    sounds.openOnLaptop?.pause();
    turnForward();
  } else if (page === "page-cake") {
    if (blown) turnForward(); // only if she's coming back to this page
  } else if (page === "page-envelope") {
    if (!envelopeOpened) openEnvelope();
    else openLetter();
  }
}

function previous() {
  if (busy || pageFlip.getCurrentPageIndex() === 0) return;
  turnBack();
}

$("book-holder").addEventListener("click", () => {
  unlockMedia();
  next();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") return closeLetter();
  if (!$("letter-overlay").hidden) {
    if (e.key === "ArrowRight") turnLetter(1);
    if (e.key === "ArrowLeft") turnLetter(-1);
    return;
  }
  if (!$("video-overlay").hidden) return;
  unlockMedia();
  if (["ArrowRight", " ", "Enter"].includes(e.key)) {
    e.preventDefault();
    next();
  } else if (e.key === "ArrowLeft") {
    previous();
  }
});

// ---- Blowing out the candle ------------------------------------------
let micStream = null;
const debug = new URLSearchParams(location.search).has("debug");
if (debug) $("mic-meter").hidden = false;
let listening = false;
let hintTimer = null;

async function startListeningForBlow() {
  if (CONFIG.voice.blowHint) {
    hintTimer = setTimeout(() => play(sounds.blowHint), CONFIG.voice.blowHintAfterSeconds * 1000);
  }

  try {
    // All the browser's voice filters off: a blow *is* noise, and on a Mac
    // echo cancellation turns on a voice filter that removes it.
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
  } catch (err) {
    console.warn("No microphone, she can click the flame instead.", err);
    return;
  }
  if (blown || currentPage() !== "page-cake") {
    stopListeningForBlow();
    return;
  }

  audioContext ??= new AudioContext();
  await audioContext.resume();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  audioContext.createMediaStreamSource(micStream).connect(analyser);
  const samples = new Float32Array(analyser.fftSize);

  listening = true;
  let loudSince = null;
  let background = 0; // the room's normal noise level, learned while it's quiet

  // Checked on a timer rather than every animation frame, so it keeps
  // working even if the browser slows animations down.
  const timer = setInterval(() => {
    if (!listening) return clearInterval(timer);

    // Volume of the last few milliseconds (root mean square, 0..1).
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const s of samples) sum += s * s;
    const volume = Math.sqrt(sum / samples.length);

    const threshold = Math.max(CONFIG.blow.sensitivity, background * CONFIG.blow.aboveBackground);
    // Ignore the mic while your voice note plays, so it can't blow the candle.
    const loud = volume > threshold && !isPlaying(sounds.blowHint);

    // Slowly follow the background noise, but only while she isn't blowing.
    if (!loud) background = background * 0.97 + volume * 0.03;

    if (debug) $("mic-meter").textContent = `mic ${volume.toFixed(3)}\nneeds ${threshold.toFixed(3)}`;

    if (!loud) loudSince = null;
    else if (loudSince === null) loudSince = performance.now();
    else if (performance.now() - loudSince >= CONFIG.blow.holdMs) blowOutCandle();
  }, 30);
}

function stopListeningForBlow() {
  listening = false;
  clearTimeout(hintTimer);
  micStream?.getTracks().forEach((track) => track.stop()); // mic light turns off
  micStream = null;
}

function blowOutCandle() {
  if (blown) return;
  blown = true;
  stopListeningForBlow();
  sounds.blowHint?.pause();

  play(sounds.blowOut);
  $("page-cake").classList.add("blown"); // fades to the unlit image (style.css)
  smoke();

  busy = true;
  setTimeout(playVideo, CONFIG.secondsBeforeVideo * 1000);
}

$("candle-zone").addEventListener("click", (e) => {
  if (!CONFIG.blow.tapCandleBackup) return;
  e.stopPropagation();
  unlockMedia();
  blowOutCandle();
});

// ---- Smoke trail from the wick ---------------------------------------
// Little soft grey puffs that rise, sway, grow and fade out.
const WICK = { x: 0.495, y: 0.335 }; // where the wick is, as a fraction of the page

function smoke() {
  const canvas = $("smoke");
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = (canvas.width = canvas.clientWidth * scale);
  const height = (canvas.height = canvas.clientHeight * scale);
  const size = width / 70; // puff size, relative to the page

  const puffs = [];
  const startTime = performance.now();

  function frame(now) {
    const t = (now - startTime) / 1000; // seconds since the candle went out

    // New puffs for the first 1.6 seconds, fewer as it dies down.
    // Several per frame so they blend into one thin trail.
    for (let i = 0; i < 3; i++) {
      if (t < 1.6 && Math.random() < 1 - t / 1.8) {
        puffs.push({ born: t, sway: Math.random() * 0.6, drift: (Math.random() - 0.5) * 0.3 });
      }
    }

    ctx.clearRect(0, 0, width, height);
    for (const p of puffs) {
      const age = t - p.born;
      const life = age / 2.4; // each puff lasts 2.4 seconds
      if (life > 1) continue;

      const x = WICK.x * width + Math.sin(p.sway + age * 3) * size * (0.5 + age * 2) + p.drift * size * age * 4;
      const y = WICK.y * height - age * size * 11;
      const r = size * (0.4 + age * 1.3);
      const alpha = 0.14 * (1 - life) * Math.min(1, age * 6);

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(215, 215, 215, ${alpha})`);
      g.addColorStop(1, "rgba(215, 215, 215, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (t < 4.2) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, width, height);
  }
  requestAnimationFrame(frame);
}

// ---- Overlays (video and letter) -------------------------------------
function showOverlay(overlay) {
  overlay.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("show")));
}

function hideOverlay(overlay, then) {
  overlay.classList.remove("show");
  setTimeout(() => {
    overlay.hidden = true;
    then?.();
  }, 800); // matches the fade in style.css
}

// ---- The video --------------------------------------------------------
const playButton = $("video-play");

function playVideo() {
  // No video yet (or the file is missing)? Go straight to the envelope.
  if (!CONFIG.video || video.error) return afterVideo();

  fade(music, 0, CONFIG.music.fadeSeconds);
  showOverlay($("video-overlay"));
  video.currentTime = 0;
  video.play().catch(() => (playButton.hidden = false));
}

playButton.addEventListener("click", () => {
  playButton.hidden = true;
  video.play();
});

let videoDone = false;

function afterVideo() {
  if (videoDone) return;
  videoDone = true;

  fade(music, CONFIG.music.volume, CONFIG.music.fadeSeconds);
  hideOverlay($("video-overlay"), () => {
    video.pause();
    busy = false;
    turnForward(); // automatically on to the envelope
  });
}

video.addEventListener("ended", afterVideo);
video.addEventListener("error", () => {
  if (!$("video-overlay").hidden) afterVideo();
});

// ---- The envelope and the letter ---------------------------------------
function openEnvelope() {
  envelopeOpened = true;
  play(sounds.envelopeOpen);
  $("page-envelope").classList.add("opened"); // closed fades to the open one (style.css)
}

// The letter is laid out on sheets of paper: words are added one at a time,
// and when a sheet is full the rest carries on onto a new sheet.
let sheets = [];
let firstSheet = 0; // the sheet showing on the left
const sheetsAtOnce = spread ? 2 : 1;

function newSheet() {
  const sheet = document.createElement("div");
  sheet.className = "letter-sheet";
  sheet.innerHTML = `<img src="${CONFIG.pages.letter}" alt="" draggable="false" /><div class="letter-text"></div>`;
  $("letter-sheets").append(sheet);
  sheets.push(sheet);
  return sheet.querySelector(".letter-text");
}

function layOutLetter() {
  $("letter-sheets").innerHTML = "";
  sheets = [];
  let text = newSheet();
  const full = () => text.scrollHeight > text.clientHeight + 1;

  for (const paragraph of CONFIG.letter.trim().split(/\n\s*\n/)) {
    let p = text.appendChild(document.createElement("p"));
    for (const word of paragraph.split(/\s+/)) {
      const piece = p.appendChild(document.createTextNode((p.textContent ? " " : "") + word));
      if (!full()) continue;
      // Doesn't fit: take the word back off and start a new sheet with it.
      piece.remove();
      if (!p.textContent) p.remove();
      text = newSheet();
      p = text.appendChild(document.createElement("p"));
      p.append(word);
    }
  }
  showSheets(0);
}

function showSheets(first) {
  firstSheet = first;
  sheets.forEach((sheet, i) => (sheet.hidden = i < first || i >= first + sheetsAtOnce));

  // "1–2 of 4  →" under the paper, so she knows there's more.
  const last = Math.min(first + sheetsAtOnce, sheets.length);
  const showing = last - first > 1 ? `${first + 1}–${last}` : `${first + 1}`;
  const more = last < sheets.length ? "  click for more →" : "";
  $("letter-count").textContent = sheets.length > sheetsAtOnce ? `${showing} of ${sheets.length}${more}` : "";
}

function turnLetter(direction) {
  const first = firstSheet + direction * sheetsAtOnce;
  if (first < 0 || first >= sheets.length) return;
  play(sounds.pageTurn);
  $("letter-sheets").classList.add("turning"); // quick fade (style.css)
  setTimeout(() => {
    showSheets(first);
    $("letter-sheets").classList.remove("turning");
  }, 300);
}

async function openLetter() {
  const overlay = $("letter-overlay");
  overlay.hidden = false; // must be on screen to measure how much fits
  await document.fonts.ready; // measure with the real handwriting font
  layOutLetter();
  showOverlay(overlay);
}

function closeLetter() {
  const overlay = $("letter-overlay");
  if (!overlay.hidden) hideOverlay(overlay);
}

// Click the paper for the next sheets; click the dark area around it to close.
$("letter-overlay").addEventListener("click", (e) => {
  if (e.target.closest(".letter-sheet, #letter-count")) turnLetter(1);
  else closeLetter();
});

// Re-flow the letter if the window changes size while it's open.
window.addEventListener("resize", () => {
  if (!$("letter-overlay").hidden) layOutLetter();
});

// ---- Party popper confetti when the site opens --------------------------
// Two poppers in the bottom corners shoot paper pieces up and inwards,
// then they flutter down and fade out.
const CONFETTI_COLORS = ["#a8262c", "#f3e6d3", "#f2a7b5", "#e0b04a", "#3d5fa8", "#7e8b3a"];

function partyPopper() {
  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = (canvas.width = innerWidth * scale);
  const height = (canvas.height = innerHeight * scale);

  const pieces = [];
  for (const side of [-1, 1]) {
    // side -1 = left popper, 1 = right popper
    for (let i = 0; i < 90; i++) {
      const angle = -Math.PI / 2 - side * (0.15 + Math.random() * 0.45); // up and inwards
      const speed = height * (0.022 + Math.random() * 0.016);
      pieces.push({
        x: side < 0 ? width * 0.03 : width * 0.97,
        y: height * 1.02,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: (9 + Math.random() * 9) * scale,
        spin: Math.random() * Math.PI,
        spinSpeed: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      });
    }
  }

  let last = performance.now();
  const start = last;
  function frame(now) {
    const step = Math.min(3, (now - last) / 16.7); // keeps speed the same on slow screens
    last = now;
    const age = (now - start) / 1000;

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = Math.max(0, Math.min(1, (5 - age) / 1.5)); // fade out at the end
    for (const p of pieces) {
      p.vy += height * 0.00035 * step; // gravity
      p.vx *= 0.985 ** step; // air slows them down
      p.vy *= 0.985 ** step;
      p.x += p.vx * step + Math.sin(age * 4 + p.spin) * scale * 0.6;
      p.y += p.vy * step;
      p.spin += p.spinSpeed * step;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.scale(1, Math.cos(p.spin * 2)); // looks like it's flipping over
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (age < 5) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, width, height);
  }
  requestAnimationFrame(frame);
}

partyPopper();
