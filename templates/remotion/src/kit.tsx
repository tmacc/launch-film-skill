import React, { CSSProperties, ReactNode } from "react"
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion"
import { EASE, H, kf, sec, tw, useT } from "./lib"

/** A shot from a to e (film seconds, written as bar(n)); S gets local time t in seconds. */
export const cut = (a: number, e: number, S: React.ComponentType<{ t: number }>) => (
  <Sequence key={a} from={sec(a)} durationInFrames={sec(e) - sec(a)}><Wrap S={S} /></Sequence>
)
const Wrap = ({ S }: { S: React.ComponentType<{ t: number }> }) => <S t={useT()} />

/**
 * A storyboard plate (public/plates/<name>.png) with a slow camera, or its image-to-video clip
 * (public/motion/<name>.mp4) when `motion` is set. zoom: [[t, scale], ...]; the clip is muted under the score.
 */
export function Plate({ t, name, motion = false, zoom = [[0, 1.04], [6, 1.12]], fx = 50, fy = 50, children }: {
  t: number; name: string; motion?: boolean; zoom?: [number, number][]; fx?: number; fy?: number; children?: ReactNode
}) {
  const style = { width: "100%", height: "100%", objectFit: "cover" as const }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${kf(t, zoom)})`, transformOrigin: `${fx}% ${fy}%` }}>
        {motion ? <OffthreadVideo src={staticFile(`motion/${name}.mp4`)} muted style={style} /> : <Img src={staticFile(`plates/${name}.png`)} style={style} />}
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  )
}

/** A super: words arrive one by one (150 ms fade + 8 px rise), the line leaves at b. a and b are film seconds. */
export function Super({ t, a, b, text, x = 110, y = 930, size = 54, font = "Inter, system-ui, sans-serif" }: {
  t: number; a: number; b: number; text: string; x?: number; y?: number; size?: number; font?: string
}) {
  if (t < a - 0.05 || t > b + 0.4) return null
  const out = tw(t, b, b + 0.3)
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.8) 0%, transparent 40%)", opacity: tw(t, a - 0.05, a + 0.3) * (1 - out) }} />
      <div style={{ position: "absolute", left: x, bottom: H - y, maxWidth: 1500, fontFamily: font, fontSize: size, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#ecece9", opacity: 1 - out, transform: `translateY(${out * -8}px)` }}>
        {text.split(" ").map((w, i) => {
          const k = tw(t, a + i * 0.06, a + i * 0.06 + 0.15, 0, 1, EASE)
          return <span key={i} style={{ display: "inline-block", marginRight: size * 0.26, opacity: k, transform: `translateY(${(1 - k) * 8}px)` }}>{w}</span>
        })}
      </div>
    </AbsoluteFill>
  )
}

// Corner pinning: map a cw×ch box onto any four points of a plate (a homography as a CSS matrix3d), to put the
// real UI into a generated monitor or phone. Find the screen's corners in the plate at full size.
type P = [number, number]
const adj = (m: number[]) => [m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4], m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5], m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]]
const mm = (a: number[], b: number[]) => { const c = Array(9).fill(0); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j]; return c }
const mv = (m: number[], v: number[]) => [0, 1, 2].map((i) => m[3 * i] * v[0] + m[3 * i + 1] * v[1] + m[3 * i + 2] * v[2])
const basis = (p: P[]) => { const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1]; const v = mv(adj(m), [p[3][0], p[3][1], 1]); return mm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]) }
/** q: top-left, top-right, bottom-left, bottom-right, in frame pixels. */
export const pin = (cw: number, ch: number, q: [P, P, P, P]) => {
  const t = mm(basis(q), adj(basis([[0, 0], [cw, 0], [0, ch], [cw, ch]])))
  const n = t.map((x) => x / t[8])
  return `matrix3d(${[n[0], n[3], 0, n[6], n[1], n[4], 0, n[7], 0, 0, 1, 0, n[2], n[5], 0, n[8]].join(",")})`
}
/** A cw×ch child (the UI, laid out at its own size) pinned to four points on a plate. */
export const Pinned = ({ q, cw, ch, children, style }: { q: [P, P, P, P]; cw: number; ch: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: ch, transformOrigin: "0 0", transform: pin(cw, ch, q), ...style }}>{children}</div>
)
