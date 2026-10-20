import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop, Motes } from './components/Backdrop';
import { archPathAt } from './components/Ornaments';
import { EASE_IO, SceneStart, k } from './lib';
import { C, FPS } from './theme';
import { LANDSCAPE, Layout, LayoutProvider, VERTICAL, useL } from './layout';
import { Aims, Founding, Opening } from './scenes/Intro';
import { Governance, Mission, Values, Vision } from './scenes/Identity';
import { Goals, Outputs } from './scenes/Goals';
import { Outro, Programs, Sustainability } from './scenes/Projects';
import { Agenda, tileGrid } from './scenes/Agenda';
import { DURATION, GAPS, Gap, fwd, gapEnd, gapStart } from './timeline';

export { DURATION };
const D = 1.1; // transition length (s)

type Kind = 'arch' | 'light' | 'pattern' | 'push';
const SCENES: React.FC[] = [Opening, Founding, Aims, Governance, Vision, Mission, Values, Goals, Outputs, Programs, Sustainability, Outro];
// Scene boundaries in voiceover seconds. A section boundary is an agenda gap; the rest keep a cut transition.
const BOUNDS = [7.9, 25.05, 40.05, 50.95, 63.15, 82.35, 89.95, 130.75, 162.05, 188.35, 209.65];
const CUT_KIND: Record<number, Kind> = { 25.05: 'light', 40.05: 'pattern', 209.65: 'light' };
const gapAt = (o: number): Gap | undefined => GAPS.find((g) => g.at === o);
// Plain cuts in film seconds, for the overlay flourishes.
const CUTS = BOUNDS.filter((b) => !gapAt(b)).map((b) => ({ t: fwd(b), kind: CUT_KIND[b] }));
const SHRINK = 0.9; // seconds for a finished scene to fold back into its agenda card
const OPEN = 0.35; // seconds for the next scene to open out of the zoomed card

// Pattern band: centre x at mid-height, and the seam it drags across the frame (tilted 14°).
const tilt = ({ H }: Layout) => Math.tan((14 * Math.PI) / 180) * (H / 2);
const bandX = ({ W }: Layout, p: number) => W + 700 - (W + 1400) * p;
const seam = (L: Layout, p: number, side: 'in' | 'out') => {
  const { W, H } = L;
  const BAND_TILT = tilt(L);
  const c = bandX(L, p);
  return side === 'in'
    ? `polygon(${c + BAND_TILT}px 0, ${W + 50}px 0, ${W + 50}px ${H}px, ${c - BAND_TILT}px ${H}px)`
    : `polygon(-50px 0, ${c + BAND_TILT}px 0, ${c - BAND_TILT}px ${H}px, -50px ${H}px)`;
};

const bell = (p: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, p)));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// Style for a scene while it enters (p: 0→1) or leaves (q: 0→1) through a given transition.
const enterStyle = (L: Layout, kind: Kind, p: number): React.CSSProperties => {
  const { W, H } = L;
  if (p >= 1) return {};
  switch (kind) {
    case 'arch': {
      const w = lerp(0, 4300, Math.pow(p, 2.2));
      const h = w * 1.3;
      return { clipPath: `path('${archPathAt(W / 2 - w / 2, H * 0.56 - h * 0.42, w, h)}')`, transform: `scale(${lerp(1.18, 1, p)})` };
    }
    case 'light':
      return { opacity: k(p, 0.42, 0.62), transform: `scale(${lerp(1.07, 1, p)})` };
    case 'pattern':
      return { clipPath: seam(L, p, 'in') };
    case 'push':
      return { transform: `translateX(${lerp(-W, 0, p)}px)`, boxShadow: '40px 0 80px -20px rgba(60,70,60,0.25)' };
  }
};

