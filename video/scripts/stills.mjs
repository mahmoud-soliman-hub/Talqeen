// node scripts/stills.mjs out/sheet 7.5 20 ...  → one PNG per second mark + contact sheet
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const [dir, ...times] = process.argv.slice(2);
const chrome = process.env.REMOTION_CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'Talqeen', browserExecutable: chrome });
const files = [];
for (const s of times) {
  const out = path.join(dir, `t${String(s).padStart(6, '0')}.png`);
  await renderStill({ serveUrl, composition, output: out, frame: Math.round(Number(s) * 30), browserExecutable: chrome, scale: 0.5 });
  files.push(out);
}
const cols = 3;
const args = [];
files.forEach((f) => args.push('-i', f));
const rows = Math.ceil(files.length / cols);
const layout = files.map((_, i) => `${(i % cols) * 960}_${Math.floor(i / cols) * 540}`).join('|');
args.push('-filter_complex', `${files.map((_, i) => `[${i}:v]drawtext=text='${times[i]}s':x=12:y=10:fontsize=26:fontcolor=red[v${i}]`).join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${layout}:fill=white`, '-frames:v', '1', '-y', path.join(dir, 'sheet.jpg'));
if (files.length > 1) execFileSync('ffmpeg', ['-v', 'error', ...args]);
console.log('sheet', path.join(dir, 'sheet.jpg'));
