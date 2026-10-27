// Re-render only the agenda gap windows (±3 frames) of one or more compositions at 2× scale.
// node scripts/render-gaps.mjs Talqeen TalqeenVertical  →  out/seg/<id>-<from>-<to>.mp4 + out/seg/ranges.json
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const ids = process.argv.slice(2);
const chrome = process.env.REMOTION_CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const FPS = 30;
const { gaps, duration } = JSON.parse(fs.readFileSync('out/vo_film.json', 'utf8'));
const fwd = (o) => o + gaps.reduce((s, [at, add]) => s + (at < o ? add : 0), 0);
const last = Math.round(duration * FPS) - 1;
const ranges = gaps.map(([at, add]) => {
  const gs = fwd(at);
  return [Math.max(0, Math.floor(gs * FPS) - 3), Math.min(last, Math.ceil((gs + add) * FPS) + 3)];
});
fs.mkdirSync('out/seg', { recursive: true });
fs.writeFileSync('out/seg/ranges.json', JSON.stringify({ ranges, frames: last + 1 }));
console.log('ranges', JSON.stringify(ranges));

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable: chrome });
  for (const [a, b] of ranges) {
    const out = `out/seg/${id}-${a}-${b}.mp4`;
    if (fs.existsSync(out)) continue;
    const t0 = Date.now();
    await renderMedia({
      serveUrl, composition, codec: 'h264', outputLocation: out, frameRange: [a, b], scale: 2, muted: true,
      imageFormat: 'png', crf: 16, x264Preset: 'slow', concurrency: 4, browserExecutable: chrome,
    });
    console.log(`${id} ${a}-${b} done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
}
console.log('ALL DONE');