const leaveStyle = (L: Layout, kind: Kind, q: number): React.CSSProperties => {
  const { W } = L;
  if (q <= 0) return {};
  switch (kind) {
    case 'arch':
      return { transform: `scale(${lerp(1, 1.18, q)})`, opacity: 1 - k(q, 0.7, 1) };
    case 'light':
      return { opacity: 1 - k(q, 0.38, 0.55), transform: `scale(${lerp(1, 1.05, q)}) translateX(${lerp(0, -60, q)}px)` };
    case 'pattern':
      return { clipPath: seam(L, q, 'out') };
    case 'push':
      return { transform: `translateX(${lerp(0, W * 0.35, q)}px) scale(${lerp(1, 0.94, q)})`, opacity: lerp(1, 0.15, q) };
  }
};

// Window of scene i in film seconds.
const windowOf = (i: number) => {
  const bIn = i > 0 ? BOUNDS[i - 1] : null;
  const bOut = i < BOUNDS.length ? BOUNDS[i] : null;
  const gIn = bIn === null ? undefined : gapAt(bIn);
  const gOut = bOut === null ? undefined : gapAt(bOut);
  const start = bIn === null ? 0 : gIn ? gapEnd(gIn) - OPEN : fwd(bIn) - D / 2;
  const end = bOut === null ? DURATION : gOut ? gapStart(gOut) + (gOut.item === 0 ? 0.8 : SHRINK + 0.45) : fwd(bOut) + D / 2;
  return { bIn, bOut, gIn, gOut, start, end };
};

