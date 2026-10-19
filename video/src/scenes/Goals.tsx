import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Divider, archPath } from '../components/Ornaments';
import { Label, Title, Wipe, Words, Seg } from '../components/Type';
import { Diamond, Icon, Media } from '../components/Visual';
import { C } from '../theme';
import { MEDIA } from '../media';
import { font, k, useT, win } from '../lib';

const GOALS: { n: string; at: number; end: number; img: string; pos: string; tint?: string; segs: Seg[]; hot: string[] }[] = [
  {
    n: '01',
    at: 93.03,
    end: 102.6,
    img: MEDIA['g01-tilawa'],
    pos: '50% 60%',
    segs: [
      { s: 94.17, e: 99.26, text: 'تمكين الطلاب من تلاوة القرآن الكريم وتجويده بتطبيق عملي دقيق' },
      { s: 99.56, e: 101.86, text: 'وفق قواعد الرواية والدراية' },
    ],
    hot: ['تلاوة', 'وتجويده', 'الرواية', 'والدراية'],
  },
  {
    n: '02',
    at: 102.83,
    end: 111.6,
    img: MEDIA['g02-huffaz'],
    pos: '58% 62%',
    segs: [{ s: 103.96, e: 110.8, text: 'إعداد جيل متميز من الحفّاظ المتقنين المؤهلين للالتحاق ببرامج الإجازات والأسانيد' }],
    hot: ['الحفّاظ', 'المتقنين', 'الإجازات', 'والأسانيد'],
  },
  {
    n: '03',
    at: 111.87,
    end: 120.7,
    img: MEDIA['g03-supervision'],
    pos: '30% 50%',
    segs: [
      { s: 112.81, e: 116.17, text: 'تطبيق معايير إشرافية وتقييمية دقيقة' },
      { s: 116.54, e: 119.91, text: 'لمتابعة تطور المستويات والأداء التشغيلي' },
    ],
    hot: ['إشرافية', 'وتقييمية'],
  },
  {
    n: '04',
    at: 120.94,
    end: 131.0,
    img: MEDIA['g04-environment'],
    pos: '50% 50%',
    tint: 'sepia(0.45) saturate(1.3) brightness(1.06) contrast(0.95)',
    segs: [
      { s: 121.94, e: 127.38, text: 'توفير بيئة تعليمية جاذبة ومكتملة التجهيزات التقنية والتعليمية' },
      { s: 127.74, e: 129.19, text: 'والسعي لاستدامتها' },
    ],
    hot: ['جاذبة', 'لاستدامتها'],
  },
];

