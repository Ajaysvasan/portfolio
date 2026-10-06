// Cinematic, procedural sound design with the Web Audio API. Everything is
// synthesized — saturated sub-bass impacts, flanged whooshes, risers, the
// void's ambience, Hollow Purple's charge and launch — so the site ships no audio.
//
// Optional recordings: put audio files in public/audio/ and set their paths in
// CLIP_FILES to play them instead of the synthesized sound. The voice lines have
// no synthesized stand-in. Only publish recordings you have the rights to.
//
// Browsers only allow audio after a user gesture: call `unlock()` from one.

const PREF_KEY = 'gojo-sfx'
const MASTER_GAIN = 0.85

export const CLIP_FILES = {
  ryoikiTenkai: null, // Gojo: "Ryōiki Tenkai" — on the 領域展開 card, e.g. 'audio/ryoiki-tenkai.mp3'
  muryokusho: null, // Gojo: "Muryōkūsho" — as 無量空処 appears, e.g. 'audio/muryokusho.mp3'
  infiniteVoid: null, // the domain opening and its ambience, e.g. 'audio/infinite-void.mp3'
  purpleCharge: null, // Red and Blue converging, e.g. 'audio/hollow-purple-charge.mp3'
  purpleFire: null, // the launch, e.g. 'audio/hollow-purple-fire.mp3'
}

let ctx = null
let master = null
let roomIn = null
let hallIn = null
let gritIn = null
let white = null
let brown = null
let enabled = readPref()
const listeners = new Set()
const clips = {}

function readPref() {
  try {
    return localStorage.getItem(PREF_KEY) !== 'off'
  } catch {
    return true
  }
}

// ---------------------------------------------------------------------------
// engine

function noiseBuffer(isBrown) {
  const len = ctx.sampleRate * 3
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  let b = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    if (isBrown) {
      b = (b + 0.02 * w) / 1.02
      d[i] = b * 3.5
    } else {
      d[i] = w
    }
  }
  return buf
}

/** Decaying stereo noise impulse: bright early reflections, dark tail. */
function impulse(seconds, decay) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const pre = Math.floor(sr * 0.025)
  const buf = ctx.createBuffer(2, len, sr)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    let lp = 0
    for (let i = pre; i < len; i++) {
      const p = (i - pre) / (len - pre)
      lp += (0.9 - 0.82 * p) * (Math.random() * 2 - 1 - lp)
      d[i] = lp * Math.pow(1 - p, decay)
    }
  }
  return buf
}

function reverb(seconds, decay) {
  const conv = ctx.createConvolver()
  conv.buffer = impulse(seconds, decay)
  const input = ctx.createGain()
  input.connect(conv).connect(master)
  return input
}

function shaper(k) {
  const ws = ctx.createWaveShaper()
  const curve = new Float32Array(2048)
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1
    curve[i] = Math.tanh(k * x) / Math.tanh(k)
  }
  ws.curve = curve
  ws.oversample = '4x'
  return ws
}

function build() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  ctx = new AC()

  const glue = ctx.createDynamicsCompressor()
  glue.threshold.value = -18
  glue.knee.value = 12
  glue.ratio.value = 3
  glue.attack.value = 0.01
  glue.release.value = 0.4
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -2
  limiter.knee.value = 0
  limiter.ratio.value = 20
  limiter.attack.value = 0.001
  limiter.release.value = 0.1
  glue.connect(limiter).connect(ctx.destination)

  master = ctx.createGain()
  master.gain.value = enabled ? MASTER_GAIN : 0
  master.connect(glue)

  white = noiseBuffer(false)
  brown = noiseBuffer(true)
  roomIn = reverb(1.6, 3)
  hallIn = reverb(5.5, 2.2)
  gritIn = ctx.createGain()
  gritIn.connect(shaper(2.5)).connect(master)
  loadClips()
  return true
}

