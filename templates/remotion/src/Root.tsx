import { Composition } from "remotion"
import FILM from "../film.json"
import { Film } from "./Film"
import { FPS, H, W, sec } from "./lib"

export const Root = () => (
  <Composition id="Film" component={Film} durationInFrames={sec(FILM.length)} fps={FPS} width={W} height={H} />
)
