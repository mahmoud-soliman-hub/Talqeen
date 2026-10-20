"""Synthesize the film's sound effects (no music) into public/sfx.wav."""
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

def env(n, a, r):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)

def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); p = 0.0
    for i, v in enumerate(x):
        p = (1 - a) * v + a * p; y[i] = p
    return y

def whoosh(d=0.9):
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = lowpass(x, 1800) - lowpass(x, 250)            # airy band
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return x * shape * 0.55

def chime(f0=880):
    n = int(2.6 * SR); t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f0 * m * t) * np.exp(-t * dcy) for m, a, dcy in [(1, 1, 2.2), (2.01, .35, 3.5), (3.0, .18, 5), (4.2, .08, 7)])
    return y * env(n, 0.004, 9) * 0.22

def tick():
    n = int(0.12 * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 60) + 0.4 * rng.standard_normal(n) * np.exp(-t * 300)
    return y * 0.16

def swell():
    n = int(2.4 * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * (55 + 8 * t) * t) * 0.6 + np.sin(2 * np.pi * 110 * t) * 0.15
    return y * np.sin(np.pi * np.clip(t / 2.4, 0, 1)) ** 1.5 * 0.5

def paper(d=0.22):
    """Soft page-turn rustle: airy band-limited noise with a quick swell, no pitch."""
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = lowpass(x, 5200) - lowpass(x, 1400)
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5 * (1 + 0.35 * np.sin(2 * np.pi * 23 * t))
    return x * shape * 0.32

def zoom(d=1.4):
    """Long rising air for the agenda zoom-in."""
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = lowpass(x, 2600) - lowpass(x, 300)
    shape = np.clip(t / d, 0, 1) ** 2.2 * np.exp(-np.maximum(0, t - d * 0.85) * 18)
    return x * shape * 0.5

VOICES = {'whoosh': whoosh, 'chime': chime, 'chime_low': lambda: chime(587.3), 'tick': paper, 'paper': paper, 'zoom': zoom, 'swell': swell}

cues = json.load(open(sys.argv[1])); dur = float(sys.argv[3])
out = np.zeros((int(dur * SR) + SR, ), dtype=np.float64)
for c in cues:
    y = VOICES[c['type']]() * c.get('gain', 1)
    s = int(c['t'] * SR) - (len(y) // 2 if c['type'] == 'whoosh' else 0)
    s = max(0, s); out[s:s + len(y)] += y[: len(out) - s]
out = np.clip(out[: int(dur * SR)], -1, 1)
st = np.repeat((out * 32767).astype('<i2')[:, None], 2, axis=1)
w = wave.open(sys.argv[2], 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
print('wrote', sys.argv[2], len(cues), 'cues')