async function loadClips() {
  await Promise.all(
    Object.entries(CLIP_FILES).map(async ([name, path]) => {
      if (!path) return
      try {
        const res = await fetch(import.meta.env.BASE_URL + path)
        if (!res.ok || (res.headers.get('content-type') || '').includes('text/html')) return
        clips[name] = await ctx.decodeAudioData(await res.arrayBuffer())
      } catch {
        /* unreadable — the synthesized version plays */
      }
    }),
  )
}

/** Create/resume the audio context. Must run inside (or after) a user gesture. */
export function unlock() {
  if (!ctx && !build()) return Promise.resolve()
  return ctx.state === 'suspended' ? ctx.resume().catch(() => {}) : Promise.resolve()
}

export const isEnabled = () => enabled

export function setEnabled(on) {
  enabled = on
  try {
    localStorage.setItem(PREF_KEY, on ? 'on' : 'off')
  } catch {
    /* private mode — preference just isn't remembered */
  }
  if (ctx) master.gain.setTargetAtTime(on ? MASTER_GAIN : 0, ctx.currentTime, 0.05)
  if (on) unlock()
  listeners.forEach((fn) => fn(on))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

// ---------------------------------------------------------------------------
// building blocks

const live = () => ctx && enabled && ctx.state === 'running'
const at = (delay = 0) => ctx.currentTime + 0.01 + delay

function level(v) {
  const g = ctx.createGain()
  g.gain.value = v
  return g
}

function bus({ gain = 1, pan = 0, room = 0, hall = 0, grit = false } = {}) {
  const input = level(gain)
  const p = ctx.createStereoPanner()
  p.pan.value = pan
  input.connect(p)
  p.connect(grit ? gritIn : master)
  if (room) p.connect(level(room)).connect(roomIn)
  if (hall) p.connect(level(hall)).connect(hallIn)
  return { input, pan: p.pan }
}

function play(buf, t, dur) {
  const s = ctx.createBufferSource()
  s.buffer = buf
  s.loop = true
  s.start(t, Math.random() * 2)
  s.stop(t + dur + 0.1)
  return s
}

function osc(type, freq, t, dur) {
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  o.start(t)
  o.stop(t + dur + 0.1)
  return o
}

function filter(type, freq, q = 0.7) {
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  return f
}

function sweep(param, t, from, to, dur) {
  param.setValueAtTime(from, t)
  param.exponentialRampToValueAtTime(to, t + dur)
}

/** exponential attack/release envelope starting at `t` */
function vca(t, attack, peak, release) {
  const g = level(0)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release)
  return g
}

/** exponential rise that cuts off dead — the "sucked in" feel before a hit */
function swellTo(t, dur, peak = 1) {
  const g = level(0)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + dur)
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.04)
  return g
}

/** feedback comb with a sweeping delay — a jet-like, tearing flange */
function comb(t, dur, from, to, feedback) {
  const input = ctx.createGain()
  const output = ctx.createGain()
  const d = ctx.createDelay(0.05)
  sweep(d.delayTime, t, from, to, dur)
  input.connect(output)
  input.connect(d)
  d.connect(level(feedback)).connect(d)
  d.connect(output)
  return { input, output }
}

/** a bed that runs until its returned stop(fadeSeconds) is called */
function sustained(gainNode, sources) {
  let stopped = false
  return (fade = 1.2) => {
    if (stopped || !ctx) return
    stopped = true
    const now = ctx.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(Math.max(0.0001, gainNode.gain.value), now)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + fade)
    sources.forEach((s) => s.stop(now + fade + 0.1))
  }
}

function playClip(name, { delay = 0, gain = 1, pan = 0, hall = 0.12 } = {}) {
  if (!live() || !clips[name]) return false
  const out = bus({ gain, pan, hall })
  const s = ctx.createBufferSource()
  s.buffer = clips[name]
  s.connect(out.input)
  s.start(at(delay))
  return true
}

export const hasClip = (name) => !!clips[name]

// ---------------------------------------------------------------------------
// effects

