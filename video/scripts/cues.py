"""Write sfx_cues.json: sound effects placed on transitions and on-screen reveals."""
import json

CUTS = [8.35, 25.05, 40.05, 50.95, 63.15, 82.35, 89.95, 130.75, 162.05, 188.35, 209.65]
KINDS = ['arch', 'light', 'pattern', 'arch', 'push', 'pattern', 'light', 'push', 'pattern', 'arch', 'light']
c = []
add = lambda t, typ, g=1: c.append({'t': round(t, 3), 'type': typ, 'gain': g})

add(0.2, 'swell', 0.9); add(1.4, 'chime_low', 0.8); add(4.9, 'chime', 0.6)
for t, kind in zip(CUTS, KINDS):
    if kind == 'arch':
        add(t - 0.5, 'swell', 0.55); add(t + 0.1, 'chime_low', 0.5); add(t, 'whoosh', 0.5)
    elif kind == 'light':
        add(t, 'whoosh', 0.55); add(t + 0.05, 'chime', 0.45)
    elif kind == 'pattern':
        add(t, 'whoosh', 1.0)
    else:
        add(t, 'whoosh', 0.8)
for t in [51.55, 63.05, 82.97, 90.46, 130.65, 162.7, 188.75]:
    add(t + 0.1, 'chime', 0.4)
for t in [13.75, 14.35, 18.9, 20.7, 23.0, 31.43, 33.24, 34.79, 37.46, 41.6, 43.0, 46.4,
          68.66, 71.0, 73.87, 77.28, 84.76, 86.41, 88.0, 134.44, 142.41, 148.97, 155.7,
          191.06, 194.69, 199.12, 202.79, 206.57, 211.6, 212.0]:
    add(t, 'tick', 0.8)
for t in [102.83, 111.87, 120.94]:
    add(t - 0.2, 'whoosh', 0.4)
for t in [165.42, 169.51, 174.04, 178.66, 183.19]:
    add(t, 'whoosh', 0.4)
for t in [167.85, 172.15, 177.12, 181.46, 186.5]:
    add(t, 'chime_low', 0.35)
add(209.9, 'swell', 0.8); add(210.6, 'chime_low', 0.7)
json.dump(sorted(c, key=lambda x: x['t']), open('sfx_cues.json', 'w'), indent=0)
print(len(c), 'cues')
