import { AbsoluteFill, Audio, staticFile } from "remotion"
import FILM from "../film.json"
import { Super, cut } from "./kit"
import { BEAT, bar, pop, pulse, tw, useT } from "./lib"

// One file per act once the film grows (act1.tsx ...). Every time is bar(n); fractions are beats.
// Replace these placeholder shots with the shot list: plates from public/plates/, UI built in React.

const Title = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ background: "#0b0b14", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 24, height: 24, borderRadius: 12, background: "#e0653a", opacity: 0.4 + 0.6 * pulse(t), transform: `scale(${pop(t, 0)})` }} />
  </AbsoluteFill>
)

const Card = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ background: "#111110", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      width: 900, padding: 48, borderRadius: 20, background: "#1c1c1b", border: "1px solid #34342f", color: "#ecece9",
      fontFamily: "Inter, system-ui, sans-serif", fontSize: 44, fontWeight: 600,
      opacity: tw(t, 0, BEAT / 2), transform: `translateY(${tw(t, 0, BEAT, 40, 0)}px) scale(${tw(t, 0, 4 * BEAT, 1, 1.06)})`,
    }}>Approve the fall restock</div>
  </AbsoluteFill>
)

// A plate shot, once public/plates/act1-desk.png exists (import Plate from ./kit):
//   cut(bar(9), bar(11), ({ t }) => <Plate t={t} name="act1-desk" />)

const Supers = () => {
  const t = useT()
  return <>{FILM.supers.map(([text, a, b]) => <Super key={String(text)} t={t} a={bar(Number(a))} b={bar(Number(b))} text={String(text)} />)}</>
}

export const Film = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {cut(0, bar(5), Title)}
    {cut(bar(5), FILM.length, Card)}
    <Supers />
    {FILM.music ? <Audio src={staticFile(FILM.music)} /> : null}
  </AbsoluteFill>
)