/** Cinematic impact: saturated sub drop, thump, crack and a long rumbling tail. */
export function impact({ delay = 0, intensity = 1, pitch = 1, hall = 0.45 } = {}) {
  if (!live()) return
  const t = at(delay)
  const out = bus({ gain: intensity, room: 0.1, hall, grit: true })
  const sub = osc('sine', 85 * pitch, t, 2.6)
  sub.frequency.exponentialRampToValueAtTime(27 * pitch, t + 1.5)
  sub.connect(vca(t, 0.003, 0.9, 2.3)).connect(out.input)
  const lp = filter('lowpass', 1100, 1)
  sweep(lp.frequency, t, 1100 * pitch, 60, 1.1)
  play(brown, t, 1.5).connect(lp).connect(vca(t, 0.002, 1.1, 1.3)).connect(out.input)
  play(white, t, 0.1).connect(filter('bandpass', 2200, 0.7)).connect(vca(t, 0.0008, 0.3, 0.07)).connect(out.input)
  play(brown, t, 4).connect(filter('lowpass', 150, 0.7)).connect(vca(t + 0.04, 0.35, 0.7, 3.2)).connect(out.input)
}

/** Heavy air displacement with a flanged, jet-like edge. */
export function whoosh({ delay = 0, dur = 0.7, gain = 0.5, pan = [-0.5, 0.5], bright = 1 } = {}) {
  if (!live()) return
  const t = at(delay)
  const out = bus({ gain, pan: pan[0], room: 0.15, hall: 0.2 })
  out.pan.setValueAtTime(pan[0], t)
  out.pan.linearRampToValueAtTime(pan[1], t + dur)
  const env = level(0)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(1, t + dur * 0.6)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  env.connect(out.input)
  const lo = filter('bandpass', 140, 1.4)
  sweep(lo.frequency, t, 120, 520, dur * 0.6)
  lo.frequency.exponentialRampToValueAtTime(100, t + dur)
  play(brown, t, dur).connect(lo).connect(level(2)).connect(env)
  const hi = filter('bandpass', 800, 1.8)
  sweep(hi.frequency, t, 600 * bright, 3800 * bright, dur * 0.6)
  hi.frequency.exponentialRampToValueAtTime(700 * bright, t + dur)
  const c = comb(t, dur, 0.009, 0.0012, 0.6)
  play(white, t, dur).connect(hi).connect(c.input)
  c.output.connect(level(0.5)).connect(env)
}

/** Rising rush that slams shut — leads into a hit. */
export function riser({ delay = 0, dur = 0.8, gain = 0.45 } = {}) {
  if (!live()) return
  const t = at(delay)
  const out = bus({ gain, room: 0.1, hall: 0.25 })
  const bp = filter('bandpass', 200, 2.5)
  sweep(bp.frequency, t, 180, 7500, dur)
  play(white, t, dur).connect(bp).connect(swellTo(t, dur, 1.6)).connect(out.input)
  const lo = filter('lowpass', 120, 1)
  sweep(lo.frequency, t, 100, 1400, dur)
  play(brown, t, dur).connect(lo).connect(swellTo(t, dur, 1.2)).connect(out.input)
  const s = osc('sine', 38, t, dur)
  sweep(s.frequency, t, 38, 150, dur)
  s.connect(swellTo(t, dur, 0.35)).connect(out.input)
}

/** The Six Eyes catching the light: a faint, high glint and a ring that hangs in the air. */
export function glint({ delay = 0, gain = 0.35 } = {}) {
  if (!live()) return
  const t = at(delay)
  const out = bus({ gain, room: 0.2, hall: 0.7 })
  play(white, t, 0.25).connect(filter('highpass', 7500)).connect(vca(t, 0.002, 0.5, 0.2)).connect(out.input)
  for (const f of [4186, 5274]) osc('sine', f, t, 0.8).connect(vca(t, 0.001, 0.06, 0.6)).connect(out.input)
  const ring = osc('sine', 2637, t, 2.4)
  osc('sine', 5, t, 2.4).connect(level(9)).connect(ring.frequency)
  const rg = level(0)
  rg.gain.setValueAtTime(0.0001, t)
  rg.gain.exponentialRampToValueAtTime(0.04, t + 0.35)
  rg.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
  ring.connect(rg).connect(out.input)
}

