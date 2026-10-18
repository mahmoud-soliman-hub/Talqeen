import React from 'react';
import { AbsoluteFill } from 'remotion';
import { archPath } from '../components/Ornaments';
import { Label, Title, Wipe, Words } from '../components/Type';
import { Diamond, Icon, Photo } from '../components/Visual';
import { C } from '../theme';
import { font, k, kashida, useT } from '../lib';

// 0:40 — governance, measurement and quality.
export const Governance: React.FC = () => {
  const t = useT();
  const rings = [
    { at: 41.6, label: 'أدوات القياس', icon: 'target', r: 0.86 },
    { at: 43.0, label: 'مؤشرات الأداء', icon: 'chart', r: 0.92 },
    { at: 46.4, label: 'معايير الجودة', icon: 'badge', r: 1 },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 150, top: 300, display: 'flex', gap: 54, direction: 'rtl' }}>
        {rings.map(({ at, label, icon, r }, i) => {
          const p = k(t, at, at + 1.6);
          const R = 118;
          const L = 2 * Math.PI * R;
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: k(t, at - 0.2, at + 0.4), transform: `translateY(${i % 2 ? 40 : 0}px)` }}>
              <div style={{ position: 'relative', width: 280, height: 280 }}>
                <svg width={280} height={280} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx={140} cy={140} r={R} fill="#FFFFFF" stroke={C.goldSoft} strokeWidth={2} opacity={0.9} />
                  <circle
                    cx={140}
                    cy={140}
                    r={R}
                    fill="none"
                    stroke="url(#ring)"
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={L}
                    strokeDashoffset={L * (1 - r * p)}
                  />
                  <defs>
                    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={C.green} />
                      <stop offset="1" stopColor={C.teal} />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={icon} at={at + 0.2} size={92} />
                </div>
              </div>
              <p style={{ ...font(38, 700, C.ink), marginTop: 22 }}>{label}</p>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', right: 150, top: 250, width: 760, textAlign: 'right' }}>
        <Label at={40.3}>منهجية العمل</Label>
        <div style={{ height: 18 }} />
        <Words
          segs={[{ s: 40.41, e: 45.2, text: 'خطط تشغيلية ترتكز على حوكمة أدوات القياس ومؤشرات الأداء' }]}
          size={66}
          weight={700}
          hot={['حوكمة']}
          lineHeight={1.4}
        />
        <div style={{ height: 34 }} />
        <Words
          segs={[{ s: 45.3, e: 50.13, text: 'ضمانًا لأعلى معايير الجودة الإقرائية والمؤسسية' }]}
          size={50}
          color={C.inkSoft}
          hot={['الجودة']}
        />
      </div>
    </AbsoluteFill>
  );
};

// 0:51 — vision.
export const Vision: React.FC = () => (
  <AbsoluteFill>
    <Photo src="img/03-mashrabiya-window.jpg" w={560} h={800} at={51.0} span={12.5} shape="arch" pos="30% 50%" style={{ position: 'absolute', left: 190, top: 150 }} />
    <div style={{ position: 'absolute', right: 170, top: 210, width: 920 }}>
      <Title text="الرؤية" at={51.55} size={160} label="01" />
      <div style={{ height: 40 }} />
      <Words
        segs={[
          { s: 52.75, e: 55.92, text: 'الريادة في تأسيس نموذج تعليمي قرآني' },
          { s: 56.23, e: 57.52, text: 'أداءً وإتقانًا،' },
          { s: 57.82, e: 59.09, text: 'وتلاوةً وحفظًا' },
          { s: 59.45, e: 62.64, text: 'وفق أعلى معايير الضبط والجودة الإقرائية.' },
        ]}
        size={54}
        hot={['الريادة', 'أداءً', 'وإتقانًا', 'وتلاوةً', 'وحفظًا']}
        style={{ textAlign: 'right' }}
      />
    </div>
  </AbsoluteFill>
);

// 1:03 — mission, four pillars.
export const Mission: React.FC = () => {
  const t = useT();
  const cards = [
    { at: 68.66, icon: 'book', title: 'مناهج إقرائية', sub: 'معتمدة' },
    { at: 71.0, img: 'img/04-teacher-hands.jpg', title: 'كفاءات تعليمية', sub: 'مؤهلة' },
    { at: 73.87, icon: 'shield', title: 'ضبط التلاوة', sub: 'وترسيخ أحكام الإتقان' },
    { at: 77.28, icon: 'tablet', title: 'تقنيات حديثة', sub: 'وأساليب تربوية جاذبة' },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', right: 160, top: 110, width: 1600, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', direction: 'rtl' }}>
        <Title text="الرسالة" at={63.7} size={140} label="02" />
        <div style={{ width: 860, textAlign: 'left', paddingBottom: 26 }}>
          <Words segs={[{ s: 65.07, e: 68.36, text: 'تقديم بيئة تعليمية قرآنية نموذجية' }]} size={56} weight={700} hot={['نموذجية']} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 160, right: 160, top: 470, display: 'flex', gap: 36, direction: 'rtl' }}>
        {cards.map((c) => {
          const p = k(t, c.at, c.at + 0.9);
          return (
            <div
              key={c.title}
              style={{
                flex: 1,
                height: 470,
                borderRadius: 30,
                background: '#FFFFFF',
                boxShadow: '0 30px 60px -36px rgba(30,70,80,0.45)',
                overflow: 'hidden',
                opacity: p,
                transform: `translateY(${(1 - p) * 60}px)`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 250, position: 'relative', background: 'linear-gradient(160deg, #F6F4EE, #EEF6F5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.img ? (
                  <Photo src={c.img} w={392} h={250} at={c.at} span={10} radius={0} pos="60% 40%" />
                ) : (
                  <Icon name={c.icon!} at={c.at + 0.2} size={120} stroke={1.1} />
                )}
              </div>
              <div style={{ padding: '30px 34px', textAlign: 'right' }}>
                <p style={font(44, 700, C.ink)}>{c.title}</p>
                <p style={font(34, 300, C.tealDeep)}>{c.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 1:23 — values: three arches.
export const Values: React.FC = () => {
  const t = useT();
  const vals = [
    { at: 84.76, w: 'الإتقان', icon: 'badge' },
    { at: 86.41, w: 'التمكين', icon: 'growth' },
    { at: 88.0, w: 'الاستدامة', icon: 'leaf' },
  ];
  const W = 380;
  const H = 520;
  const d = archPath(W, H);
  const perim = W * 2 + H * 2.2;
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ marginTop: 90 }}>
        <Title text="القيم" at={82.97} size={130} align="center" label="03" />
      </div>
      <div style={{ display: 'flex', gap: 90, marginTop: 50, direction: 'rtl' }}>
        {vals.map(({ at, w, icon }) => {
          const p = k(t, at, at + 1.2);
          return (
            <div key={w} style={{ position: 'relative', width: W, height: H, transform: `translateY(${(1 - p) * 40}px)` }}>
              <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                <defs>
                  <linearGradient id={`v-${w}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#EEF7F6" />
                  </linearGradient>
                </defs>
                <path d={d} fill={`url(#v-${w})`} opacity={p} />
                <path d={d} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray={perim} strokeDashoffset={perim * (1 - p)} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
                <Icon name={icon} at={at + 0.3} size={96} />
                <div style={{ height: 36 }} />
                <Wipe at={at + 0.25} dur={0.9}>
                  <p style={font(66, 700, C.ink)}>{kashida(w, 2)}</p>
                </Wipe>
                <Diamond size={14} fill={C.gold} style={{ marginTop: 26, opacity: p }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
