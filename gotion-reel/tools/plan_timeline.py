#!/usr/bin/env python3
"""يبني timeline.json من خطة التوقيت في script.json (قبل تسجيل الصوت).
كل سطر له نافذة [بداية، نهاية] بالثواني، وعلامة | = سكتة قصيرة. الكلمات تتوزّع على النافذة بحسب طولها.
لما يوصل التسجيل الحقيقي: نحدّث النوافذ (أو نحط توقيت كل كلمة) والمشاهد تتزامن لوحدها."""
import json, os, re, sys
P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
proj = json.load(open(os.path.join(P, 'project.json'), encoding='utf-8'))
script = json.load(open(os.path.join(P, 'script.json'), encoding='utf-8'))
SCENES = [('s1', 0.0), ('s2', 5.0), ('s3', 10.0), ('s4', 15.0), ('s5', 20.0), ('s6', 25.0)]
DUR = 30.6
bare = lambda w: re.sub(r'[ً-ْٰ،.؟!…]', '', w)
vo = []
for L in script:
    a, b = L['window']; groups = [g.split() for g in L['text'].split('|')]
    pause = L.get('pause', 0.3); speak = (b - a) - pause * (len(groups) - 1)
    total = sum(len(bare(w)) + 1.5 for g in groups for w in g)
    t, words = a, []
    for gi, g in enumerate(groups):
        for w in g:
            d = speak * (len(bare(w)) + 1.5) / total
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d - 0.03, 3)}); t += d
        t += pause
    vo.append({'id': L['id'], 'text': L['text'].replace(' |', ''), 'start': a, 'end': b, 'dur': round(b - a, 3), 'words': words})
spb = 60.0 / proj['bpm']; bpb = proj['beatsPerBar']
beats = [round(i * spb, 4) for i in range(int(DUR / spb) + 1)]
by = {s['id']: s for s in proj['scenes']}
scenes = []
for i, (sid, st) in enumerate(SCENES):
    en = SCENES[i + 1][1] if i + 1 < len(SCENES) else DUR
    scenes.append({'id': sid, 'file': by[sid]['file'], 'start': st, 'end': en, 'lines': by[sid]['lines'], 'transition': by[sid].get('transition')})
start_of = dict(SCENES)
secs = []
for s in proj['sections']:
    at = s['at']; secs.append({'name': s['name'], 'start': start_of[at.split(':')[1]] if isinstance(at, str) else float(at)})
for i, s in enumerate(secs): s['end'] = secs[i + 1]['start'] if i + 1 < len(secs) else DUR
tl = {'fps': proj['fps'], 'width': proj['width'], 'height': proj['height'], 'duration': DUR, 'bpm': float(proj['bpm']), 'beatsPerBar': bpb,
      'beatOffset': 0.0, 'grid': spb / 2, 'beats': beats, 'bars': beats[::bpb], 'sections': secs, 'scenes': scenes, 'vo': vo}
json.dump(tl, open(os.path.join(P, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for L in vo: print(L['id'], ' '.join(f"{i}:{bare(w['w'])}@{w['s']}" for i, w in enumerate(L['words'])))
