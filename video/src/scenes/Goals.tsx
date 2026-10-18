import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Divider } from '../components/Ornaments';
import { Label, Title, Wipe, Words, Seg } from '../components/Type';
import { Diamond, Icon, Photo } from '../components/Visual';
import { C } from '../theme';
import { font, k, useT, win } from '../lib';

const GOALS: { n: string; at: number; end: number; img: string; pos: string; segs: Seg[]; hot: string[] }[] = [
  {
    n: '01',
    at: 93.03,
    end: 102.6,
    img: 'img/06-manuscripts.jpg',
    pos: '8% 60%',
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
    img: 'img/07-graduation-ijazah.jpg',
    pos: '50% 55%',
    segs: [{ s: 103.96, e: 110.8, text: 'إعداد جيل متميز من الحفّاظ المتقنين المؤهلين للالتحاق ببرامج الإجازات والأسانيد' }],
    hot: ['الحفّاظ', 'المتقنين', 'الإجازات', 'والأسانيد'],
  },
  {
    n: '03',
    at: 111.87,
    end: 120.7,
    img: 'img/08-quality-dashboard.jpg',
    pos: '55% 50%',
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
    img: 'img/05-tablet-modern.jpg',
    pos: '45% 50%',
    segs: [
      { s: 121.94, e: 127.38, text: 'توفير بيئة تعليمية جاذبة ومكتملة التجهيزات التقنية والتعليمية' },
      { s: 127.74, e: 129.19, text: 'والسعي لاستدامتها' },
    ],
    hot: ['جاذبة', 'لاستدامتها'],
  },
];

export const Goals: React.FC = () => {
  const t = useT();
  const intro = win(t, 89.9, 93.2, 0.5);
  const active = GOALS.findIndex((g) => t >= g.at - 0.3 && t < g.end);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: intro }}>
        <Label at={90.2}>04</Label>
        <div style={{ height: 10 }} />
        <Title text="الأهداف الاستراتيجية" at={90.46} size={130} align="center" rule={false} />
        <div style={{ height: 30 }} />
        <Divider width={600} progress={k(t, 91.0, 92.2)} />
      </AbsoluteFill>
      {GOALS.map((g, i) => {
        const o = win(t, g.at - 0.3, g.end, 0.45);
        if (o <= 0) return null;
        const num = k(t, g.at - 0.2, g.at + 0.8);
        return (
          <AbsoluteFill key={g.n} style={{ opacity: o }}>
            <Photo src={g.img} w={620} h={760} at={g.at - 0.2} span={10} shape="arch" pos={g.pos} style={{ position: 'absolute', left: 170, top: 170 }} />
            <div style={{ position: 'absolute', right: 170, top: 190, width: 860, textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, direction: 'rtl' }}>
                <span
                  style={{
                    ...font(190, 700, 'transparent'),
                    WebkitTextStroke: `2px ${C.teal}`,
                    direction: 'ltr',
                    lineHeight: 1,
                    opacity: num,
                    transform: `translateY(${(1 - num) * 40}px)`,
                    display: 'inline-block',
                  }}
                >
                  {g.n}
                </span>
                <Wipe at={g.at} dur={0.8}>
                  <p style={{ ...font(32, 300, C.gold), letterSpacing: 4 }}>الهدف</p>
                </Wipe>
              </div>
              <div style={{ height: 24 }} />
              <Words segs={g.segs} size={62} weight={700} hot={g.hot} lineHeight={1.45} />
            </div>
          </AbsoluteFill>
        );
      })}
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
          opacity: k(t, 92.8, 93.6) * (1 - k(t, 130.3, 130.9)),
        }}
      >
        {GOALS.map((g, i) => (
          <Diamond
            key={g.n}
            size={i === active ? 26 : 18}
            fill={i <= active ? C.teal : C.bg}
            stroke={i <= active ? C.teal : C.goldSoft}
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
        <Title text="المخرجات المتوقعة" at={131.39} size={110} label="05" />
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
                  <circle cx={65} cy={65} r={60} fill="none" stroke={C.teal} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={o.icon} at={o.at + 0.2} size={64} />
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
