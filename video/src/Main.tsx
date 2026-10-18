import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop, CUTS } from './components/Backdrop';
import { archPathAt } from './components/Ornaments';
import { EASE_IO, SceneStart, k } from './lib';
import { C, FPS, H, W } from './theme';
import { Aims, Founding, Opening } from './scenes/Intro';
import { Governance, Mission, Values, Vision } from './scenes/Identity';
import { Goals, Outputs } from './scenes/Goals';
import { Outro, Programs, Sustainability } from './scenes/Projects';

export const DURATION = 216;
const D = 1.1; // transition length (s)

type Kind = 'arch' | 'light' | 'pattern' | 'push';
// Transition used at each cut (same order as CUTS).
const KINDS: Kind[] = ['arch', 'light', 'pattern', 'arch', 'push', 'pattern', 'light', 'push', 'pattern', 'arch', 'light'];
const SCENES: React.FC[] = [Opening, Founding, Aims, Governance, Vision, Mission, Values, Goals, Outputs, Programs, Sustainability, Outro];

const bell = (p: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, p)));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// Style for a scene while it enters (p: 0→1) or leaves (q: 0→1) through a given transition.
const enterStyle = (kind: Kind, p: number): React.CSSProperties => {
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
      return { opacity: p > 0.5 ? 1 : 0, transform: `translateX(${lerp(260, 0, k(p, 0.5, 1))}px)` };
    case 'push':
      return { transform: `translateX(${lerp(-W, 0, p)}px)`, boxShadow: '40px 0 80px -20px rgba(60,70,60,0.25)' };
  }
};

const leaveStyle = (kind: Kind, q: number): React.CSSProperties => {
  if (q <= 0) return {};
  switch (kind) {
    case 'arch':
      return { transform: `scale(${lerp(1, 1.18, q)})`, opacity: 1 - k(q, 0.7, 1) };
    case 'light':
      return { opacity: 1 - k(q, 0.38, 0.55), transform: `scale(${lerp(1, 1.05, q)}) translateX(${lerp(0, -60, q)}px)` };
    case 'pattern':
      return { opacity: q < 0.5 ? 1 : 0, transform: `translateX(${lerp(0, -260, k(q, 0, 0.5))}px)` };
    case 'push':
      return { transform: `translateX(${lerp(0, W * 0.35, q)}px) scale(${lerp(1, 0.94, q)})`, opacity: lerp(1, 0.15, q) };
  }
};

const SceneSlot: React.FC<{ i: number; start: number; children: React.ReactNode }> = ({ i, start, children }) => {
  const t = start + useCurrentFrame() / FPS;
  const cin = i > 0 ? CUTS[i - 1] : null;
  const cout = i < CUTS.length ? CUTS[i] : null;
  const p = cin === null ? 1 : k(t, cin - D / 2, cin + D / 2, EASE_IO);
  const q = cout === null ? 0 : k(t, cout - D / 2, cout + D / 2, EASE_IO);
  const a = cin === null ? {} : enterStyle(KINDS[i - 1], p);
  const b = cout === null ? {} : leaveStyle(KINDS[i], q);
  const drift = 1 + 0.025 * k(t, cin ?? 0, cout ?? DURATION, (x) => x);
  return (
    <AbsoluteFill style={q > 0 ? b : a}>
      {cin !== null && p < 1 && (KINDS[i - 1] === 'arch' || KINDS[i - 1] === 'push') && (
        <AbsoluteFill>
          <Backdrop offset={start} />
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 60%, rgba(255,253,245,0.9), rgba(255,253,245,0))', opacity: 1 - p }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ transform: `scale(${drift})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Flourishes painted above both scenes during a cut.
const Overlay: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      {CUTS.map((c, i) => {
        const p = k(t, c - D / 2, c + D / 2, EASE_IO);
        if (p <= 0 || p >= 1) return null;
        const kind = KINDS[i];
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
              <AbsoluteFill style={{ background: '#FFFDF6', opacity: 0.85 * Math.pow(bell(p), 1.6) }} />
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
          const x = lerp(W + 1700, -W - 1700, p);
          return (
            <div
              key={c}
              style={{
                position: 'absolute',
                left: x - 1300 + W / 2,
                top: -700,
                width: 2600,
                height: H + 1400,
                transform: 'rotate(14deg)',
                background: `linear-gradient(90deg, rgba(157,207,148,0) 0%, ${C.green} 12%, ${C.teal} 50%, ${C.tealDeep} 88%, rgba(30,147,166,0) 100%)`,
                overflow: 'hidden',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => (
                <Img
                  key={r}
                  src={staticFile('brand/pattern-band-bold.png')}
                  style={{ position: 'absolute', left: -300, top: 120 + r * 330, width: 3200, opacity: 0.18, filter: 'brightness(4)' }}
                />
              ))}
              <div style={{ position: 'absolute', left: 300, top: 0, bottom: 0, width: 3, background: C.goldSoft }} />
              <div style={{ position: 'absolute', right: 300, top: 0, bottom: 0, width: 3, background: C.goldSoft }} />
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

export const Main: React.FC = () => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <Backdrop />
    {SCENES.map((Scene, i) => {
      const start = i === 0 ? 0 : CUTS[i - 1] - D / 2;
      const end = i === SCENES.length - 1 ? DURATION : CUTS[i] + D / 2;
      return (
        <Sequence key={i} from={Math.round(start * FPS)} durationInFrames={Math.round((end - start) * FPS)}>
          <SceneStart value={start}>
            <SceneSlot i={i} start={start}>
              <Scene />
            </SceneSlot>
          </SceneStart>
        </Sequence>
      );
    })}
    <Overlay />
    <Audio src={staticFile('voiceover.mp3')} />
    <Audio src={staticFile('sfx.wav')} volume={0.55} />
  </AbsoluteFill>
);

