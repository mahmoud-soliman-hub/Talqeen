# Mr. Boma — Logo Development

- `logo-concepts-v2.html` — presentation page for round 2 (three directions: Heritage, Momentum, Horizon).
- `logo-concepts.html` — round 1 (superseded).
- `logos/` — outlined SVG files for every concept: `horizontal`, `stacked`, `icon` (+ `mini` favicon for Heritage), each in `color`, `white` (on brand background) and `black`.
- `logos/png/` — PNG exports (2400px wide for lockups, 1024px for icons, transparent background).
- `build/` — source: `marks.py` (symbols + text outlining), `lockups.py` (layouts and palettes), `build.py` (writes logos + page), `page.css`, `fonts/` (OFL Google Fonts).

Rebuild: `cd build && pip install fonttools && python3 build.py`
