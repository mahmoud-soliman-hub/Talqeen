import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FPS, H, W } from '../theme';
import { EASE, k } from '../lib';

// Scene cuts in seconds; the background camera drifts a step at each one (parallax against the scenes).
export const CUTS = [8.35, 25.05, 40.05, 50.95, 63.15, 82.35, 89.95, 130.75, 162.05, 188.35, 209.65];

const camX = (t: number) => CUTS.reduce((x, c, i) => x + k(t, c - 0.6, c + 0.9, EASE) * (i % 2 ? -1 : 1) * 70, 0);
const camY = (t: number) => CUTS.reduce((y, c, i) => y + k(t, c - 0.6, c + 0.9, EASE) * (i % 3 === 0 ? 24 : -16), 0);

// Deterministic hash → [0,1)
const h = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const MOTES = Array.from({ length: 46 }, (_, i) => ({
  x: h(i) * W,
  y: h(i + 100) * H,
  r: 3 + h(i + 200) * 16,
  sp: 8 + h(i + 300) * 22,
  sw: 10 + h(i + 400) * 30,
  ph: h(i + 500) * Math.PI * 2,
  gold: h(i + 600) > 0.45,
  a: 0.25 + h(i + 700) * 0.5,
}));

// The client's two backgrounds, alive: slow camera, drifting pattern, sweeping light, floating motes.
export const Backdrop: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const f = useCurrentFrame();
  const t = offset + f / FPS;
  const cx = camX(t);
  const cy = camY(t);
  const breathe = 1.1 + 0.03 * Math.sin(t / 9);
  const sweep = ((t / 26) % 1) * 1.6 - 0.3;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <Img
        src={staticFile('img/bg-light-rays.jpg')}
        style={{
          position: 'absolute',
          width: W * 1.25,
          height: H * 1.25,
          left: -W * 0.125 + cx * 0.6 + Math.sin(t / 17) * 30,
          top: -H * 0.125 + cy * 0.6,
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
          left: -W * 0.2 - cx * 1.2 - t * 3,
          top: -H * 0.2 - cy,
          objectFit: 'cover',
          mixBlendMode: 'multiply',
          opacity: 0.55,
        }}
      />
      {/* moving shaft of light */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, rgba(255,252,240,0) ${sweep * 100 - 18}%, rgba(255,252,240,0.55) ${sweep * 100}%, rgba(255,252,240,0) ${sweep * 100 + 18}%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* floating motes */}
      {MOTES.map((m, i) => {
        const y = (((m.y - t * m.sp) % (H + 80)) + H + 80) % (H + 80) - 40;
        const x = m.x + Math.sin(t / 3 + m.ph) * m.sw + cx * (0.3 + m.r / 30);
        const tw = 0.6 + 0.4 * Math.sin(t * 1.3 + m.ph);
        const col = m.gold ? '217,199,158' : '43,181,201';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: m.r * 2,
              height: m.r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${col},${m.a * tw}) 0%, rgba(${col},0) 70%)`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 75% 75% at 50% 45%, rgba(250,248,243,0.55) 0%, rgba(250,248,243,0) 60%, rgba(220,214,200,0.25) 100%)` }}
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
