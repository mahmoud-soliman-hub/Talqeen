import React from 'react';
import { Img, OffthreadVideo, staticFile } from 'remotion';
import { C } from '../theme';
import { k, useT } from '../lib';
import { archPath } from './Ornaments';

// Photo with slow push-in; revealed by an expanding mask. shape: 'arch' | 'rect'.
export const Photo: React.FC<{
  src: string;
  w: number;
  h: number;
  at: number;
  span?: number;
  shape?: 'arch' | 'rect';
  pos?: string;
  zoom?: [number, number];
  radius?: number;
  frame?: boolean;
  style?: React.CSSProperties;
}> = ({ src, w, h, at, span = 12, shape = 'rect', pos = '50% 50%', zoom = [1.14, 1.02], radius = 28, frame = true, style }) => {
  const t = useT();
  const p = k(t, at, at + 1.2);
  const z = zoom[0] + (zoom[1] - zoom[0]) * k(t, at, at + span, (x) => x);
  const d = archPath(w, h);
  const perim = w * 2 + h * 2.2;
  const clip =
    shape === 'arch'
      ? `path('${d}')`
      : `inset(${(1 - p) * 50}% 0 ${(1 - p) * 50}% 0 round ${radius}px)`;
  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: clip,
          opacity: shape === 'arch' ? p : 1,
          overflow: 'hidden',
          borderRadius: shape === 'rect' ? radius : 0,
          boxShadow: shape === 'rect' ? '0 30px 60px -30px rgba(40,60,60,0.35)' : undefined,
        }}
      >
        <Media src={src} pos={pos} scale={z} />
      </div>
      {shape === 'arch' && frame && (
        <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path
            d={d}
            fill="none"
            stroke={C.gold}
            strokeWidth={2}
            strokeDasharray={perim}
            strokeDashoffset={perim * (1 - k(t, at - 0.3, at + 1.6))}
            transform={`translate(-14 -14) scale(${(w + 28) / w} ${(h + 14) / h})`}
          />
        </svg>
      )}
    </div>
  );
};

const ICONS: Record<string, string> = {
  book: 'M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z M12 6.5v13',
  users: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2.5 19c.6-3.3 3-5 5.5-5s4.9 1.7 5.5 5 M16 11a2.5 2.5 0 1 0 0-5 M18 14c2 .6 3.3 2.3 3.6 5',
  badge: 'M12 2.8l2.4 1.7 2.9-.1.9 2.8 2.3 1.8-.9 2.8.9 2.8-2.3 1.8-.9 2.8-2.9-.1L12 21.2l-2.4-1.7-2.9.1-.9-2.8-2.3-1.8.9-2.8-.9-2.8 2.3-1.8.9-2.8 2.9.1z M8.5 12.2l2.3 2.3 4.7-4.8',
  tablet: 'M6 3h12a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 6 3z M10.5 18h3',
  chart: 'M4 20V11 M10 20V5 M16 20v-7 M21 20H3',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  doc: 'M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6',
  voice: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5.5 11.5a6.5 6.5 0 0 0 13 0 M12 18v3',
  leaf: 'M5 19c0-8 5-13 14-14-1 9-6 14-14 14z M5 19l7-7',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12h.01',
  waqf: 'M4 21V11l8-6 8 6v10z M9 21v-5a3 3 0 0 1 6 0v5 M2 21h20',
  heart: 'M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z',
  teacher: 'M12 4l9 4-9 4-9-4z M7 10v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V10 M21 8v6',
  student: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20.5c.8-3.8 3.9-6 7.5-6s6.7 2.2 7.5 6',
  growth: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
  circle: 'M12 3.5a1.6 1.6 0 1 0 0 .01 M18 6a1.6 1.6 0 1 0 0 .01 M20.5 12a1.6 1.6 0 1 0 0 .01 M18 18a1.6 1.6 0 1 0 0 .01 M12 20.5a1.6 1.6 0 1 0 0 .01 M6 18a1.6 1.6 0 1 0 0 .01 M3.5 12a1.6 1.6 0 1 0 0 .01 M6 6a1.6 1.6 0 1 0 0 .01 M12 9.5l2.5 2.5-2.5 2.5-2.5-2.5z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z M8.5 12l2.5 2.5 4.5-4.5',
  sparkle: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z',
};

// Line icon that draws itself in.
export const Icon: React.FC<{ name: keyof typeof ICONS | string; at: number; size?: number; color?: string; stroke?: number }> = ({
  name,
  at,
  size = 64,
  color = C.tealDeep,
  stroke = 1.4,
}) => {
  const t = useT();
  const p = k(t, at, at + 1.1);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
      {ICONS[name].split(' M').map((seg, i) => (
        <path
          key={i}
          d={(i ? 'M' : '') + seg}
          pathLength={1}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      ))}
    </svg>
  );
};

// Brand diamond (from the logo's two stacked dots).
export const Diamond: React.FC<{ size: number; fill?: string; stroke?: string; style?: React.CSSProperties }> = ({
  size,
  fill = C.teal,
  stroke,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      transform: 'rotate(45deg)',
      borderRadius: size * 0.18,
      background: fill,
      border: stroke ? `2px solid ${stroke}` : undefined,
      ...style,
    }}
  />
);

// Image or muted stock clip (slowed for a calmer, cinematic feel), cover-fitted.
export const Media: React.FC<{ src: string; pos?: string; scale?: number; rate?: number; from?: number; style?: React.CSSProperties }> = ({
  src,
  pos = '50% 50%',
  scale = 1,
  rate = 0.75,
  from = 0,
  style,
}) => {
  const css: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${scale})`, ...style };
  return src.endsWith('.mp4') ? (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} startFrom={Math.round(from * 30)} style={css} />
  ) : (
    <Img src={staticFile(src)} style={css} />
  );
};
