"""Build public/vo_film.wav: the voiceover opened up with silence at each agenda gap,
plus the opening line ("جمعية تلقين لتعليم القرآن الكريم") replayed to close the film.
Times mirror src/timeline.ts."""
import json, re, subprocess, wave
import numpy as np

SR = 48000
src = open('src/timeline.ts', encoding='utf-8').read()
gaps = [(float(a), float(b)) for a, b in re.findall(r"\{ at: ([\d.]+), add: (FIRST_GAP|GAP|[\d.]+)", src.replace('FIRST_GAP', re.search(r'FIRST_GAP = ([\d.]+)', src).group(1)).replace('add: GAP', 'add: ' + re.search(r'export const GAP = ([\d.]+)', src).group(1)))]
cl = re.search(r"CLOSING_LINE = \{ from: ([\d.]+), to: ([\d.]+), at: ([\d.]+) \}", src)
c_from, c_to, c_at = map(float, cl.groups())
dur = float(re.search(r'ORIG_END = ([\d.]+)', src).group(1)) + sum(g[1] for g in gaps)

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'public/voiceover.mp3', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
vo = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)

def fwd(o):
    return o + sum(a for g, a in gaps if g < o)

out = np.zeros((int(dur * SR) + SR, 2), dtype=np.float32)
cuts = [0.0] + [g for g, _ in gaps] + [len(vo) / SR]
for a, b in zip(cuts, cuts[1:]):
    seg = vo[int(a * SR):int(b * SR)]
    s = int(fwd(a + 1e-6) * SR) if a > 0 else 0
    out[s:s + len(seg)] += seg

# closing line with short fades
line = vo[int(c_from * SR):int(c_to * SR)].copy()
f = int(0.05 * SR)
line[:f] *= np.linspace(0, 1, f)[:, None]
line[-f:] *= np.linspace(1, 0, f)[:, None]
s = int(fwd(c_at) * SR)
out[s:s + len(line)] += line

out = np.clip(out[:int(dur * SR)], -1, 1)
w = wave.open('public/vo_film.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype('<i2').tobytes()); w.close()
json.dump({'gaps': gaps, 'duration': dur}, open('out/vo_film.json', 'w'))
print('gaps', gaps, 'duration', round(dur, 2))
