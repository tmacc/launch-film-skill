---
name: launch-film
description: Direct and build a high-end product or launch film with the user, from brief to rendered MP4. Writes the brief and art direction, storyboard-frame and image-to-video prompts, a music prompt with a bar map, then builds the film in Remotion with motion graphics cut to the music's bar grid, checks reading pace and renders. Use when the user wants a launch video, product film, explainer, sizzle reel or motion-graphics piece.
---

# Launch film

You are the director and the editor. The user is the client: they approve the brief, pick takes and pay for any
generator. You write every document, every prompt and all the code.

**Three rules hold the whole way through.**

1. **Music sets the clock.** Every time in the film is a bar on the track's measured grid: `bar(n)`, where
   fractions are beats. Cut the picture to the music; never stretch the music to the picture.
2. **Generated images never carry words, logos or UI.** Plates are photographs of a world. Type and product UI are
   built in code, so they stay sharp, true and editable.
3. **Ask before spending.** Image, video, music and sound generators cost credits. Write the prompts, show them,
   and run a generator only when the user says so, or hand them the prompts to run themselves.

## Conversation and resume

At invocation, explain the next review in plain language. Ask only for missing brief inputs. At each review show the actual document, images or playable preview; state what is ready, ask for the decision, and save feedback by shot or timestamp. Maintain `docs/status.md` with the current stage, approved artifact versions, outstanding notes and next action. Resume from those files and confirm changed decisions. Export follows final approval; publication is a separate decision.

Work in a project folder (`<film>/`) with `docs/`, `plates/`, `public/` and the Remotion app. Templates are in this
skill's `templates/`, scripts in `scripts/`. Copy what you use into the project.

## 1. Brief

Interview the user briefly: who the viewer is, what the product truly does today, the one feeling the film must
leave behind, the length, where it will play. Then fill `templates/brief.md`:

- One viewer, one fear, one feeling.
- A **pain → picture → truth** table. Show the inverse of each pain, not the pain itself, and every row needs a
  product truth behind it. Cut any row you can't back up.
- A "never show" list and a "check before shipping" list (claims, trademarks in fictional names, links).

Length is bars: 24 bars at 96 BPM is 60 s, and 36 bars is 90 s. Get the user's yes on the brief before going on.

## 2. Art direction

Ask for 2–4 reference videos or stills. Make contact sheets (`scripts/contact-sheet.sh ref.mp4 refs/ref1.png`),
look at them, and name what to take from each: lighting, lens, pace, type, colour. Fill
`templates/art-direction.md`:

- **Two worlds, one rule:** the generated world (sets, cast, props) and the built screen (the product), each with
  its look, colour, texture, motion and type. Then the bridges that make them one brand: a shared colour meaning,
  match cuts where a real object becomes a UI element in the same place.
- **Cast**, written once, word for word, to paste into every prompt.
- Motion rules: one ease for the whole film, one camera move per chapter, hero crops (one element 2–4× size, the rest
  dimmed), cuts on the grid.

## 3. Shot list on the bar grid

Fill `templates/shot-list.md`: acts, then one row per shot with its bar, picture, source (plate, motion clip or
UI) and super. Then fill `templates/bar-map.md`: which section of music runs under which act, and the hits the
picture needs (the reveal, the peak, the logo). Pick a tempo whose bar is a round number of seconds: at 96 BPM a bar
is 2.5 s.

## 4. Storyboard frames (plates)

One prompt per plate in `prompts.json` → `plates` (pattern in `templates/prompts.json`), for an image model such as
gpt-image:

- Start with the cast lines word for word and attach the same cast reference image to every prompt.
- One frozen moment per plate; name the light, lens, depth of field and film look of the period.
- Every prompt ends: "No readable text, no logos, no words, no letters anywhere in the image."
- Where the real UI will appear (a monitor, a phone), ask for a flat, evenly lit screen facing camera so it can be
  pinned later.
- Landscape, widest aspect available; 3:2 crops cleanly to 16:9.

Keep each prompt in a file so a plate regenerates with one command. Review the plates as a contact sheet with the
user; regenerate the misses. A plate the user approves is final: motion starts from it.

## 5. Remotion scaffold

Copy `templates/remotion/` to the project and `npm install`. It holds:

- `film.json`: fps, size, bpm, downbeat, length, music file and supers, the one place timing lives.
- `src/lib.ts`: the grid (`bar(n)`, `BEAT`, `snap`, `pulse`), the one ease, `tw` (tween), `kf` (keyframes for
  a continuous camera move), `pop` (a spring that settles).
- `src/kit.tsx`: `cut(from, to, Scene)` for shots, `Plate` (a still with a slow push, or its motion clip),
  `Super` (words arrive one by one on the beat), `Pinned` (corner-pins UI onto a screen in a plate).