/** Low dread under the opening shots: brown-noise rumble and a breathing sub. */
export function drone() {
  if (!live()) return () => {}
  const t = at()
  const out = bus({ gain: 1, hall: 0.3 })
  const g = level(0)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.5, t + 2)
  g.connect(out.input)
  const lp = filter('lowpass', 110, 1)
  const rumble = play(brown, t, 30)
  rumble.connect(lp).connect(level(1.4)).connect(g)
  const sub = osc('sine', 36.7, t, 30)
  const breath = level(0.25)
  const lfo = osc('sine', 0.2, t, 30)
  lfo.connect(level(0.15)).connect(breath.gain)
  sub.connect(breath).connect(g)
  return sustained(g, [rumble, sub, lfo])
}

/** The domain opening: the floor drops away into a vast, humming space. */
function domainOpen(delay) {
  const t = at(delay)
  impact({ delay, intensity: 1, pitch: 0.7, hall: 0.9 })
  const out = bus({ gain: 0.55, room: 0.05, hall: 0.85 })
  const fall = filter('bandpass', 2400, 5)
  sweep(fall.frequency, t, 2600, 50, 2)
  play(white, t, 2.1).connect(fall).connect(vca(t, 0.02, 3, 2)).connect(out.input)
  play(brown, t, 3).connect(filter('lowpass', 300, 0.7)).connect(vca(t, 0.4, 1.2, 2.5)).connect(out.input)
  // static scattering into the distance
  for (let i = 0; i < 24; i++) {
    const tt = t + 0.15 + Math.random() * 1.8
    const p = ctx.createStereoPanner()
    p.pan.value = Math.random() * 1.6 - 0.8
    play(white, tt, 0.05)
      .connect(filter('bandpass', 1500 + Math.random() * 3500, 3))
      .connect(vca(tt, 0.002, 0.15, 0.04 + Math.random() * 0.08))
      .connect(p)
      .connect(out.input)
  }
}

/** Inside the Infinite Void: a beating sub hum, cosmic wind and a thin high whine. */
function voidAmbience(delay) {
  const t = at(delay)
  const out = bus({ gain: 1, hall: 0.7 })
  const g = level(0)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.4, t + 1.5)
  g.connect(out.input)
  const sources = []
  for (const [f, v] of [[41.2, 0.35], [41.7, 0.35], [82.4, 0.12]]) {
    const o = osc('sine', f, t, 30)
    o.connect(level(v)).connect(g)
    sources.push(o)
  }
  const rumble = play(brown, t, 30)
  rumble.connect(filter('lowpass', 90, 0.7)).connect(level(0.8)).connect(g)
  sources.push(rumble)
  for (const [f, q, rate, v] of [[320, 8, 0.07, 1.4], [760, 10, 0.11, 0.9], [1700, 12, 0.05, 0.35]]) {
    const bp = filter('bandpass', f, q)
    const drift = osc('sine', rate, t, 30)
    drift.connect(level(f * 0.3)).connect(bp.frequency)
    const wind = play(white, t, 30)
    wind.connect(bp).connect(level(v)).connect(g)
    sources.push(drift, wind)
  }
  for (const f of [3520, 3527]) {
    const o = osc('sine', f, t, 30)
    o.connect(level(0.003)).connect(g)
    sources.push(o)
  }
  return sustained(g, sources)
}

/**
 * Domain Expansion: Infinite Void. Plays the recording if one is set, otherwise
 * the synthesized opening + ambience. Returns stop(fadeSeconds) for the ambience.
 */
export function infiniteVoid({ delay = 0 } = {}) {
  if (!live()) return () => {}
  if (playClip('infiniteVoid', { delay })) return () => {}
  domainOpen(delay)
  return voidAmbience(delay)
}

/** A voice line — only plays if a recording has been provided. */
export function voice(name, { delay = 0 } = {}) {
  playClip(name, { delay, gain: 1.1, hall: 0.18 })
}

