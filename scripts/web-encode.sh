#!/bin/sh
# scripts/web-encode.sh master.mp4 [out.mp4] [height] → a web/README-size H.264 copy (720p30, ~1 Mb/s, faststart).
# A 93 s 1080p60 master of 472 MB came out at under 10 MB. Free: ffmpeg only.
set -e
in=$1; out=${2:-${1%.*}-web.mp4}; h=${3:-720}
[ -f "$in" ] || { echo "usage: $0 master.mp4 [out.mp4] [height]"; exit 1; }
ffmpeg -v error -y -i "$in" -vf "scale=-2:$h,fps=30" -c:v libx264 -preset slow -crf 24 -maxrate 1.0M -bufsize 2.0M \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$out"
ls -l "$out" | awk '{ printf "%s  %.1f MB\n", $NF, $5 / 1e6 }'
