#!/usr/bin/env python3
"""Estimated timeline (no voice yet): writes timeline.json in the motion-engine format.
Line windows are hand-set for a natural Saudi read at ~30s; word times split by letter weight.
When the real voice arrives: voice.py --own + timeline.py replace this file."""
import json, re
proj = json.load(open('project.json', encoding='utf-8')); script = {l['id']: l['text'] for l in json.load(open('script.json', encoding='utf-8'))}
DUR = 30.0
SC = {'s1': 0, 's2': 4.75, 's3': 8.25, 's4': 12.5, 's5': 16.5, 's6': 20.75, 's7': 26.0}
LN = {'l1a': (0.35, 1.85), 'l1b': (2.15, 3.15), 'l1c': (3.35, 4.4), 'l2a': (5.0, 6.4), 'l2b': (6.75, 7.75),
      'l3a': (8.5, 9.8), 'l3b': (10.05, 12.15), 'l4a': (12.75, 13.65), 'l4b': (13.9, 14.5), 'l4c': (14.75, 16.2),
      'l5a': (16.75, 18.0), 'l5b': (18.15, 18.75), 'l5c': (18.95, 19.55), 'l5d': (19.75, 20.45),
      'l6a': (21.0, 21.7), 'l6b': (21.9, 23.3), 'l6c': (23.5, 24.4), 'l6d': (24.6, 25.6), 'l7a': (26.3, 27.9), 'l7b': (28.2, 29.3)}
spb = 60 / proj['bpm']; bpb = proj['beatsPerBar']
beats = [round(i * spb, 4) for i in range(int(DUR / spb) + 1)]
ids = [s['id'] for s in proj['scenes']]
scenes = [{'id': s['id'], 'file': s['file'], 'start': SC[s['id']], 'end': SC[ids[i + 1]] if i + 1 < len(ids) else DUR, 'lines': s['lines'], 'transition': s.get('transition')} for i, s in enumerate(proj['scenes'])]
vo = []
for lid, (a, b) in LN.items():
    ws = [w for w in script[lid].split() if re.search(r'\w', w)]
    wt = [len(re.sub(r'[^\w]', '', w)) + 2 for w in ws]; tot = sum(wt); t = a; words = []
    for w, k in zip(ws, wt):
        d = (b - a) * k / tot; words.append({'w': w, 's': round(t, 3), 'e': round(t + d - 0.02, 3)}); t += d
    vo.append({'id': lid, 'text': script[lid], 'start': a, 'end': b, 'dur': round(b - a, 3), 'words': words})
def at(v):
    if isinstance(v, (int, float)): return float(v)
    k, x = v.split(':'); return SC[x] if k == 'scene' else LN[x][0]
sec = proj['sections']; S = [{'name': s['name'], 'start': at(s['at']), 'end': at(sec[i + 1]['at']) if i + 1 < len(sec) else DUR} for i, s in enumerate(sec)]
json.dump({'fps': proj['fps'], 'width': proj['width'], 'height': proj['height'], 'duration': DUR, 'bpm': float(proj['bpm']), 'beatsPerBar': bpb, 'beatOffset': 0.0, 'grid': spb / 2,
           'beats': beats, 'bars': beats[::bpb], 'sections': S, 'scenes': scenes, 'vo': vo}, open('timeline.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('timeline.json', DUR, 's', len(vo), 'lines')