/**
 * Red (a heavy rumble) and Blue (a howling vortex) close in from either side and
 * throb faster until they collide at 62% of `dur`; Purple then growls until launch.
 */
export function purpleCharge({ dur = 0.5, intensity = 0.7, dir = 1 } = {}) {
  if (!live()) return
  if (playClip('purpleCharge', { gain: intensity })) return
  const t = at()
  const merge = dur * 0.62
  const out = bus({ gain: 0.6 * intensity, room: 0.1, hall: 0.3, grit: true })

  const am = level(0.55)
  const rate = osc('sine', 6, t, merge)
  sweep(rate.frequency, t, 6, 30, merge)
  rate.connect(level(0.45)).connect(am.gain)
  am.connect(swellTo(t, merge, 1)).connect(out.input)

  const rf = filter('lowpass', 140, 4)
  sweep(rf.frequency, t, 140, 600, merge)
  const rp = ctx.createStereoPanner()
  rp.pan.setValueAtTime(-0.8 * dir, t)
  rp.pan.linearRampToValueAtTime(0, t + merge)
  play(brown, t, merge).connect(rf).connect(level(2.4)).connect(rp).connect(am)

  const bf = filter('bandpass', 2600, 6)
  sweep(bf.frequency, t, 2800, 520, merge)
  const bp = ctx.createStereoPanner()
  bp.pan.setValueAtTime(0.8 * dir, t)
  bp.pan.linearRampToValueAtTime(0, t + merge)
  play(white, t, merge).connect(bf).connect(level(1.5)).connect(bp).connect(am)

  osc('sine', 46, t, merge).connect(swellTo(t, merge, 0.5)).connect(am)

  const clicks = Math.round(8 + merge * 36)
  for (let i = 0; i < clicks; i++) {
    const ct = t + merge * Math.sqrt(Math.random())
    play(white, ct, 0.03)
      .connect(filter('bandpass', 700 + Math.random() * 2500, 2))
      .connect(vca(ct, 0.0008, 0.25 + Math.random() * 0.45, 0.015 + Math.random() * 0.03))
      .connect(out.input)
  }

  // the collision — Purple is born
  impact({ delay: merge + 0.01, intensity: 0.6 * intensity, pitch: 0.85, hall: 0.5 })

  // its ominous, growling throb until launch
  const tm = t + merge
  const humLen = dur - merge + 0.25
  const hlp = filter('lowpass', 380, 5)
  for (const f of [55, 55.9, 110.4]) osc('sawtooth', f, tm, humLen).connect(hlp)
  const trem = level(0.6)
  osc('sine', 14, tm, humLen).connect(level(0.4)).connect(trem.gain)
  const hg = level(0)
  hg.gain.setValueAtTime(0.0001, tm)
  hg.gain.exponentialRampToValueAtTime(0.7, tm + 0.06)
  hg.gain.setValueAtTime(0.7, t + dur)
  hg.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.2)
  hlp.connect(trem).connect(hg).connect(out.input)
}

/** The launch: a blast, a tearing flanged roar that travels with the sphere, and the rumble it leaves. */
export function purpleFire({ dur = 0.9, intensity = 0.7, dir = 1 } = {}) {
  if (!live()) return
  if (playClip('purpleFire', { gain: intensity, pan: -0.3 * dir })) return
  const t = at()
  impact({ intensity: Math.min(1, 0.4 + intensity), pitch: 0.6, hall: 0.7 })
  const out = bus({ gain: 0.85 * intensity, pan: -0.85 * dir, room: 0.1, hall: 0.45, grit: true })
  out.pan.setValueAtTime(-0.85 * dir, t)
  out.pan.linearRampToValueAtTime(0.9 * dir, t + dur)

  const lp = filter('lowpass', 5000, 0.7)
  sweep(lp.frequency, t, 5000, 140, dur * 1.4)
  play(brown, t, dur * 1.5).connect(lp).connect(vca(t, 0.005, 1.6, dur * 1.45)).connect(out.input)
  const air = filter('lowpass', 7000, 0.7)
  sweep(air.frequency, t, 7000, 400, dur)
  play(white, t, dur).connect(air).connect(vca(t, 0.004, 0.25, dur * 0.9)).connect(out.input)

  const c = comb(t, dur * 1.2, 0.011, 0.0007, 0.72)
  play(brown, t, dur * 1.3).connect(filter('lowpass', 1800)).connect(c.input)
  c.output.connect(vca(t, 0.02, 1.6, dur * 1.25)).connect(out.input)

  const roar = filter('lowpass', 260, 2)
  for (const f of [38, 41.3]) {
    const o = osc('sawtooth', f, t, dur * 1.4)
    sweep(o.frequency, t, f, f * 0.7, dur * 1.3)
    o.connect(roar)
  }
  roar.connect(vca(t, 0.03, 0.9, dur * 1.35)).connect(out.input)

  const tail = bus({ gain: 0.7 * intensity, hall: 0.9 })
  play(brown, t, 4.5).connect(filter('lowpass', 110, 0.7)).connect(vca(t + 0.1, 0.5, 1, 3.8)).connect(tail.input)
}

