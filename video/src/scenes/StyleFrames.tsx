import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop, Ribbon } from '../components/Backdrop';
import { ArchFrame, Divider } from '../components/Ornaments';
import { C, FONT } from '../theme';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const k = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

const txt = (size: number, weight: 300 | 700, color = C.ink): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: weight,
  fontSize: size,
  color,
  direction: 'rtl',
  lineHeight: 1.35,
  margin: 0,
});

// 1 — Opening: logo + slogan
export const FrameOpening: React.FC = () => {
  const f = useCurrentFrame();
  const a = k(f, 0, 40);
  return (
    <AbsoluteFill>
      <Backdrop patternOpacity={0.09} glow={[0.5, 0.32]} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img
          src={staticFile('brand/logo-vertical.png')}
          style={{ height: 430, opacity: a, transform: `translateY(${(1 - a) * 30}px) scale(${0.96 + 0.04 * a})` }}
        />
        <div style={{ height: 46 }} />
        <Divider width={620} progress={k(f, 20, 60)} />
        <div style={{ height: 26 }} />
        <p style={{ ...txt(78, 700, C.ink), opacity: k(f, 35, 70), letterSpacing: 1 }}>
          تلقينٌ <span style={{ color: C.teal }}>وإتقان</span>
        </p>
      </AbsoluteFill>
      <Ribbon progress={k(f, 10, 80)} />
    </AbsoluteFill>
  );
};

// 2 — Vision: title + statement beside an arch
export const FrameVision: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop glow={[0.25, 0.3]} />
      <div style={{ position: 'absolute', left: 170, top: 150 }}>
        <ArchFrame w={560} h={780} draw={k(f, 0, 60)} fill={k(f, 20, 60)}>
          <Img
            src={staticFile('brand/pattern-field.png')}
            style={{ position: 'absolute', width: 1400, left: -420, top: 120, opacity: 0.22 }}
          />
          <Img
            src={staticFile('brand/logo-mark.png')}
            style={{ position: 'absolute', width: 230, left: 165, top: 300, opacity: 0.95 }}
          />
        </ArchFrame>
      </div>
      <div style={{ position: 'absolute', right: 170, top: 250, width: 900, textAlign: 'right' }}>
        <p style={{ ...txt(30, 300, C.gold), letterSpacing: 6 }}>01</p>
        <p style={{ ...txt(150, 700, C.ink), marginTop: 6 }}>الرؤية</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '18px 0 34px' }}>
          <div style={{ width: 160 * k(f, 10, 50), height: 4, background: `linear-gradient(270deg, ${C.teal}, ${C.green})` }} />
        </div>
        <p style={txt(50, 300, C.ink)}>
          <b style={{ fontWeight: 700, color: C.tealDeep }}>الريادة</b> في تأسيس نموذج تعليمي قرآني أداءً وإتقاناً،
          وتلاوة وحفظًا وفق أعلى معايير الضبط والجودة الإقرائية.
        </p>
      </div>
      <Img src={staticFile('brand/logo-horizontal.png')} style={{ position: 'absolute', right: 70, bottom: 60, height: 70, opacity: 0.9 }} />
      <Ribbon />
    </AbsoluteFill>
  );
};

// 3 — Program: one program per scene, with the 5-step journey underneath
const PROGRAMS = [
  { n: '01', name: 'بناء', title: 'برنامج التأسيس' },
  { n: '02', name: 'كما أنزل', title: 'برنامج التلاوة' },
  { n: '03', name: 'ترتيل', title: 'برنامج الحفظ والمراجعة' },
  { n: '04', name: 'الماهر', title: 'برنامج الضبط والإتقان' },
  { n: '05', name: 'السفرة', title: 'برنامج الإقراء والإجازة' },
];

export const FrameProgram: React.FC<{ index?: number }> = ({ index = 0 }) => {
  const f = useCurrentFrame();
  const p = PROGRAMS[index];
  return (
    <AbsoluteFill>
      <Backdrop glow={[0.5, 0.25]} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 120 }}>
        <p style={{ ...txt(30, 300, C.gold), letterSpacing: 6 }}>المشاريع التعليمية</p>
        <div style={{ position: 'relative', marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span
            style={{
              ...txt(420, 700, 'transparent'),
              position: 'absolute',
              WebkitTextStroke: `2px ${C.goldSoft}`,
              opacity: 0.35,
              top: -60,
              lineHeight: 1,
              direction: 'ltr',
            }}
          >
            {p.n}
          </span>
          <p style={{ ...txt(220, 700, C.ink), lineHeight: 1.1, position: 'relative' }}>{p.name}</p>
        </div>
        <div style={{ height: 40 }} />
        <Divider width={520} progress={k(f, 10, 50)} />
        <p style={{ ...txt(64, 300, C.tealDeep), marginTop: 18 }}>{p.title}</p>
      </AbsoluteFill>
      {/* journey track */}
      <div style={{ position: 'absolute', left: 260, right: 260, bottom: 120, height: 120, direction: 'rtl' }}>
        <div style={{ position: 'absolute', top: 30, left: 0, right: 0, height: 2, background: C.goldSoft }} />
        <div
          style={{
            position: 'absolute',
            top: 29,
            right: 0,
            height: 4,
            width: `${(index / 4) * 100}%`,
            background: `linear-gradient(270deg, ${C.green}, ${C.teal})`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {PROGRAMS.map((q, i) => {
            const on = i <= index;
            return (
              <div key={q.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
                <div
                  style={{
                    width: i === index ? 46 : 30,
                    height: i === index ? 46 : 30,
                    marginTop: i === index ? 8 : 16,
                    transform: 'rotate(45deg)',
                    borderRadius: 6,
                    background: on ? C.teal : C.bg,
                    border: `2px solid ${on ? C.teal : C.goldSoft}`,
                    boxShadow: i === index ? `0 0 0 10px rgba(43,181,201,0.12)` : 'none',
                  }}
                />
                <p style={{ ...txt(32, i === index ? 700 : 300, on ? C.ink : C.inkSoft), marginTop: 22, whiteSpace: 'nowrap' }}>
                  {q.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <Ribbon />
    </AbsoluteFill>
  );
};
