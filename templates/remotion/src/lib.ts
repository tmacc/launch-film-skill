import { Easing, interpolate, useCurrentFrame } from "remotion"
import FILM from "../film.json"

// The bar grid. bpm and downbeat come from the real track (scripts/beatgrid.mjs), never from the prompt.
// Every time in the film is written as bar(n): cuts, supers, camera moves, sound cues.
export const FPS = FILM.fps
export const W = FILM.width
export const H = FILM.height
export const BEAT = 60 / FILM.bpm
export const BAR = FILM.beatsPerBar * BEAT
export const DOWN = FILM.downbeat
export const sec = (s: number) => Math.round(s * FPS)
/** Start of bar n (1-based), in film seconds; fractions count beats (bar(7.5) = bar 7, beat 3 in 4/4). */
export const bar = (n: number) => DOWN + (n - 1) * BAR
/** The nearest grid line to s, on beats (div 1), half-beats (2) or 16ths (4). */
export const snap = (s: number, div = 1) => DOWN + Math.round(((s - DOWN) * div) / BEAT) * (BEAT / div)
/** 0..1..0 on every beat, for pulses. */
export const pulse = (t: number) => 0.5 - 0.5 * Math.cos(((t - DOWN) / BEAT) * Math.PI * 2)

/** One ease for the whole film: fast out. */
export const EASE = Easing.bezier(0.23, 1, 0.32, 1)
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1)

/** Local time in seconds inside the current Sequence. */
export const useT = () => useCurrentFrame() / FPS

/** Tween t over [a,b] into [from,to], clamped. */
export const tw = (t: number, a: number, b: number, from = 0, to = 1, ease: (x: number) => number = EASE) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })

/** Piecewise keyframes [[time, value], ...], eased per segment: one continuous camera move per chapter. */
export const kf = (t: number, keys: [number, number][], ease: (x: number) => number = IN_OUT) => {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]
    if (t <= t1) return interpolate(t, [t0, t1], [v0, v1], { easing: ease })
  }
  return keys[keys.length - 1][1]
}

/** A spring-like pop: overshoots once, then settles. */
export const pop = (t: number, a: number, dur = 0.45) => {
  const x = Math.max(0, Math.min(1, (t - a) / dur))
  if (x <= 0) return 0
  return 1 + Math.sin(x * Math.PI * 1.15) * 0.12 * (1 - x) - Math.pow(1 - x, 3)
}
