# Generation providers

Checked against linked documentation 8 October 2026; documentation review is not a tested generation. Before each job, identify the provider, exact model and interface; read its current schema for duration, dimensions, aspect ratio, reference roles, audio and cost. Record these with the prompt in `docs/generation-log.json`. Model availability depends on the interface and account. A required input that the schema cannot accept requires a different model or a revised shot approved by the user.

## Higgsfield

When the user chooses Higgsfield, read `higgsfield.md` before preparing or submitting a job.

## Grok Imagine

Read [official generation docs](https://docs.x.ai/developers/model-capabilities/video/generation). The documented Grok 1.5 text/image route supports 1–15 seconds; image-to-video inherits the image aspect ratio. Reference, edit and older-model routes have different limits. Check the exact route. Request silent generation when supported for our separately mixed soundtrack; otherwise mute the clip during assembly. Save temporary result URLs locally promptly. These facts describe the API, not every web interface.

## Veo

Read [Google’s video documentation](https://ai.google.dev/gemini-api/docs/video). Inspect the chosen version and mode for first/last frames, reference images, extension, audio and supported duration/resolution combinations. For image-to-video, direct motion and ending from the supplied frame. Keep generated audio separate from the approved score. Use only fields in the actual provider schema.

## Seedance and Kling

Use the selected provider’s live model schema (Higgsfield instructions below when applicable) and the linked vendor model documentation. Verify reference roles, multi-shot controls, duration and audio support rather than transferring limits between versions or interfaces. If only web access exists, inspect its visible settings and return a prompt plus a settings block marked with anything unverified. No universal quality ranking or newest-model assumption.

## Prompt and record contract

For each reference list filename, role (identity, location, style, camera, first frame, end frame) and what must remain independent of it. Give each action an explicit ending. Motion prompts describe change rather than repeating the supplied image. For a long clip, give stages and their end states; frame-exact edits remain in Remotion. Keep audio policy explicit: silent, ambient-only, dialogue, or separately mixed score.

Each job record includes shot, provider, model, interface, checked-at date, source/schema, input files and roles, prompt file, duration/resolution/audio settings, quoted cost, approval, job ID, output path and review result. Keep credentials in the tool’s secure configuration, outside the project and repository. Submit only approved files. Retries need the same cost/approval discipline; never silently switch models.
