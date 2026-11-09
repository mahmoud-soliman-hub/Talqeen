#!/usr/bin/env python3
"""توقيت إرشادي للسكربت قبل تسجيل الصوت: يكتب vo/words.json وملفات صامتة بنفس الطول.
لما التسجيل الحقيقي يوصل: voice.py <proj> --own صوت.wav يستبدل التوقيت ده بتوقيت الكلام الفعلي."""
import json, os, re, sys, wave
P = os.path.abspath(sys.argv[1]); SR = 48000
script = json.load(open(os.path.join(P, 'script.json'), encoding='utf-8'))
lines = []
for L in script:
    t = 0.0; words = []
    for w in L['text'].split():
        n = len(re.sub(r'[^ء-ي]', '', w))
        d = 0.12 + 0.054 * n
        words.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3)}); t += d
        t += 0.32 if w.endswith('..') else 0.24 if re.search(r'[.:؟]$', w) else 0.16 if w.endswith('،') else 0.04
    dur = round(words[-1]['e'] + 0.05, 3)
    f = f'vo/{L["id"]}.wav'
    with wave.open(os.path.join(P, f), 'wb') as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes(b'\0\0' * int(dur * SR))
    lines.append({'id': L['id'], 'text': L['text'], 'file': f, 'dur': dur, 'words': words, 'gap_after': L.get('gap_after'), 'source': 'guide'})
    print(f'{L["id"]}  {dur:5.2f}s  {L["text"]}')
json.dump({'voice': 'guide', 'source': 'guide', 'lines': lines}, open(os.path.join(P, 'vo', 'words.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('total speech', round(sum(l['dur'] for l in lines), 2))
