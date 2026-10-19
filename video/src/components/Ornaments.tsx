import React from 'react';
import { C } from '../theme';

// Fine line with a diamond-chain centrepiece; draws outward from the centre.
export const Divider: React.FC<{ width: number; progress: number; color?: string }> = ({
  width,
  progress,
  color = C.gold,
}) => {
  const half = width / 2;
  const lineLen = half - 70;
  const p = Math.max(0, Math.min(1, progress));
  const motif = Math.min(1, p * 2.2);
  return (
    <svg width={width} height={28} viewBox={`0 0 ${width} 28`} style={{ overflow: 'visible' }}>
      <g stroke={color} strokeWidth={1.4} fill="none">
        <line x1={half - 62} y1={14} x2={half - 62 - lineLen * p} y2={14} />
        <line x1={half + 62} y1={14} x2={half + 62 + lineLen * p} y2={14} />
        <circle cx={half - 62 - lineLen * p} cy={14} r={3} fill={C.green} opacity={p} />
        <circle cx={half + 62 + lineLen * p} cy={14} r={3} fill={C.green} opacity={p} />
      </g>
      <g opacity={motif} transform={`translate(${half} 14) scale(${0.6 + 0.4 * motif})`}>
        {[-40, -20, 0, 20, 40].map((x, i) => {
          const s = i === 2 ? 9 : i % 2 ? 6 : 4;
          return (
            <rect
              key={x}
              x={x - s}
              y={-s}
              width={s * 2}
              height={s * 2}
              transform={`rotate(45 ${x} 0)`}
              rx={1.5}
              fill={i === 2 ? C.green : 'none'}
              stroke={i === 2 ? C.greenDeep : color}
              strokeWidth={1.3}
            />
          );
        })}
      </g>
    </svg>
  );
};

// Pointed dome arch, echoing the logo's mihrab silhouette.
export const archPath = (w: number, h: number) => archPathAt(0, 0, w, h);

export const archPathAt = (ox: number, oy: number, w: number, h: number) => {
  const r = w / 2;
  const shoulder = h * 0.34;
  const P = (x: number, y: number) => `${(x + ox).toFixed(1)} ${(y + oy).toFixed(1)}`;
  return [
    `M ${P(0, h)}`,
    `L ${P(0, shoulder)}`,
    `C ${P(0, shoulder * 0.45)}, ${P(r * 0.55, shoulder * 0.18)}, ${P(r * 0.86, shoulder * 0.1)}`,
    `C ${P(r * 0.95, shoulder * 0.07)}, ${P(r, 0)}, ${P(r, 0)}`,
    `C ${P(r, 0)}, ${P(r * 1.05, shoulder * 0.07)}, ${P(r * 1.14, shoulder * 0.1)}`,
    `C ${P(w - r * 0.55, shoulder * 0.18)}, ${P(w, shoulder * 0.45)}, ${P(w, shoulder)}`,
    `L ${P(w, h)}`,
    'Z',
  ].join(' ');
};

export const ArchFrame: React.FC<{
  w: number;
  h: number;
  draw: number;
  fill?: number;
  children?: React.ReactNode;
}> = ({ w, h, draw, fill = 1, children }) => {
  const d = archPath(w, h);
  const perim = w * 2 + h * 2.2;
  const id = `arch-${w}-${h}`;
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id={id}>
            <path d={d} />
          </clipPath>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F2EFE6" />
          </linearGradient>
        </defs>
        <path d={d} fill={`url(#${id}-g)`} opacity={fill} />
        <foreignObject width={w} height={h} clipPath={`url(#${id})`} opacity={fill}>
          <div style={{ width: w, height: h, position: 'relative' }}>{children}</div>
        </foreignObject>
        <path
          d={d}
          fill="none"
          stroke={C.gold}
          strokeWidth={2}
          strokeDasharray={perim}
          strokeDashoffset={perim * (1 - draw)}
        />
        <path
          d={d}
          fill="none"
          stroke={C.goldSoft}
          strokeWidth={1}
          transform={`translate(${w * 0.04} ${h * 0.03}) scale(0.92 0.97)`}
          strokeDasharray={perim}
          strokeDashoffset={perim * (1 - draw)}
          opacity={0.8}
        />
      </svg>
    </div>
  );
};
