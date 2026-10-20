import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Divider } from '../components/Ornaments';
import { Label, Title, Wipe } from '../components/Type';
import { Diamond, Icon, Media, Photo } from '../components/Visual';
import { C } from '../theme';
import { MEDIA } from '../media';
import { font, k, kashida, useT, win } from '../lib';
import { useL } from '../layout';

const PROGRAMS = [
  { n: '01', name: 'بناء', title: 'برنامج التأسيس', at: 165.42, nameAt: 167.85, end: 169.5 },
  { n: '02', name: 'كما أنزل', title: 'برنامج التلاوة', at: 169.51, nameAt: 172.15, end: 174.05 },
  { n: '03', name: 'ترتيل', title: 'برنامج الحفظ والمراجعة', at: 174.04, nameAt: 177.12, end: 178.65 },
  { n: '04', name: 'الماهر', title: 'برنامج الضبط والإتقان', at: 178.66, nameAt: 181.46, end: 183.2 },
  { n: '05', name: 'السفرة', title: 'برنامج الإقراء والإجازة', at: 183.19, nameAt: 186.5, end: 188.6 },
];

// Ascending journey track: all five together at the section title, then one per scene.
// Landscape: a rising diagonal; vertical: a zig-zag ladder climbing the frame.
const Journey: React.FC<{ active: number; reveal: number; big?: boolean }> = ({ active, reveal, big }) => {
  const t = useT();
  const { V } = useL();
  const JW = V ? 920 : 1400;
  const step = JW / 4;
  const ladder = V && big;
  const pos = (i: number) =>
    ladder ? { x: JW / 2 + (i % 2 ? -190 : 190), y: 820 - 175 * i } : { x: JW - step * i, y: big ? 300 - 60 * i : 40 };
  const HT = ladder ? 900 : big ? 360 : 140;
  const pts = PROGRAMS.map((_, i) => pos(i));
  const total = pts.slice(1).reduce((s2, p2, i) => s2 + Math.hypot(p2.x - pts[i].x, p2.y - pts[i].y), 0);
  return (
    <div style={{ position: 'relative', height: HT, direction: 'rtl' }}>
      <svg width={JW} height={HT} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <polyline
          points={pts.map((p2) => `${p2.x},${p2.y}`).join(' ')}
          fill="none"
          stroke={C.goldSoft}
          strokeWidth={2}
          strokeDasharray={total}
          strokeDashoffset={total * (1 - reveal)}
        />
        {active >= 0 && !big && <line x1={JW} y1={40} x2={JW - step * active} y2={40} stroke={C.green} strokeWidth={4} />}
      </svg>
      <div style={{ position: 'absolute', inset: 0 }}>
        {PROGRAMS.map((p, i) => {
          const { x, y } = pos(i);
          const appear = big ? k(t, 162.9 + i * 0.22, 163.5 + i * 0.22) : 1;
          const on = i <= active;
          const cur = i === active;
          const s = big ? 34 : cur ? 40 : 26;
          return (
            <div
              key={p.n}
              style={{
                position: 'absolute',
                left: x - 140,
                top: y - s / 2,
                width: 280,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: appear,
                transform: `translateY(${(1 - appear) * 30}px)`,
              }}
            >
              <Diamond
                size={s}
                fill={cur || (big && i % 2 === 0) ? C.teal : on || big ? C.green : C.bg}
                stroke={cur || (big && i % 2 === 0) ? C.teal : on || big ? C.green : C.goldSoft}
                style={{ boxShadow: cur ? '0 0 0 12px rgba(43,181,201,0.13)' : undefined }}
              />
              <p style={{ ...font(big ? 50 : 32, big || cur ? 700 : 300, big || on ? C.ink : C.inkSoft), marginTop: big ? 26 : 20, whiteSpace: 'nowrap' }}>
                {p.name}
              </p>
              {big && <p style={{ ...font(26, 300, C.tealDeep), whiteSpace: 'nowrap' }}>{p.title}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Programs: React.FC = () => {
  const t = useT();
  const overview = win(t, 162.2, 165.6, 0.45);
  const active = PROGRAMS.findIndex((p) => t >= p.at - 0.25 && t < p.end);
  const track = k(t, 165.2, 165.9);
  const { V } = useL();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: overview, alignItems: 'center' }}>
        <div style={{ marginTop: V ? 260 : 120 }}>
          <Title text="المشاريع التعليمية" at={162.7} size={V ? 100 : 110} align="center" />
        </div>
        <div style={{ position: 'absolute', left: V ? 80 : 260, top: V ? 560 : 470, width: V ? 920 : 1400 }}>
          <Journey active={-1} reveal={k(t, 162.8, 164.6)} big />
        </div>
      </AbsoluteFill>
      {PROGRAMS.map((p) => {
        if (t < p.at - 0.3 || t > p.end) return null;
        const e = k(t, p.end - 0.5, p.end - 0.05);
        const ghost = k(t, p.at - 0.2, p.at + 0.9);
        return (
          <AbsoluteFill
            key={p.n}
            style={{ alignItems: 'center', opacity: 1 - e, transform: `translateY(${-70 * e}px) scale(${1 - 0.04 * e})`, clipPath: `inset(-5% 0 ${e * 60}% 0)` }}
          >
            <div style={{ marginTop: V ? 480 : 120 }}>
              <Wipe at={p.at + 0.2} dur={0.8}>
                <p style={{ ...font(54, 300, C.tealDeep), textAlign: 'center' }}>{p.title}</p>
              </Wipe>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 380 }}>
              <span
                style={{
                  ...font(460, 700, 'transparent'),
                  position: 'absolute',
                  WebkitTextStroke: `3px ${C.teal}`,
                  opacity: ghost * 0.85 * (1 - k(t, p.nameAt - 0.5, p.nameAt + 0.2)),
                  lineHeight: 1,
                  direction: 'ltr',
                  transform: `scale(${1.08 - 0.08 * ghost})`,
                }}
              >
                {p.n}
              </span>
              <Wipe at={p.nameAt - 0.25} dur={1}>
                <p style={{ ...font(V ? 190 : 230, 700, C.ink), lineHeight: 1.15 }}>{kashida(p.name, 3)}</p>
              </Wipe>
            </div>
            <Divider width={560} progress={k(t, p.nameAt, p.nameAt + 1)} />
          </AbsoluteFill>
        );
      })}
      <div style={{ position: 'absolute', left: V ? 80 : 260, bottom: V ? 380 : 150, width: V ? 920 : 1400, opacity: track * (1 - k(t, 188.0, 188.5)) }}>
        <Journey active={active} reveal={1} />
      </div>
    </AbsoluteFill>
  );
};

const SUSTAIN = [
  { at: 191.06, nameAt: 192.09, name: 'الوقف القرآني', icon: 'waqf' },
  { at: 194.69, nameAt: 195.7, name: 'كفالة حلقة قرآنية', icon: 'circle' },
  { at: 199.12, nameAt: 200.17, name: 'كفالة معلم', icon: 'teacher' },
  { at: 202.79, nameAt: 203.89, name: 'كفالة طالب', icon: 'student' },
  { at: 206.57, nameAt: 207.59, name: 'الاستثمار التشغيلي', icon: 'growth' },
];

export const Sustainability: React.FC = () => {
  const t = useT();
  const active = SUSTAIN.reduce((a, s, i) => (t >= s.at - 0.2 ? i : a), -1);
  const { V } = useL();
  return (
    <AbsoluteFill>
      <Photo
        src={MEDIA["s11-waqf"]}
        w={V ? 480 : 560}
        h={V ? 600 : 800}
        at={187.85}
        span={22}
        shape="arch"
        pos="50% 55%"
        style={{ position: 'absolute', left: V ? 300 : 170, top: V ? 170 : 140 }}
      />
      <div style={{ position: 'absolute', right: V ? 80 : 160, top: V ? 820 : 120, width: V ? 920 : 1000 }}>
        <Title text="مشاريع الاستدامة" at={188.75} size={V ? 96 : 110} />
      </div>
      {/* active project, large */}
      <div style={{ position: 'absolute', right: V ? 80 : 160, top: V ? 1070 : 400, width: V ? 920 : 1000, height: 200 }}>
        {SUSTAIN.map((s, i) => {
          const o = win(t, s.at - 0.2, i < 4 ? SUSTAIN[i + 1].at - 0.1 : 212, 0.35);
          if (o <= 0) return null;
          return (
            <div key={s.name} style={{ position: 'absolute', right: 0, top: 0, opacity: o, textAlign: 'right' }}>
              <Wipe at={s.at} dur={0.6}>
                <p style={{ ...font(36, 700, C.goldDeep) }}>مشروع</p>
              </Wipe>
              <Wipe at={s.nameAt - 0.2} dur={0.9}>
                <p style={{ ...font(V ? 84 : 96, 700, C.ink), lineHeight: 1.3 }}>{s.name}</p>
              </Wipe>
            </div>
          );
        })}
      </div>
      {/* all five */}
      <div style={{ position: 'absolute', right: V ? 80 : 160, top: V ? 1360 : 690, width: V ? 920 : 1000, display: 'flex', gap: V ? 14 : 20, direction: 'rtl' }}>
        {SUSTAIN.map((s, i) => {
          const p = k(t, 189.4 + i * 0.25, 190.2 + i * 0.25);
          const on = i === active;
          const done = i <= active;
          return (
            <div
              key={s.name}
              style={{
                flex: 1,
                height: 250,
                borderRadius: 26,
                background: on ? `linear-gradient(160deg, ${C.teal}, ${C.tealDeep})` : '#FFFFFF',
                border: `2px solid ${on ? C.teal : done ? C.green : 'rgba(184,154,94,0.35)'}`,
                boxShadow: on ? '0 30px 50px -28px rgba(30,120,140,0.6)' : '0 18px 36px -30px rgba(30,70,80,0.4)',
                opacity: p,
                transform: `translateY(${(1 - p) * 40 - (on ? 14 : 0)}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 14px',
              }}
            >
              <Icon name={s.icon} at={189.6 + i * 0.25} size={70} color={on ? '#FFFFFF' : i % 2 ? C.greenDeep : C.tealDeep} />
              <p style={{ ...font(30, 700, on ? '#FFFFFF' : C.ink), marginTop: 18, textAlign: 'center', lineHeight: 1.3 }}>{s.name}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 3:30 — closing card with contact details.
export const Outro: React.FC = () => {
  const t = useT();
  const bg = k(t, 209.5, 211.5);
  const logo = k(t, 210.0, 211.4);
  const contact = [
    { at: 211.6, icon: 'M4 6h16v12H4z M4 7l8 6 8-6', text: 'tq@talqin.com' },
    { at: 212.0, icon: 'M7 3h4l1.5 5-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5 5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2z', text: '0534734711' },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: bg * 0.55 }}>
        <Media src={MEDIA['s12-outro']} pos="50% 70%" style={{ transform: `scale(${1.1 - 0.06 * k(t, 209.5, 216, (x) => x)})` }} />
        <AbsoluteFill style={{ background: `linear-gradient(0deg, ${C.bg} 8%, rgba(250,248,243,0.35) 60%, rgba(250,248,243,0.6) 100%)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img
          src={staticFile('brand/logo-vertical.png')}
          style={{ height: 380, opacity: logo, transform: `translateY(${(1 - logo) * 30}px) scale(${0.95 + 0.05 * logo})` }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, opacity: k(t, 210.8, 211.6), transform: `translateY(${(1 - k(t, 210.8, 211.6)) * 12}px)` }}>
          <div style={{ width: 46, height: 2, background: C.green }} />
          <p style={{ ...font(40, 700, '#727373'), lineHeight: 1.2 }}>بمنطقة تبوك</p>
          <div style={{ width: 46, height: 2, background: C.green }} />
        </div>
        <div style={{ height: 34 }} />
        <Divider width={640} progress={k(t, 210.8, 211.8)} />
        <div style={{ height: 30 }} />
        <div style={{ display: 'flex', gap: 80, direction: 'ltr' }}>
          {contact.map((c) => {
            const p = k(t, c.at, c.at + 0.7);
            return (
              <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth={1.6} strokeLinejoin="round">
                  <path d={c.icon} />
                </svg>
                <span style={{ ...font(46, 700, C.ink), direction: 'ltr', letterSpacing: 1 }}>{c.text}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          height: 14,
          width: `${k(t, 210.2, 212.4) * 100}%`,
          background: `linear-gradient(90deg, ${C.green}, ${C.teal})`,
        }}
      />
    </AbsoluteFill>
  );
};