const SceneSlot: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const w = windowOf(i);
  const L = useL();
  const { W, H } = L;
  const { TILE, tileBox } = tileGrid(L);
  const n = w.start + useCurrentFrame() / FPS;
  let style: React.CSSProperties = {};
  let opaque = false;
  // leaving
  if (w.gOut && n >= gapStart(w.gOut)) {
    const u = n - gapStart(w.gOut);
    if (w.gOut.item === 0) {
      style = { opacity: 1 - k(u, 0, 0.7), transform: `scale(${1 + 0.06 * k(u, 0, 0.7)})` };
    } else {
      const p = k(u, 0, SHRINK, EASE_IO);
      const box = tileBox(w.gOut.item - 1);
      // fold the frame into the card: crop to the card's aspect, then scale down onto it
      const aspect = TILE.w / TILE.h;
      const wide = W / H > aspect;
      const end = wide ? TILE.h / H : TILE.w / W;
      const s = lerp(1, end, p);
      const cropX = wide ? ((W - H * aspect) / 2) * p : 0;
      const cropY = wide ? 0 : ((H - W / aspect) / 2) * p;
      style = {
        transform: `translate(${(box.cx - W / 2) * p}px, ${(box.cy - H / 2) * p}px) scale(${s})`,
        clipPath: `inset(${cropY}px ${cropX}px round ${lerp(0, 28 / end, p)}px)`,
        opacity: 1 - k(u, SHRINK, SHRINK + 0.4),
      };
      opaque = true;
    }
  } else if (w.bOut !== null && !w.gOut) {
    const q = k(n, fwd(w.bOut) - D / 2, fwd(w.bOut) + D / 2, EASE_IO);
    if (q > 0) style = leaveStyle(L, CUT_KIND[w.bOut], q);
  }
  // entering
  if (w.gIn && n < gapEnd(w.gIn)) {
    const p = k(n, gapEnd(w.gIn) - OPEN, gapEnd(w.gIn));
    style = { opacity: p, transform: `scale(${lerp(1.06, 1, p)})` };
    opaque = true;
  } else if (w.bIn !== null && !w.gIn) {
    const p = k(n, fwd(w.bIn) - D / 2, fwd(w.bIn) + D / 2, EASE_IO);
    if (p < 1) {
      style = enterStyle(L, CUT_KIND[w.bIn], p);
      opaque = CUT_KIND[w.bIn] === 'arch' || CUT_KIND[w.bIn] === 'push';
    }
  }
  return (
    <AbsoluteFill style={style}>
      {opaque && <Backdrop offset={w.start} />}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Flourishes painted above both scenes during a cut.
const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const L = useL();
  const { W, H } = L;
  return (
    <>
      {CUTS.map(({ t: c, kind }) => {
        const p = k(t, c - D / 2, c + D / 2, EASE_IO);
        if (p <= 0 || p >= 1) return null;
        if (kind === 'arch') {
          const w = lerp(0, 4300, Math.pow(p, 2.2));
          const hh = w * 1.3;
          return (
            <svg key={c} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <path d={archPathAt(W / 2 - w / 2, H * 0.56 - hh * 0.42, w, hh)} fill="none" stroke={C.gold} strokeWidth={3} opacity={bell(p)} />
              <path d={archPathAt(W / 2 - w * 0.48, H * 0.56 - hh * 0.42 + hh * 0.02, w * 0.96, hh * 0.98)} fill="none" stroke={C.goldSoft} strokeWidth={1.5} opacity={bell(p) * 0.8} />
            </svg>
          );
        }
        if (kind === 'light') {
          const x = lerp(120, -40, p);
          return (
            <AbsoluteFill key={c} style={{ pointerEvents: 'none' }}>
              <AbsoluteFill style={{ background: '#FFFDF6', opacity: 0.55 * Math.pow(bell(p), 2) }} />
              <AbsoluteFill
                style={{
                  background: `linear-gradient(100deg, rgba(255,250,232,0) ${x - 30}%, rgba(255,246,220,0.95) ${x}%, rgba(255,250,232,0) ${x + 30}%)`,
                  opacity: bell(p),
                }}
              />
            </AbsoluteFill>
          );
        }
        if (kind === 'pattern') {
          const x = bandX(L, p);
          return (
            <div
              key={c}
              style={{
                position: 'absolute',
                left: x - 450,
                top: -400,
                width: 900,
                height: H + 800,
                transform: 'rotate(14deg)',
                background: `linear-gradient(90deg, rgba(166,211,148,0) 0%, ${C.green} 22%, ${C.teal} 55%, ${C.tealDeep} 80%, rgba(30,147,166,0) 100%)`,
                overflow: 'hidden',
                boxShadow: '0 0 120px 40px rgba(255,253,245,0.55)',
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <Img
                  key={r}
                  src={staticFile('brand/pattern-band-bold.png')}
                  style={{ position: 'absolute', left: -600, top: 60 + r * 330, width: 2200, opacity: 0.22, filter: 'brightness(4)' }}
                />
              ))}
              <div style={{ position: 'absolute', left: 200, top: 0, bottom: 0, width: 2, background: C.goldSoft }} />
              <div style={{ position: 'absolute', right: 200, top: 0, bottom: 0, width: 2, background: C.goldSoft }} />
            </div>
          );
        }
        // push: gold seam riding the incoming edge
        const sx = lerp(0, W, p);
        return <div key={c} style={{ position: 'absolute', left: sx - 2, top: 0, bottom: 0, width: 4, background: `linear-gradient(${C.goldSoft}, ${C.gold}, ${C.goldSoft})`, opacity: bell(p) }} />;
      })}
    </>
  );
};

export const Main: React.FC<{ vertical?: boolean }> = ({ vertical }) => (
  <LayoutProvider value={vertical ? VERTICAL : LANDSCAPE}>
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Backdrop />
      <Agenda />
      {SCENES.map((Scene, i) => {
        const { start, end } = windowOf(i);
        return (
          <Sequence key={i} from={Math.round(start * FPS)} durationInFrames={Math.round((end - start) * FPS)}>
            <SceneStart value={start}>
              <SceneSlot i={i}>
                <Scene />
              </SceneSlot>
            </SceneStart>
          </Sequence>
        );
      })}
      <Motes front />
      <Overlay />
      {/* voiceover only — the client asked for no sound effects */}
      <Audio src={staticFile('vo_film.wav')} />
    </AbsoluteFill>
  </LayoutProvider>
);
