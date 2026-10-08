# <Film name>: shot list

<BPM> BPM, <beats per bar>/4: a bar is <60 × beats ÷ BPM> s. Bar *n* starts at downbeat + (*n* − 1) × bar.
Write every time as a bar (fractions are beats: 7.5 = bar 7, beat 3). Seconds are for reading only; after the
music exists, `scripts/beatgrid.mjs` gives the real grid and the code recomputes every time from it.

## Act 1: <name> · bars 1–<n> · *"<what the viewer should think>"*

| Bar | ≈ s | Picture | Source | Super |
| --- | --- | --- | --- | --- |
| 1 | 0.0 | <shot> | plate `act1-<name>` + motion | |
| 2 | 2.5 | <shot> | UI: <screen/state> | **<super>** |
| 3.5 | 6.25 | <shot> | plate `act1-<name>` | |

## Act 2: <name> · bars <n>–<m>

| Bar | ≈ s | Picture | Source | Super |
| --- | --- | --- | --- | --- |
| | | | | |

## Supers

Each holds ≥ 0.5 s + characters ÷ 15; the caption lands before its action; results hold ≥ 1 s.
Copy them into `film.json` → `supers` as `[text, from bar, to bar]` and run `node scripts/pacing.mjs film.json`.

| Bar in | Bar out | Super |
| --- | --- | --- |
| | | |

## Cutdowns

| Cut | Structure |
| --- | --- |
| 30 s | <which beats survive> |
| 9:16 / 1:1 | <what reframes, what is rebuilt> |

## Reference and transition plan

| Shot | Input file | Role | Preserve independently | Required end state | Audio policy |
| --- | --- | --- | --- | --- | --- |
| | | identity / setting / camera / first frame / end frame | | | silent / ambient / dialogue |

| Outgoing shot | Incoming shot | Visual connection | Reason for cut | Boundary frames reviewed |
| --- | --- | --- | --- | --- |
| | | | | |

Approve the stills-and-music animatic before paid motion. Store actual provider/model/settings, source, quoted cost, approval, job ID and local results in the generation log described in `references/providers.md`.
