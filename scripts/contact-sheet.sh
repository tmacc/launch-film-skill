#!/bin/sh
# scripts/contact-sheet.sh video.mp4 out.png [t1 t2 ...] → a 3-wide sheet of frames at those seconds.
# No times = 12 frames spread evenly. Use it on reference videos (art direction) and on your own renders (review).
set -e
in=$1; out=$2; shift 2 || { echo "usage: $0 video.mp4 out.png [seconds ...]"; exit 1; }
tmp=$(mktemp -d "${TMPDIR:-/tmp}/sheet.XXXXXX")
if [ $# -eq 0 ]; then
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
  set -- $(awk -v d="$d" 'BEGIN { for (i = 0; i < 12; i++) printf "%.2f ", d * (i + 0.5) / 12 }')
fi
i=0; inputs=""; layout=""
for s in "$@"; do
  ffmpeg -v error -y -ss "$s" -i "$in" -frames:v 1 -vf "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2,drawtext=text='$s s':x=16:y=16:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6" "$tmp/$i.png" 2>/dev/null \
    || ffmpeg -v error -y -ss "$s" -i "$in" -frames:v 1 -vf "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2" "$tmp/$i.png"
  inputs="$inputs -i $tmp/$i.png"; layout="$layout|$(( (i % 3) * 960 ))_$(( (i / 3) * 540 ))"; i=$((i + 1))
done
if [ $i -eq 1 ]; then cp "$tmp/0.png" "$out"; else
  ffmpeg -v error -y $inputs -filter_complex "xstack=inputs=$i:layout=${layout#|}:fill=black" "$out"; fi
rm -r "$tmp"; echo "$out"
