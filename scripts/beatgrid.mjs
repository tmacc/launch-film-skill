// node scripts/beatgrid.mjs music.mp3 <bpm you asked for> [--write film.json]
// Measures the track's real tempo and beat phase from its drum onsets, so cuts land on the music. A generated track
// asked for "96 BPM" can come back at 96.3: over 90 s that drifts more than a beat. Needs ffmpeg.
// Prints the BPM, the four candidate downbeats (one per beat of the first bar) with their onset strength; the
// strongest is usually beat 1. Listen and check before you trust it. --write puts bpm + downbeat into film.json.
import { execFileSync } from "child_process"
import fs from "fs"

const args = process.argv.slice(2)
const wi = args.indexOf("--write"), target = wi >= 0 ? args.splice(wi, 2)[1] : null
const [file, hintArg] = args
if (!file || !Number(hintArg)) { console.log("usage: node scripts/beatgrid.mjs music.mp3 <bpm you asked for> [--write film.json]"); process.exit(1) }

const SR = 11025, HOP = 128, WIN = 512
const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 30 })
const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4)

// Onset strength: rectified rise in log energy, frame by frame, minus a local mean; frames are timed at their centre.
const n = Math.floor((x.length - WIN) / HOP), e = new Float64Array(n), o = new Float64Array(n)
for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < WIN; j++) { const v = x[i * HOP + j]; s += v * v } e[i] = Math.log(1e-9 + s) }
for (let i = 1; i < n; i++) o[i] = Math.max(0, e[i] - e[i - 1])
const W = 16, flat = new Float64Array(n)
for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let k = Math.max(0, i - W); k < Math.min(n, i + W); k++) { s += o[k]; c++ } flat[i] = Math.max(0, o[i] - s / c) }
const rate = SR / HOP, dur = x.length / SR
const at = (t) => { const f = (t - WIN / 2 / SR) * rate, i = Math.floor(f), r = f - i; return i + 1 < n && i >= 0 ? flat[i] * (1 - r) + flat[i + 1] * r : 0 }

// Score a grid: sum of onset strength at every beat (and half-beat, lightly), over the whole track.
const score = (bpm, phase) => { const b = 60 / bpm; let s = 0; for (let t = phase; t < dur; t += b) s += at(t) + 0.3 * at(t + b / 2); return s }
const best = (lo, hi, step) => {
  let top = { s: -1 }
  for (let bpm = lo; bpm <= hi; bpm += step) {
    const b = 60 / bpm
    for (let p = 0; p < b; p += 1 / rate) { const s = score(bpm, p); if (s > top.s) top = { s, bpm, phase: p } }
  }
  return top
}
// Search ±2 BPM around the tempo you asked for: a blind search locks onto half or double time.
const hint = Number(hintArg)
let g = best(hint - 2, hint + 2, 0.05)
g = best(g.bpm - 0.1, g.bpm + 0.1, 0.005)
const beat = 60 / g.bpm, bars = []
for (let k = 0; k < 4; k++) {
  const p = g.phase + k * beat; let s = 0
  for (let t = p; t < dur; t += 4 * beat) s += at(t)
  bars.push({ downbeat: +(p % (4 * beat)).toFixed(3), strength: +s.toFixed(1) })
}
bars.sort((a, b) => b.strength - a.strength)
console.log(`${file}: ${dur.toFixed(2)} s, ${g.bpm.toFixed(3)} BPM, beat ${beat.toFixed(4)} s, bar ${(4 * beat).toFixed(3)} s`)
console.log("downbeat candidates (strongest first):")
for (const c of bars) console.log(`  ${c.downbeat.toFixed(3)} s  strength ${c.strength}`)
if (target) {
  const film = JSON.parse(fs.readFileSync(target, "utf8"))
  Object.assign(film, { bpm: +g.bpm.toFixed(3), downbeat: bars[0].downbeat })
  fs.writeFileSync(target, JSON.stringify(film, null, 2) + "\n")
  console.log(`wrote bpm ${film.bpm}, downbeat ${film.downbeat} to ${target}`)
}