- `src/Film.tsx`: placeholder shots. Replace them act by act, one file per act once it grows.

Build the product UI as React from the product's real design tokens (colours, font, radii, spacing) with seeded,
believable data, and never as a screenshot scaled up. Put UI into a plate's monitor or phone with `Pinned` (`src/kit.tsx`): lay the UI out at
its own size and give the screen's four corners in frame pixels. Shots start and end on `bar()` values. Preview with `npm run studio`; check frames with
`npx remotion still src/index.ts Film --frame=<n>`.

## 6. Animatic, then image-to-video prompts

Before paid motion, assemble approved stills, supers and the selected music into a low-resolution Remotion animatic. If music is missing, prepare the music prompt in step 7 and obtain a selected take first. Measure its grid, then preview reveals, reading pace and transitions on that grid. Record the outgoing/incoming shot, visual connection and reason for each cut in the shot list. Inspect frames immediately before/after cuts and representative in-between frames. Obtain approval of the playable animatic before generating motion.

Before writing motion prompts, read `references/providers.md`; when Higgsfield is chosen, also read `references/higgsfield.md`. Identify the exact model/interface, inspect supported reference modes and settings, and record them with the prompt. Use that route’s supported duration and resolution rather than a universal clip length. State input roles, required end states and audio policy.

### Motion prompts

One prompt per approved plate in `prompts.json` → `motion`, for the selected image-to-video route:

- The camera first: "Locked-off camera, no camera movement" unless the shot needs a move ("Very slow push in",
  "Gentle handheld drift").
- One action in plain verbs, plus at most one ambient motion.
- Close with "Nothing else changes." or "Everything else stays exactly as in the image."
- If UI will be pinned into a screen: "the monitor screen stays perfectly still".

Clips land in `public/motion/<name>.mp4`. Use `<Plate motion>` only for clips the user approved; a failed clip falls
back to its still with a slow push.

## 7. Music prompt and bar map

Fill `templates/suno-prompt.md` from the bar map: style of music (era, 4–6 named sounds, BPM, key, mood, motif, the
arc), section tags only in the lyrics box with Instrumental on, and the exclude list. The user generates takes
and picks by the hits. Then measure the take, because a track asked for at 96 BPM can come back at 96.3:

```sh
node scripts/beatgrid.mjs public/music.mp3 96 --write film.json
```

It prints the measured BPM and four downbeat candidates; the strongest is usually beat 1. Listen to bar 1 in
Studio to confirm, then set `"music"` in `film.json`. Every `bar()` in the film moves with it. Optional sound design:
prompts in `prompts.json` → `sfx` (`[description, seconds]`), then a cue sheet of `[sound, bar(n), volume]` mixed
well under the music.

## 8. Pacing check

Supers live in `film.json` as `[text, from bar, to bar]`. Each must hold at least 0.5 s plus characters ÷ 15, so
the eye finds it after a cut and reads it while the picture moves; the caption lands before its action, and results
hold at least 1 s.

```sh
node scripts/pacing.mjs film.json    # exit 1 lists every super that is too short
```

Fix by lengthening the hold or cutting words, never by speeding the reading.

## 9. Render and review

Consult [current official Remotion skills/docs](https://www.remotion.dev/docs/ai/skills) for coding tasks. Use `npm ci` with the starter lockfile; run the smoke script before a full render. It renders a few seconds to verify browser launch, bundling and encoding; it is not full-film proof. The starter is intentionally silent until music is supplied.


```sh
npm run render                                   # out/film.mp4, H.264 CRF 16
scripts/contact-sheet.sh out/film.mp4 out/review.png      # 12 frames, or pass seconds
scripts/web-encode.sh out/film.mp4 out/film-web.mp4       # 720p30, ~10 MB for 90 s
```

Run `node scripts/media-check.mjs out/film.mp4 film.json out/media-check.json` from the film project after copying the root scripts. This verifies dimensions, fps, duration, audio presence when music is configured and full decode. It also saves black/freeze events and audio loudness/peak for review. Intentional darkness/holds are judged against the shot list; these diagnostics do not automatically certify visual quality. Inspect cut-boundary frames and any flagged interval, document accepted holds/darkness, and fix unintended defects before approval.

Watch it at full speed with sound, then go through it again with the user: sync on every hit, supers clear of the UI they
cover, no text in plates, every claim on the end card true today. Then make the cutdowns from the shot list (30 s,
9:16, 1:1) by recomposing the same scenes, not by cropping the master.

## Done

The master and the web encode render cleanly, `pacing.mjs` exits 0, every cut sits on the grid, and the user has
signed off the "check before shipping" list.
