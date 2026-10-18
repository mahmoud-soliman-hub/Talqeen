import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Divider } from '../components/Ornaments';
import { Label, Title, Wipe } from '../components/Type';
import { Diamond, Icon, Photo } from '../components/Visual';
import { C } from '../theme';
import { font, k, kashida, useT, win } from '../lib';

const PROGRAMS = [
  { n: '01', name: 'بناء', title: 'برنامج التأسيس', at: 165.42, nameAt: 167.85, end: 169.5 },
  { n: '02', name: 'كما أنزل', title: 'برنامج التلاوة', at: 169.51, nameAt: 172.15, end: 174.05 },
  { n: '03', name: 'ترتيل', title: 'برنامج الحفظ والمراجعة', at: 174.04, nameAt: 177.12, end: 178.65 },
  { n: '04', name: 'الماهر', title: 'برنامج الضبط والإتقان', at: 178.66, nameAt: 181.46, end: 183.2 },
  { n: '05', name: 'السفرة', title: 'برنامج الإقراء والإجازة', at: 183.19, nameAt: 186.5, end: 188.6 },
];

// Ascending journey track: all five together at the section title, then one per scene.
const Journey: React.FC<{ active: number; reveal: number; big?: boolean }> = ({ active, reveal, big }) => {
  const t = useT();
  return (
    <div style={{ position: 'relative', height: big ? 360 : 140, direction: 'rtl' }}>
      <svg width={1400} height={big ? 360 : 140} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={1400} y1={big ? 300 : 40} x2={1400 - 1400 * reveal} y2={big ? 300 - 240 * reveal : 40} stroke={C.goldSoft} strokeWidth={2} />
        {active >= 0 && !big && (
          <line x1={1400} y1={40} x2={1400 - 350 * active} y2={40} stroke={C.teal} strokeWidth={4} />
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0 }}>
        {PROGRAMS.map((p, i) => {
          const x = 1400 - 350 * i;
          const y = big ? 300 - 60 * i : 40;
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
                fill={big || on ? C.teal : C.bg}
                stroke={big || on ? C.teal : C.goldSoft}
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
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: overview, alignItems: 'center' }}>
        <div style={{ marginTop: 120 }}>
          <Title text="المشاريع التعليمية" at={162.7} size={110} align="center" label="06" />
        </div>
        <div style={{ position: 'absolute', left: 260, top: 470, width: 1400 }}>
          <Journey active={-1} reveal={k(t, 162.8, 164.6)} big />
        </div>
      </AbsoluteFill>
      {PROGRAMS.map((p) => {
        const o = win(t, p.at - 0.25, p.end, 0.4);
        if (o <= 0) return null;
        const ghost = k(t, p.at - 0.2, p.at + 0.9);
        return (
          <AbsoluteFill key={p.n} style={{ opacity: o, alignItems: 'center' }}>
            <div style={{ marginTop: 120 }}>
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
                  opacity: ghost * (0.85 - 0.6 * k(t, p.nameAt - 0.4, p.nameAt + 0.6)),
                  lineHeight: 1,
                  direction: 'ltr',
                  transform: `scale(${1.08 - 0.08 * ghost})`,
                }}
              >
                {p.n}
              </span>
              <Wipe at={p.nameAt - 0.25} dur={1}>
                <p style={{ ...font(230, 700, C.ink), lineHeight: 1.15 }}>{kashida(p.name, 3)}</p>
              </Wipe>
            </div>
            <Divider width={560} progress={k(t, p.nameAt, p.nameAt + 1)} />
          </AbsoluteFill>
        );
      })}
      <div style={{ position: 'absolute', left: 260, bottom: 150, width: 1400, opacity: track * (1 - k(t, 188.0, 188.5)) }}>
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
  return (
    <AbsoluteFill>
      <Photo src="img/09-waqf-architecture.jpg" w={560} h={800} at={188.2} span={22} shape="arch" pos="30% 50%" style={{ position: 'absolute', left: 170, top: 140 }} />
      <div style={{ position: 'absolute', right: 160, top: 120, width: 1000 }}>
        <Title text="مشاريع الاستدامة" at={188.75} size={110} label="07" />
      </div>
      {/* active project, large */}
      <div style={{ position: 'absolute', right: 160, top: 400, width: 1000, height: 200 }}>
        {SUSTAIN.map((s, i) => {
          const o = win(t, s.at - 0.2, i < 4 ? SUSTAIN[i + 1].at - 0.1 : 212, 0.35);
          if (o <= 0) return null;
          return (
            <div key={s.name} style={{ position: 'absolute', right: 0, top: 0, opacity: o, textAlign: 'right' }}>
              <Wipe at={s.at} dur={0.6}>
                <p style={{ ...font(36, 300, C.gold), letterSpacing: 3 }}>مشروع</p>
              </Wipe>
              <Wipe at={s.nameAt - 0.2} dur={0.9}>
                <p style={{ ...font(96, 700, C.ink), lineHeight: 1.3 }}>{s.name}</p>
              </Wipe>
            </div>
          );
        })}
      </div>
      {/* all five */}
      <div style={{ position: 'absolute', right: 160, top: 690, width: 1000, display: 'flex', gap: 20, direction: 'rtl' }}>
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
                border: `2px solid ${done ? C.teal : 'rgba(184,154,94,0.35)'}`,
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
              <Icon name={s.icon} at={189.6 + i * 0.25} size={70} color={on ? '#FFFFFF' : C.tealDeep} />
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
        <Img
          src={staticFile('img/10-mosque-wide.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 70%', transform: `scale(${1.1 - 0.06 * k(t, 209.5, 216, (x) => x)})` }}
        />
        <AbsoluteFill style={{ background: `linear-gradient(0deg, ${C.bg} 8%, rgba(250,248,243,0.35) 60%, rgba(250,248,243,0.6) 100%)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img
          src={staticFile('brand/logo-vertical.png')}
          style={{ height: 380, opacity: logo, transform: `translateY(${(1 - logo) * 30}px) scale(${0.95 + 0.05 * logo})` }}
        />
        <div style={{ height: 40 }} />
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