// ---------------------------------------------------------------------------
// Ryomen Sukuna — Malevolent Shrine (伏魔御厨子)

/** A blade cutting the air — Dismantle / Cleave. */
export function slash({ delay = 0, gain = 0.3, pan = 0, heavy = false } = {}) {
  if (!live()) return
  const t = at(delay)
  const out = bus({ gain, pan, room: 0.2, hall: 0.25, grit: heavy })
  const blade = filter('bandpass', 7000, 2.5)
  sweep(blade.frequency, t, 7500, 1400, 0.09)
  play(white, t, 0.14).connect(blade).connect(vca(t, 0.002, 1.6, 0.11)).connect(out.input)
  play(white, t + 0.01, 0.22).connect(filter('highpass', 2500)).connect(vca(t + 0.01, 0.01, 0.3, 0.18)).connect(out.input)
  if (heavy) impact({ delay, intensity: gain * 0.7, pitch: 1.2, hall: 0.4 })
}

/** A deep temple bell (bonshō): low, beating partials with a long decay. */
function bell({ delay = 0, base = 62, gain = 0.35 } = {}) {
  const t = at(delay)
  const out = bus({ gain, room: 0.1, hall: 0.7 })
  ;[[1, 1, 7], [2, 0.5, 5], [2.73, 0.35, 4], [3.9, 0.2, 3], [5.3, 0.1, 2]].forEach(([ratio, v, decay]) => {
    for (const beat of [0, 0.6]) osc('sine', base * ratio + beat, t, decay).connect(vca(t, 0.004, v * 0.5, decay)).connect(out.input)
  })
  play(brown, t, 0.3).connect(filter('lowpass', 400)).connect(vca(t, 0.002, 0.6, 0.25)).connect(out.input)
}

/** The King of Curses' growl: detuned, distorted sub saws with a slow tremolo. */
function growl({ delay = 0, dur = 1.8, gain = 0.5 } = {}) {
  const t = at(delay)
  const out = bus({ gain, hall: 0.4, grit: true })
  const lp = filter('lowpass', 220, 3)
  for (const f of [36, 38.3, 72.5]) osc('sawtooth', f, t, dur).connect(lp)
  const trem = level(0.6)
  osc('sine', 6, t, dur).connect(level(0.4)).connect(trem.gain)
  lp.connect(trem).connect(vca(t, 0.06, 1, dur)).connect(out.input)
}

/** Domain Expansion: Malevolent Shrine — impact, bell, growl and slashes everywhere at once. */
export function malevolentShrine() {
  if (!live()) return
  impact({ intensity: 1, pitch: 0.5, hall: 0.85 })
  bell({ delay: 0.02 })
  growl()
  for (let i = 0; i < 16; i++) {
    slash({ delay: 0.05 + Math.pow(Math.random(), 1.4), gain: 0.12 + Math.random() * 0.25, pan: Math.random() * 1.8 - 0.9 })
  }
  slash({ delay: 0.35, gain: 0.55, heavy: true }) // the cut through the title
}
