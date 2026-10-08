#!/usr/bin/env node
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
const [video, config, output = 'media-check.json'] = process.argv.slice(2);
if (!video || !config) throw new Error('Usage: node media-check.mjs video.mp4 film.json [report.json]');
const film = JSON.parse(readFileSync(config, 'utf8'));
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
  if (r.error || r.status !== 0) throw new Error(`${cmd} failed: ${r.error?.message || r.stderr}`);
  return r;
};
const probe = JSON.parse(run('ffprobe', ['-v','error','-show_streams','-show_format','-of','json',video]).stdout);
const v = probe.streams.find(s => s.codec_type === 'video');
const a = probe.streams.find(s => s.codec_type === 'audio');
if (!v) throw new Error('No video stream');
const [n,d] = v.avg_frame_rate.split('/').map(Number);
const fps = n/d;
const duration = Number(probe.format.duration);
const errors = [];
if (v.width !== film.width || v.height !== film.height) errors.push('Dimensions differ from film.json');
if (Math.abs(fps - film.fps) > 0.01) errors.push('Frame rate differs from film.json');
if (!Number.isFinite(duration) || Math.abs(duration - film.length) > 2 / film.fps) errors.push('Duration differs from film.json');
if (film.music && !a) errors.push('Configured music but no audio stream');
// Decode the entire file, then gather diagnostics for human review.
run('ffmpeg', ['-v','error','-xerror','-i',video,'-f','null','-']);
const diagnostic = run('ffmpeg', ['-hide_banner','-nostats','-i',video,'-vf','blackdetect=d=0.15:pix_th=0.05,freezedetect=n=-50dB:d=1',...(a ? ['-af','ebur128=peak=true'] : []),'-f','null','-']).stderr;
const events = diagnostic.split('\n').filter(l => /black_start:|freeze_start:|freeze_end:|freeze_duration:/.test(l));
const summary = a ? diagnostic.slice(diagnostic.lastIndexOf('Summary:')) : 'Silent video; no audio loudness check';
const report = {video, passed: errors.length === 0, errors, width:v.width, height:v.height, fps, duration, audio:!!a, events, audioSummary:summary, reviewRequired:'Inspect flagged intervals and cut-boundary frames against the shot list; deliberate holds and darkness are allowed.'};
mkdirSync(dirname(output), {recursive:true});
writeFileSync(output, JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if (errors.length) process.exitCode = 1;
