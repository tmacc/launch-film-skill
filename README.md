# launch-film: a Claude skill for high-end launch videos

I made the DYNAMO launch film with Claude as my director and editor. Friends asked how, so this is the method, packaged as a skill. Claude writes the brief, the art direction, every
prompt for the image, video and music generators, and all the code. The film itself is built in
[Remotion](https://www.remotion.dev) with motion graphics cut to the bar grid of the music.

— Tim

The full story is in the field guide: [Making a launch film with Claude](https://launchtap.com/field-notes/making-a-launch-film-with-claude/).

## The worked example

<!-- VIDEO EMBED: drag dynamo-launch-v4-web.mp4 into this README in GitHub's web editor to get an inline player,
     or keep the link below, which points at the release asset. -->

[▶ Watch the DYNAMO launch film (93 s, MP4)](https://github.com/tmacc/launch-film-skill/releases/download/v0.1.0/dynamo-launch-v4-web.mp4)

How it was made:

- **Brief and script:** a viewer, a fear and one feeling; a pain → picture → truth table; six acts on a 36-bar
  timeline at 96 BPM (a bar is 2.5 s).
- **Art direction:** a sincere 1990 tech infomercial for the world, and a pixel-sharp product UI for the screen.
  Generated images never carry text, logos or UI.
- **Storyboard frames:** 20 photographic plates from an image model, with the same cast reference attached to
  every prompt.
- **Motion:** 16 of the plates turned into 6-second clips with an image-to-video model. Each prompt names the
  camera, one action, and "nothing else changes".
- **Music:** a Suno prompt with style, section tags, excludes and a bar map. The take measured 96.325 BPM with its
  first downbeat at 0.238 s, and every cut sits on that grid.
- **Build:** about 2,200 lines of Remotion that Claude wrote: the product UI rebuilt from its design tokens,
  plates with camera moves, UI corner-pinned into the monitors, supers that arrive word by word on the beat.
  Rendered at 1920×1080 and 60 fps.

## What the skill does

Claude follows nine steps in `SKILL.md`, and you approve at each gate:

1. **Brief:** one viewer, one feeling, and a claim behind every picture.
2. **Art direction** from your reference videos, using contact sheets Claude reads.
3. **Shot list on a bar grid:** every shot, super and hit written as a bar.
4. **Storyboard-frame prompts:** consistent cast, no text in images.
5. **Remotion scaffold:** `bar(n)` timing, one ease, camera keyframes, plates, corner pinning, supers.
6. **Image-to-video prompts** for the approved frames.
7. **Music prompt with a bar map**, then `beatgrid.mjs` measures the real tempo of the take.
8. **Pacing check:** every super holds at least 0.5 s plus characters ÷ 15.
9. **Render, review and a web encode** for the README or your site.

Claude asks before it runs any paid generator. You can also run the prompts yourself in whichever image, video and
music tools you already pay for.

## Install (Claude Code)

```sh
git clone https://github.com/tmacc/launch-film-skill ~/.claude/skills/launch-film
```

Then, in Claude Code: *"Use the launch-film skill to make a 60-second launch film for my product."*

To install it for one project only, clone it into `.claude/skills/launch-film` inside that repo.

Requires Node.js and ffmpeg (`brew install ffmpeg`). Remotion has its own
[license terms](https://www.remotion.dev/license) for companies.

## What's inside

| Path | What it is |
| --- | --- |
| `SKILL.md` | The steps Claude follows |
| `templates/brief.md`, `art-direction.md`, `shot-list.md`, `bar-map.md`, `suno-prompt.md` | The documents Claude fills in with you |
| `templates/prompts.json` | Prompt patterns for storyboard frames, image-to-video and sound effects |
| `templates/remotion/` | A starter film: `film.json` (grid and supers), `lib.ts` (timing), `kit.tsx` (shots, plates, supers, pinning) |
| `scripts/beatgrid.mjs` | Measures a track's real BPM and downbeat |
| `scripts/pacing.mjs` | Fails when a super is too short to read |
| `scripts/contact-sheet.sh` | A sheet of frames from any video, for references and review |
| `scripts/web-encode.sh` | A 720p web copy of the master (93 s came out under 10 MB) |

## License

MIT. See [LICENSE](LICENSE).

## Guided experience and optional providers

Invoke the skill in Claude, then review the brief, look, storyboard, stills-and-music animatic, motion takes and final render. Give feedback by shot or timestamp; approved artifacts and next steps stay in the project so you can resume. Higgsfield is optional for plates and motion; connected generation requires file-upload and credit approval, or you can run the prepared prompts manually. Provider notes are in `references/`. No generation account is needed to test the starter.

### Starter test

```sh
cd templates/remotion
npm ci
npm run check
npm run smoke
npm run render
node ../../scripts/media-check.mjs out/film.mp4 film.json out/media-check.json
```

The starter is silent. The smoke export checks Chrome/bundling/encoding; the full export and media report check the complete video. Review flagged dark/frozen intervals against intended holds. For real work add music, run the pacing check and watch the film with sound. See [official Remotion guidance](https://www.remotion.dev/docs/ai/skills) for current engineering practices.
