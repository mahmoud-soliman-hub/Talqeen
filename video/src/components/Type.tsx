import React from 'react';
import { C } from '../theme';
import { font, k, kashida, useT } from '../lib';

// Right-to-left wipe with a slight rise — the house entrance for headings.
export const Wipe: React.FC<{ at: number; dur?: number; out?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  dur = 0.9,
  out,
  children,
  style,
}) => {
  const t = useT();
  const p = k(t, at, at + dur);
  const o = out === undefined ? 0 : k(t, out, out + 0.5);
  return (
    <div
      style={{
        clipPath: `inset(-20% ${o * 100}% -20% ${(1 - p) * 100}%)`,
        transform: `translateY(${(1 - p) * 24}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Section heading: single word gets a kashida stretch, then a gradient rule draws under it.
export const Title: React.FC<{
  text: string;
  at: number;
  size?: number;
  align?: 'right' | 'center';
  stretch?: boolean;
  label?: string;
  rule?: boolean;
}> = ({ text, at, size = 140, align = 'right', stretch = true, label, rule = true }) => {
  const t = useT();
  const shown = stretch && !text.includes(' ') ? kashida(text, 3) : text;
  const r = k(t, at + 0.35, at + 1.2);
  return (
    <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-end' }}>
      {label && (
        <Wipe at={at - 0.15} dur={0.7}>
          <p style={{ ...font(36, 700, C.goldDeep) }}>{label}</p>
        </Wipe>
      )}
      <Wipe at={at} dur={1}>
        <p style={{ ...font(size, 700, C.ink), lineHeight: 1.2 }}>{shown}</p>
      </Wipe>
      {rule && (
        <div style={{ height: 4, width: 170 * r, marginTop: 14, background: `linear-gradient(270deg, ${C.teal}, ${C.green})` }} />
      )}
    </div>
  );
};

export type Seg = { s: number; e: number; text: string };

// Words rise into place one by one, paced across the voiceover segment that speaks them.
export const Words: React.FC<{
  segs: Seg[];
  size?: number;
  weight?: 300 | 700;
  color?: string;
  hot?: string[];
  hotColor?: string;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({ segs, size = 52, weight = 300, color = C.ink, hot = [], hotColor = C.tealDeep, lineHeight = 1.55, style }) => {
  const t = useT();
  const items: { w: string; at: number }[] = [];
  segs.forEach((sg) => {
    const ws = sg.text.split(' ');
    const span = Math.max(0.3, sg.e - sg.s - 0.25);
    ws.forEach((w, i) => items.push({ w, at: sg.s - 0.12 + (span * i) / ws.length }));
  });
  return (
    <p style={{ ...font(size, weight, color), lineHeight, ...style }}>
      {items.map(({ w, at }, i) => {
        const p = k(t, at, at + 0.55);
        const isHot = hot.some((h) => w.replace(/[،.]/g, '').includes(h));
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                opacity: p,
                transform: `translateY(${(1 - p) * 0.35 * size}px)`,
                color: isHot ? hotColor : undefined,
                fontWeight: isHot ? 700 : undefined,
              }}
            >
              {w}
            </span>{' '}
          </React.Fragment>
        );
      })}
    </p>
  );
};

// Small gold caps-style label used above headings.
export const Label: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Wipe at={at} dur={0.7}>
    <p style={{ ...font(36, 700, C.goldDeep) }}>{children}</p>
  </Wipe>
);
