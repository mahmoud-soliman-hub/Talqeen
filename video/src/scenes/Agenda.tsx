import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { Divider } from '../components/Ornaments';
import { Icon } from '../components/Visual';
import { C, FPS } from '../theme';
import { Layout, useL } from '../layout';
import { font, k } from '../lib';
import { AGENDA, FIRST_GAP, GAPS, gapStart } from '../timeline';

// Card grid, read right-to-left: 4×2 in landscape, 2×4 in vertical.
export const tileGrid = (L: Layout) => {
  const cols = L.V ? 2 : 4;
  const TILE = L.V ? { w: 440, h: 250, gx: 40, gy: 40, top: 470 } : { w: 380, h: 250, gx: 40, gy: 44, top: 340 };
  const left0 = (L.W - (TILE.w * cols + TILE.gx * (cols - 1))) / 2;
  const tileBox = (i: number) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = left0 + (cols - 1 - col) * (TILE.w + TILE.gx);
    const y = TILE.top + row * (TILE.h + TILE.gy);
    return { x, y, cx: x + TILE.w / 2, cy: y + TILE.h / 2 };
  };
  return { TILE, tileBox };
};

const easeIn = Easing.bezier(0.55, 0, 0.75, 0.4);

// Timings (seconds from gap start) for the first, full reveal and for the short returns.
const phases = (first: boolean) =>
  first
    ? { in: [0.2, 1.0], tiles: 1.0, stagger: 0.32, mark: [9, 9], hi: [4.5, 5.1], zoom: [5.75, FIRST_GAP - 0.35] }
    : { in: [0.0, 0.6], tiles: -1, stagger: 0, mark: [0.8, 1.25], hi: [1.0, 1.5], zoom: [1.5, 2.65] };

export const Agenda: React.FC = () => {
  const n = useCurrentFrame() / FPS;
  const L = useL();
  const { W, H } = L;
  const { TILE, tileBox } = tileGrid(L);
  const gi = GAPS.findIndex((g) => n >= gapStart(g) && n < gapStart(g) + g.add);
  if (gi < 0) return null;
  const g = GAPS[gi];
  const u = n - gapStart(g);
  const P = phases(gi === 0);
  const j = g.item;
  const zp = k(u, P.zoom[0], P.zoom[1], easeIn);
  const z = 1 + (L.V ? 3.2 : 4.6) * zp; // card fills the frame at the end of the dive
  const target = tileBox(j);
  const layer = k(u, P.in[0], P.in[1]);
  return (
    <AbsoluteFill style={{ opacity: layer }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${target.cx}px ${target.cy}px`,
          transform: `translate(${(W / 2 - target.cx) * zp}px, ${(H / 2 - target.cy) * zp}px) scale(${z})`,
        }}
      >
        <div style={{ position: 'absolute', top: L.V ? 230 : 120, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p
            style={{
              ...font(78, 700, C.ink),
              opacity: k(u, P.in[0] + 0.2, P.in[1] + 0.4),
              transform: `translateY(${(1 - k(u, P.in[0] + 0.2, P.in[1] + 0.4)) * 24}px)`,
            }}
          >
            محاور الفيلم
          </p>
          <div style={{ height: 14 }} />
          <Divider width={520} progress={gi === 0 ? k(u, 0.6, 1.6) : 1} />
        </div>
        {AGENDA.map((a, i) => {
          const box = tileBox(i);
          const appear = P.tiles < 0 ? 1 : k(u, P.tiles + i * P.stagger, P.tiles + 0.6 + i * P.stagger);
          const done = i < j;
          const justDone = i === j - 1 ? k(u, P.mark[0], P.mark[1]) : done ? 1 : 0;
          const hi = i === j ? k(u, P.hi[0], P.hi[1]) : 0;
          const iconCol = i % 2 ? C.greenDeep : C.tealDeep;
          return (
            <div
              key={a.title}
              style={{
                position: 'absolute',
                left: box.x,
                top: box.y,
                width: TILE.w,
                height: TILE.h,
                borderRadius: 28,
                background: '#FFFFFF',
                border: `${2 + hi}px solid ${hi > 0 ? C.teal : done ? 'rgba(166,211,148,0.9)' : 'rgba(184,154,94,0.3)'}`,
                boxShadow: hi > 0 ? `0 0 0 ${10 * hi}px rgba(45,187,206,0.14), 0 30px 60px -30px rgba(30,120,140,0.55)` : '0 22px 44px -32px rgba(30,70,80,0.45)',
                opacity: appear * (done ? 0.82 : 1),
                transform: `translateY(${(1 - appear) * 40}px) scale(${1 + 0.06 * hi})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  background: i % 2 ? 'rgba(166,211,148,0.18)' : 'rgba(45,187,206,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={a.icon} at={-1} size={54} color={iconCol} />
              </div>
              <p style={{ ...font(40, 700, done ? C.inkSoft : C.ink), textAlign: 'center', lineHeight: 1.2 }}>{a.title}</p>
              {justDone > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: -16,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: C.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${justDone})`,
                    boxShadow: '0 8px 18px -8px rgba(80,140,70,0.6)',
                  }}
                >
                  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