export const Goals: React.FC = () => {
  const t = useT();
  const intro = win(t, 89.9, 93.0, 0.5);
  const active = GOALS.reduce((a, g, i) => (t >= g.at - 0.3 ? i : a), -1);
  const shown = k(t, 92.6, 93.4);
  const roll = GOALS.reduce((a, g, i) => a + (i ? k(t, g.at - 0.35, g.at + 0.45) : 0), 0);
  const AW = 620;
  const AH = 760;
  const d = archPath(AW, AH);
  const perim = AW * 2 + AH * 2.2;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: intro, transform: `translateY(${-60 * k(t, 92.4, 93.0)}px)` }}>
        <Title text="الأهداف الاستراتيجية" at={90.46} size={130} align="center" rule={false} />
        <div style={{ height: 30 }} />
        <Divider width={600} progress={k(t, 91.0, 92.2)} />
      </AbsoluteFill>
      {/* one arch for all four goals; each new image wipes in right-to-left */}
      <div style={{ position: 'absolute', left: 170, top: 170, width: AW, height: AH, opacity: shown }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: `path('${d}')` }}>
          {GOALS.map((g, i) => {
            const p = i === 0 ? 1 : k(t, g.at - 0.45, g.at + 0.55);
            if (p <= 0) return null;
            const z = 1.12 - 0.1 * k(t, g.at - 0.4, g.end + 0.5, (x) => x);
            return (
              <div key={g.n} style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${(1 - p) * 100}%)` }}>
                <Media src={g.img} pos={g.pos} scale={z} style={g.tint ? { filter: g.tint } : undefined} />
              </div>
            );
          })}
        </div>
        <svg width={AW} height={AH} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path
            d={d}
            fill="none"
            stroke={C.gold}
            strokeWidth={2}
            strokeDasharray={perim}
            strokeDashoffset={perim * (1 - k(t, 92.6, 94.4))}
            transform={`translate(-14 -14) scale(${(AW + 28) / AW} ${(AH + 14) / AH})`}
          />
        </svg>
      </div>
      <div style={{ position: 'absolute', right: 170, top: 190, width: 860, textAlign: 'right', opacity: shown }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, direction: 'rtl' }}>
          <div style={{ height: 200, overflow: 'hidden' }}>
            <div style={{ transform: `translateY(${-roll * 200}px)` }}>
              {GOALS.map((g) => (
                <div
                  key={g.n}
                  style={{ ...font(190, 700, 'transparent'), WebkitTextStroke: `2px ${C.teal}`, direction: 'ltr', lineHeight: '200px', height: 200 }}
                >
                  {g.n}
                </div>
              ))}
            </div>
          </div>
          <Wipe at={93.0} dur={0.8}>
            <p style={{ ...font(36, 700, C.goldDeep) }}>الهدف</p>
          </Wipe>
        </div>
        <div style={{ position: 'relative', height: 420, marginTop: 10 }}>
          {GOALS.map((g, i) => {
            const nx = GOALS[i + 1];
            const e = nx ? k(t, nx.at - 0.55, nx.at - 0.05) : 0;
            if (t < g.at - 0.5 || e >= 1) return null;
            return (
              <div
                key={g.n}
                style={{
                  position: 'absolute',
                  right: 0,
                  width: 860,
                  opacity: 1 - e,
                  transform: `translateY(${-50 * e}px)`,
                  clipPath: `inset(-10% 0 ${e * 100}% 0)`,
                }}
              >
                <Words segs={g.segs} size={62} weight={700} hot={g.hot} lineHeight={1.45} />
              </div>
            );
          })}
        </div>
      </div>
      {/* progress diamonds */}
      <div
        style={{
          position: 'absolute',
          right: 170,
          bottom: 110,
          display: 'flex',
          gap: 26,
          direction: 'rtl',
          alignItems: 'center',
          opacity: shown,
        }}
      >
        {GOALS.map((g, i) => (
          <Diamond
            key={g.n}
            size={i === active ? 26 : 18}
            fill={i === active ? C.teal : i < active ? C.green : C.bg}
            stroke={i === active ? C.teal : i < active ? C.green : C.goldSoft}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const OUTS = [
  { at: 134.44, icon: 'voice', title: 'مخرجات قرآنية عالية الضبط والإتقان', sub: 'خالية من اللحن الجلي والخفي' },
  { at: 142.41, icon: 'teacher', title: 'تأهيل عدد محدد من الطلاب سنويًا', sub: 'للالتحاق ببرامج الإجازات والإسناد' },
  { at: 148.97, icon: 'doc', title: 'أدلة تشغيلية وحقائب تعليمية معتمدة', sub: 'للحلقات المتخصصة' },
  { at: 155.7, icon: 'database', title: 'قاعدة بيانات رقمية مكتملة', sub: 'لمتابعة أداء الطلاب والكادر التعليمي' },
];

export const Outputs: React.FC = () => {
  const t = useT();
  const active = OUTS.reduce((a, o, i) => (t >= o.at - 0.2 ? i : a), -1);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', right: 160, top: 110 }}>
        <Title text="المخرجات المتوقعة" at={130.65} size={110} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 160,
          right: 160,
          top: 400,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 36,
          direction: 'rtl',
        }}
      >
        {OUTS.map((o, i) => {
          const p = k(t, o.at, o.at + 0.9);
          const on = i === active;
          const check = k(t, o.at + 0.5, o.at + 1.3);
          return (
            <div
              key={o.title}
              style={{
                height: 250,
                borderRadius: 30,
                background: '#FFFFFF',
                border: `2px solid ${on ? C.teal : 'rgba(184,154,94,0.35)'}`,
                boxShadow: on ? '0 30px 60px -30px rgba(30,120,140,0.45)' : '0 20px 40px -34px rgba(30,70,80,0.4)',
                opacity: p * (on ? 1 : 0.82),
                transform: `translateY(${(1 - p) * 50}px) scale(${on ? 1 : 0.975})`,
                display: 'flex',
                alignItems: 'center',
                gap: 34,
                padding: '0 44px',
              }}
            >
              <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
                <svg width={130} height={130} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx={65} cy={65} r={60} fill="rgba(43,181,201,0.06)" stroke={C.goldSoft} strokeWidth={1.5} />
                  <circle cx={65} cy={65} r={60} fill="none" stroke={C.green} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={o.icon} at={o.at + 0.2} size={64} color={i % 2 ? C.greenDeep : C.tealDeep} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ ...font(42, 700, C.ink), lineHeight: 1.35 }}>{o.title}</p>
                <p style={{ ...font(32, 300, C.tealDeep), marginTop: 8 }}>{o.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
