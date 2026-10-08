# <Film name>: music prompt (Suno)

Instrumental. Fill the four boxes, generate 4–8 takes, pick by the hits in the bar map, then measure the take:
`node scripts/beatgrid.mjs music.mp3 <BPM> --write film.json`.

## Style of music

> Instrumental <genre and era> score, <instruments: 4–6 named sounds>, <BPM> BPM, <key>. <Mood in three adjectives>,
> <an image: e.g. a dawn over a neon city>. <The motif: e.g. a glassy four-note FM bell motif>, <drums>, <space:
> e.g. huge hall reverb, tape warmth>. <Arc: e.g. builds steadily to a triumphant final chord with a long reverb tail>.

## Lyrics (Instrumental on; section tags only, one per bar-map section)

```
[Intro: <sounds>, the four-note motif]
[<Section>: <what enters>]
[Build: <what tightens>]
[<Peak>: <the hit>]
[Outro: drums drop out, motif alone over pads, final major chord, long reverb tail]
[End]
```

## Exclude styles

> vocals, choir, vocal chops, EDM drop, dubstep, trap hi-hats, lo-fi, <anything that breaks the era or mood>

## Where it has to land

Paste the bar map's sections here (bars, start time, section). If a take nails the feel but misses a hit, keep it
and move the cut.

## Variant: a timestamped prompt for generators without tags

> Instrumental only. <style sentence>. <BPM> BPM, steady tempo, <key>, <length> seconds.
> 0:00–0:<s>, "<section>": <sounds and what they do>.
> 0:<s>–0:<s>, "<section>": <…>.
> Played completely straight. No vocals, no vocal chops, no sound effects, <excludes>.
