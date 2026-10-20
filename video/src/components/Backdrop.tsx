import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FPS, H, W } from '../theme';
import { EASE, k } from '../lib';
import { GAPS, fwd } from '../timeline';

// Scene cuts in seconds; the background camera drifts a step at each one (parallax against the scenes).
// Camera steps at every scene change (film seconds).
const CUTS = [...GAPS.map((g) => fwd(g.at) + g.add / 2), fwd(25.05), fwd(40.05), fwd(209.65)].sort((a, b) => a - b);

const camX = (t: number) => CUTS.reduce((x, c, i) => x + k(t, c - 0.6, c + 0.9, EASE) * (i % 2 ? -1 : 1) * 70, 0);
const camY = (t: number) => CUTS.reduce((y, c, i) => y + k(t, c - 0.6, c + 0.9, EASE) * (i % 3 === 0 ? 24 : -16), 0);

// Deterministic hash → [0,1)
const h = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const makeMotes = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => ({
    x: h(i + seed) * W,
    y: h(i + seed + 100) * H,
    r: 3 + h(i + seed + 200) * 16,
    sp: 8 + h(i + seed + 300) * 22,
    sw: 10 + h(i + seed + 400) * 30,
    ph: h(i + seed + 500) * Math.PI * 2,
    col: ['217,199,158', '45,187,206', '166,211,148'][Math.floor(h(i + seed + 600) * 3)],
    a: 0.25 + h(i + seed + 700) * 0.5,
  }));

const BACK_MOTES = makeMotes(64, 0);
const FRONT_MOTES = makeMotes(14, 900);

// Floating light motes (gold, teal, green); front layer is larger and sparser.
export const Motes: React.FC<{ front?: boolean; offset?: number }> = ({ front, offset = 0 }) => {
  const t = offset + useCurrentFrame() / FPS;
  const cx = camX(t);
  const list = front ? FRONT_MOTES : BACK_MOTES;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {list.map((m, i) => {
        const r = front ? m.r * 1.8 : m.r;
        const y = (((m.y - t * m.sp * (front ? 1.6 : 1)) % (H + 120)) + H + 120) % (H + 120) - 60;
        const x = m.x + Math.sin(t / 3 + m.ph) * m.sw + cx * (front ? 1.4 : 0.3 + r / 30);
        const tw = 0.6 + 0.4 * Math.sin(t * 1.3 + m.ph);
        const a = (front ? 0.35 : 1) * m.a * tw;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${m.col},${a}) 0%, rgba(${m.col},0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// The client's two backgrounds, alive: slow camera, breathing pattern, colour orbs, sweeping light, motes.
// Every movement is an oscillation, so no layer ever drifts past its overscan.
export const Backdrop: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const f = useCurrentFrame();
  const t = offset + f / FPS;
  const cx = camX(t);
  const cy = camY(t);
  const breathe = 1.12 + 0.03 * Math.sin(t / 9);
  const sweep = ((t / 22) % 1) * 1.6 - 0.3;
  const o1 = { x: 50 + 38 * Math.sin(t / 19), y: 40 + 25 * Math.cos(t / 23) };
  const o2 = { x: 50 + 40 * Math.cos(t / 17 + 2), y: 60 + 22 * Math.sin(t / 21 + 1) };
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <Img
        src={staticFile('img/bg-light-rays.jpg')}
        style={{
          position: 'absolute',
          width: W * 1.25,
          height: H * 1.25,
          left: -W * 0.125 + cx * 0.5 + Math.sin(t / 17) * 40,
          top: -H * 0.125 + cy * 0.5 + Math.cos(t / 21) * 18,
          objectFit: 'cover',
          transform: `scale(${breathe}) rotate(${Math.sin(t / 30) * 1.2}deg)`,
        }}
      />
      <Img
        src={staticFile('img/bg-ivory-pattern.jpg')}
        style={{
          position: 'absolute',
          width: W * 1.4,
          height: H * 1.4,
          left: -W * 0.2 - cx * 0.8 + Math.sin(t / 23) * 120,
          top: -H * 0.2 - cy * 0.8 + Math.cos(t / 29) * 40,
          objectFit: 'cover',
          mixBlendMode: 'multiply',
          opacity: 0.5,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 700px at ${o1.x}% ${o1.y}%, rgba(166,211,148,0.16), rgba(166,211,148,0) 70%), radial-gradient(circle 760px at ${o2.x}% ${o2.y}%, rgba(45,187,206,0.12), rgba(45,187,206,0) 70%)`,
        }}
      />
      <Img
        src={staticFile('brand/pattern-field.png')}
        style={{
          position: 'absolute',
          width: W * 1.3,
          left: -W * 0.15 + Math.sin(t / 25) * 90 - cx * 0.4,
          top: H * 0.55 + Math.cos(t / 19) * 20,
          opacity: 0.07,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
        }}
      />
      {/* moving shaft of light */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, rgba(255,252,240,0) ${sweep * 100 - 18}%, rgba(255,252,240,0.6) ${sweep * 100}%, rgba(255,252,240,0) ${sweep * 100 + 18}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <Motes offset={offset} />
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 75% 75% at 50% 45%, rgba(250,248,243,0.5) 0%, rgba(250,248,243,0) 60%, rgba(220,214,200,0.22) 100%)` }}
      />
    </AbsoluteFill>
  );
};

// Thin brand gradient ribbon along the bottom edge, like the print collateral.
export const Ribbon: React.FC<{ progress?: number }> = ({ progress = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 14,
      width: `${progress * 100}%`,
      background: `linear-gradient(90deg, ${C.green}, ${C.teal})`,
    }}
  />
);
