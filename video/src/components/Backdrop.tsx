import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, H, W } from '../theme';

// Ivory base, faint brand pattern, slow drifting light — shared by every scene.
export const Backdrop: React.FC<{ patternOpacity?: number; glow?: [number, number] }> = ({
  patternOpacity = 0.07,
  glow = [0.72, 0.28],
}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 900], [0, -60]);
  const gx = glow[0] * 100 + Math.sin(f / 140) * 4;
  const gy = glow[1] * 100 + Math.cos(f / 170) * 3;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 80% at 50% 45%, ${C.bg} 0%, ${C.bg} 45%, ${C.bgEdge} 100%)`,
        }}
      />
      <Img
        src={staticFile('brand/pattern-field.png')}
        style={{
          position: 'absolute',
          width: W * 1.15,
          left: -W * 0.075,
          top: H * 0.38 + drift,
          opacity: patternOpacity,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%, black 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 620px at ${gx}% ${gy}%, rgba(255,250,236,0.95) 0%, rgba(255,250,236,0) 70%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 900px at ${100 - gx}% ${100 - gy * 0.6}%, rgba(43,181,201,0.07) 0%, rgba(43,181,201,0) 70%)`,
        }}
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
