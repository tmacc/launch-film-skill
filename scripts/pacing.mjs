// node scripts/pacing.mjs [film.json] [--min 0.5] [--cps 15]
// Every super must stay up for ≥ min seconds (to find it after a cut) + characters ÷ cps (to read it while the
// picture moves). Reads `supers` from film.json: [text, appears, starts to leave], in bars (1-based, fractions are
// beats: 7.5 = bar 7, beat 3 in 4/4) or in seconds when "supersUnit": "s". Also flags supers that run past the
// film's end. Exit 1 if any is too short.
import fs from "fs"

const args = process.argv.slice(2)
const opt = (name, d) => { const i = args.indexOf(`--${name}`); return i >= 0 ? Number(args.splice(i, 2)[1]) : d }
const MIN = opt("min", 0.5), CPS = opt("cps", 15)
const file = args[0] ?? "film.json"
const film = JSON.parse(fs.readFileSync(file, "utf8"))
const beat = 60 / film.bpm, barLen = (film.beatsPerBar ?? 4) * beat, down = film.downbeat ?? 0
const bar = (n) => down + (n - 1) * barLen
const inBars = (film.supersUnit ?? "bar") === "bar"
const toSec = (v) => (inBars ? bar(v) : v)

let short = 0, warn = 0
for (const [text, a0, b0] of film.supers ?? []) {
  const a = toSec(a0), b = toSec(b0), need = MIN + text.length / CPS, have = b - a
  const at = `${a.toFixed(2)}–${b.toFixed(2)} s`
  if (have + 1e-9 < need) { short++; console.log(`SHORT  ${have.toFixed(2)} s < ${need.toFixed(2)} s  ${at}  ${text}`) }
  if (film.length && b > film.length) { warn++; console.log(`LATE   leaves at ${b.toFixed(2)} s, film ends ${film.length} s  ${text}`) }
}
console.log(`${(film.supers ?? []).length} supers checked: ${short} too short, ${warn} warnings (rule: ≥ ${MIN} s + chars ÷ ${CPS}).`)
process.exit(short ? 1 : 0)
