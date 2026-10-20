"""Write sfx_cues.json in film seconds (voiceover times shifted by the agenda gaps)."""
import json

g = json.load(open('out/vo_film.json'))
GAPS = [tuple(x) for x in g['gaps']]
fwd = lambda o: o + sum(a for at, a in GAPS if at < o)
gstart = lambda at: fwd(at)

c = []
add = lambda t, typ, gain=1: c.append({'t': round(t, 3), 'type': typ, 'gain': gain})
o = lambda t, typ, gain=1: add(fwd(t), typ, gain)  # cue authored in voiceover seconds

# opening
add(0.2, 'swell', 0.9); add(1.4, 'chime_low', 0.7); add(4.9, 'chime', 0.5)
# agenda gaps
for i, (at, dur) in enumerate(GAPS):
    s = gstart(at)
    if i == 0:
        add(s + 0.3, 'whoosh', 0.5)
        for k in range(8):
            add(s + 1.0 + k * 0.32, 'paper', 0.7)
        add(s + 4.5, 'chime', 0.35)
        add(s + 5.8, 'zoom', 0.8)
    else:
        add(s + 0.05, 'whoosh', 0.55)       # scene folds into its card
        add(s + 0.85, 'paper', 0.8)         # green check
        add(s + 1.05, 'chime', 0.3)         # next card lights
        add(s + 1.55, 'zoom', 0.8)          # camera dives in
# plain cuts
o(25.05, 'whoosh', 0.55); o(25.1, 'chime', 0.35)
o(40.05, 'whoosh', 1.0)
o(209.65, 'whoosh', 0.55); o(209.7, 'chime', 0.35)
# on-screen reveals (soft paper, no pitched clicks)
for t in [13.75, 14.35, 18.9, 20.7, 23.0, 31.43, 33.24, 34.79, 37.46, 41.6, 43.0, 46.4,
          68.66, 71.0, 73.87, 77.28, 84.76, 86.41, 88.0, 134.44, 142.41, 148.97, 155.7,
          191.06, 194.69, 199.12, 202.79, 206.57, 211.6, 212.0]:
    o(t, 'paper', 0.75)
for t in [102.83, 111.87, 120.94]:
    o(t - 0.2, 'whoosh', 0.4)
for t in [165.42, 169.51, 174.04, 178.66, 183.19]:
    o(t, 'whoosh', 0.35)
# closing
o(209.9, 'swell', 0.8); o(210.6, 'chime_low', 0.6)
json.dump(sorted(c, key=lambda x: x['t']), open('sfx_cues.json', 'w'), indent=0)
print(len(c), 'cues; duration', g['duration'])
